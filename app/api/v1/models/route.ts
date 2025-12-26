/**
 * Models API Route
 *
 * Returns available models for the free tier
 *
 * Environment variables:
 * - FREE_MODELS: Comma-separated list of free model IDs (e.g., "deepseek,mistral")
 * - DEFAULT_MODEL: Default model ID
 */

import { NextResponse } from 'next/server';

// Free models configuration from environment variables
const FREE_MODELS_STR = process.env.FREE_MODELS || 'deepseek';
const DEFAULT_MODEL = process.env.DEFAULT_MODEL || 'deepseek';

// Parse free models list
const FREE_MODELS = FREE_MODELS_STR.split(',').map((m) => m.trim()).filter(Boolean);

// Model display names
const MODEL_LABELS: Record<string, string> = {
  'deepseek': 'DeepSeek',
  'mistral': 'Mistral',
  'openai': 'GPT-4o',
  'openai-fast': 'GPT-4o Mini',
  'openai-large': 'GPT-4.5',
  'claude': 'Claude Sonnet',
  'claude-fast': 'Claude Haiku',
  'claude-large': 'Claude Opus',
  'gemini': 'Gemini Pro',
  'gemini-fast': 'Gemini Flash',
  'grok': 'Grok',
  'qwen-coder': 'Qwen Coder',
};

export async function GET() {
  const models = FREE_MODELS.map((id) => ({
    id,
    label: MODEL_LABELS[id] || id,
    isDefault: id === DEFAULT_MODEL,
  }));

  return NextResponse.json({
    models,
    defaultModel: DEFAULT_MODEL,
  });
}
