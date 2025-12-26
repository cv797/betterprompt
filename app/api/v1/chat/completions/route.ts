/**
 * LLM API Proxy Route
 *
 * Uses OpenAI SDK to forward requests to the backend LLM service
 * Supports streaming responses
 *
 * Environment variables:
 * - LLM_BACKEND_URL: Backend API base URL (without /chat/completions)
 * - LLM_API_KEY: Backend API key
 */

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Backend configuration from environment variables
const BACKEND_URL = process.env.LLM_BACKEND_URL || '';
const API_KEY = process.env.LLM_API_KEY || '';

// Get base URL (remove /chat/completions if present)
function getBaseUrl(url: string): string {
  if (url.endsWith('/chat/completions')) {
    return url.slice(0, -'/chat/completions'.length);
  }
  return url;
}

// Create OpenAI client
function createClient(apiKey?: string): OpenAI {
  const baseURL = getBaseUrl(BACKEND_URL);
  const key = apiKey || API_KEY;

  return new OpenAI({
    apiKey: key || 'dummy',
    baseURL,
    timeout: 120000,
    maxRetries: 2,
  });
}

export async function POST(request: NextRequest) {

  if (!BACKEND_URL) {
    return NextResponse.json(
      { error: { message: 'LLM backend not configured. Set LLM_BACKEND_URL environment variable.', type: 'config_error' } },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    // Check if client provided their own API key
    const clientAuth = request.headers.get('Authorization');
    const clientApiKey = clientAuth?.startsWith('Bearer ') ? clientAuth.slice(7) : undefined;
    // Ignore placeholder keys
    const effectiveClientKey = clientApiKey && !clientApiKey.startsWith('dummy') && !clientApiKey.startsWith('sk-placeholder')
      ? clientApiKey
      : undefined;

    const client = createClient(effectiveClientKey);
    const isStreaming = body.stream === true;

    if (isStreaming) {
      // Streaming response
      const stream = await client.chat.completions.create({
        ...body,
        stream: true,
      } as OpenAI.Chat.Completions.ChatCompletionCreateParamsStreaming);

      // Convert to SSE format
      const encoder = new TextEncoder();
      const readable = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of stream) {
              const data = JSON.stringify(chunk);
              controller.enqueue(encoder.encode(`data: ${data}\n\n`));
            }
            controller.enqueue(encoder.encode('data: [DONE]\n\n'));
            controller.close();
          } catch (error) {
            console.error('[LLM Proxy] Stream error:', error);
            controller.error(error);
          }
        },
      });

      return new Response(readable, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    } else {
      // Non-streaming response
      const response = await client.chat.completions.create({
        ...body,
        stream: false,
      });
      return NextResponse.json(response);
    }
  } catch (error) {
    console.error('[LLM Proxy] Error:', error);

    if (error instanceof OpenAI.APIError) {
      return NextResponse.json(
        { error: { message: error.message, type: 'api_error', code: error.code } },
        { status: error.status || 500 }
      );
    }

    return NextResponse.json(
      {
        error: {
          message: error instanceof Error ? error.message : 'Internal server error',
          type: 'proxy_error',
        },
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS
// Note: In production, consider restricting Access-Control-Allow-Origin to specific domains
export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin') || '';

  // Allow same-origin requests and localhost for development
  const allowedOrigins = [
    process.env.ALLOWED_ORIGIN, // Set this in production
    'http://localhost:3000',
    'http://127.0.0.1:3000',
  ].filter(Boolean);

  const isAllowed = allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development';

  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': isAllowed ? origin : '',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
