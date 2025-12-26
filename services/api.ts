/**
 * Prompt Optimization API Service
 *
 * Calls the backend LLM API to optimize prompts
 * Uses OpenAI SDK for better compatibility with various LLM providers
 */

import OpenAI from 'openai';
import { OptimizationResult, AnalysisTableRow, ApiConfig, PromptOptions } from '@/types';

// Request timeout (milliseconds)
const REQUEST_TIMEOUT = 60000;

// Default API base (can be overridden via ApiConfig)
const DEFAULT_API_BASE = '/api/v1';

// System prompt for prompt optimization
export const DEFAULT_SYSTEM_PROMPT = `你是一位资深 Prompt 工程师，专门优化 AI 提示词。

## 你的角色
- 10年+ 大语言模型提示词优化经验
- 精通 Claude、GPT、Gemini 等主流模型的提示词最佳实践
- 擅长将模糊需求转化为结构化、可执行的提示词

## 语气
- 专业但友好
- 犀利指出问题，但提供建设性建议
- 使用中文输出

## 评分标准
- 0分：输入为空、无意义或不是提示词
- 1-3分：模糊、无结构、意图不清
- 4-5分：意图清晰但缺少结构/上下文/约束
- 6-7分：有结构但缺少示例/格式规范/边界处理
- 8-9分：专业级 - 角色明确、结构清晰、输出定义完整
- 10分：生产级 - 技术全面应用、边界情况处理、包含高质量示例`;

// User prompt template
export const DEFAULT_USER_PROMPT_TEMPLATE = `<original_prompt>
{{input}}
</original_prompt>

<optimization_techniques>
1. 角色定义 - 分配专业角色和相关经验，建立权威上下文
2. 上下文分离 - 背景信息与具体任务分开，上下文置于指令之前
3. 明确任务 - 正向表述（做什么而非不做什么），复杂任务分步骤编号
4. XML 结构化 - 使用语义化标签组织内容：<context>、<task>、<rules>、<output_format>、<example>
5. 少样本示例 - 复杂输出需提供 1-2 个示例展示期望格式（这是最有效的技术之一）
6. 思维链 - 推理任务要求分步思考，可用 <thinking> 标签引导
7. 输出规范 - 明确格式、长度、语言、风格要求
8. 边界处理 - 明确异常情况的具体处理方式
</optimization_techniques>

<analysis_dimensions>
- 结构化：信息组织和流程是否清晰
- 明确性：指令是否有歧义
- 可验证：成功标准是否清晰可衡量
- 任务拆解：复杂任务是否分步
- 边界约束：限制条件和异常处理是否明确
- 示例质量：是否有高质量示例引导输出
- 输出规范：格式要求是否清晰完整
</analysis_dimensions>

<examples>
<example>
<example_description>低分案例：极简但模糊的提示词</example_description>
<example_input>帮我写一封邮件</example_input>
<example_output>
<response>
<score>2</score>
<roast>这个提示词几乎什么都没说。写给谁？什么目的？什么语气？邮件长度？这不是在写提示词，这是在考验 AI 的读心术。没有上下文、没有约束、没有格式要求，AI 只能靠猜。</roast>
<diagnosis>
<item>缺少收件人信息：不知道写给谁，无法确定称呼和关系</item>
<item>缺少邮件目的：不知道为什么写，无法确定内容重点</item>
<item>缺少格式要求：语气、长度、结构都没有说明</item>
</diagnosis>
<analysisTable>
<row><dimension>明确性</dimension><originalIssue>完全没有上下文信息</originalIssue><optimized>添加收件人、目的、背景说明</optimized></row>
<row><dimension>输出规范</dimension><originalIssue>无任何格式要求</originalIssue><optimized>指定语气、长度、邮件结构</optimized></row>
<row><dimension>边界约束</dimension><originalIssue>没有任何限制条件</originalIssue><optimized>明确什么该写什么不该写</optimized></row>
<row><dimension>可验证</dimension><originalIssue>无法判断输出是否符合预期</originalIssue><optimized>定义成功标准</optimized></row>
</analysisTable>
<optimizationDetails>
<item><change>角色定义</change><effect>建立专业写作助手身份，提升输出质量</effect></item>
<item><change>上下文补充</change><effect>提供必要背景信息，让 AI 理解场景</effect></item>
<item><change>XML 结构化</change><effect>清晰分离不同类型的信息</effect></item>
<item><change>输出规范</change><effect>明确语气、长度等要求</effect></item>
</optimizationDetails>
<optimizedPrompt>
<zh>你是一位专业的商务写作助手，擅长撰写清晰、得体的商务邮件。

<context>
我是[你的职位]，需要给[收件人称呼，如：客户/同事/上级]写一封邮件。
背景：[简述邮件背景，如：跟进上周的会议讨论]
目的：[邮件核心目的，如：确认下一步行动计划]
</context>

<task>
请帮我撰写这封邮件，要求：
1. 语气：[正式/友好/专业但亲切]
2. 长度：[简短100字内/中等200字/详细300字以上]
3. 结构：包含问候、正文、行动号召、结束语
</task>

<rules>
- 避免使用过于生硬的措辞
- 重点突出[核心诉求]
- 如果信息不足，请告诉我还需要什么信息
</rules></zh>
<en>You are a professional business writing assistant skilled at crafting clear, appropriate business emails.

<context>
I am [your position] and need to write an email to [recipient, e.g., client/colleague/supervisor].
Background: [brief context, e.g., following up on last week's meeting]
Purpose: [core purpose, e.g., confirm next steps]
</context>

<task>
Please help me write this email with these requirements:
1. Tone: [formal/friendly/professional yet warm]
2. Length: [brief under 100 words/medium 200 words/detailed 300+ words]
3. Structure: include greeting, body, call to action, closing
</task>

<rules>
- Avoid overly stiff language
- Emphasize [core request]
- If information is insufficient, tell me what else you need
</rules></en>
</optimizedPrompt>
</response>
</example_output>
</example>

<example>
<example_description>边界案例：空输入</example_description>
<example_input></example_input>
<example_output>
<response>
<score>0</score>
<roast>空的。什么都没有。这就像让厨师做菜但不告诉他做什么——结果只能是一盘空气。请提供你想要优化的提示词，我才能帮你分析和改进。</roast>
<diagnosis>
<item>输入为空：没有任何内容可供分析和优化</item>
</diagnosis>
<analysisTable>
<row><dimension>明确性</dimension><originalIssue>无任何输入内容</originalIssue><optimized>请提供需要优化的提示词</optimized></row>
</analysisTable>
<optimizationDetails>
<item><change>无法应用任何技术</change><effect>需要先提供原始提示词</effect></item>
</optimizationDetails>
<optimizedPrompt>
<zh>请提供您想要优化的提示词，我将从以下维度进行分析：
- 角色定义是否清晰
- 任务描述是否明确
- 输出格式是否规范
- 是否包含有效示例</zh>
<en>Please provide the prompt you want to optimize. I will analyze it from these dimensions:
- Role definition clarity
- Task description specificity
- Output format specification
- Example quality</en>
</optimizedPrompt>
</response>
</example_output>
</example>

<example>
<example_description>中高分案例：有结构但可改进的提示词</example_description>
<example_input>你是一个专业的代码审查助手。请审查以下代码，检查潜在的bug、性能问题和代码风格问题。对于每个问题，说明问题所在、严重程度（高/中/低）、以及修复建议。如果代码没有问题，请说明代码的优点。</example_input>
<example_output>
<response>
<score>7</score>
<roast>不错的开始！角色清晰，任务明确，输出结构也有了雏形。但还差临门一脚：没有示例展示你期望的输出格式长什么样，代码应该放在哪里也没说清楚，而且对于不同编程语言是否有不同的审查重点也没有说明。</roast>
<diagnosis>
<item>缺少输入占位符：没有明确代码应该放在提示词的什么位置</item>
<item>缺少输出示例：审查结果的具体格式没有示范</item>
<item>边界处理模糊：不同语言、不同类型代码的处理方式未说明</item>
</diagnosis>
<analysisTable>
<row><dimension>结构化</dimension><originalIssue>纯文本描述，信息混在一起</originalIssue><optimized>使用 XML 标签分离角色、任务、输出格式</optimized></row>
<row><dimension>示例质量</dimension><originalIssue>完全没有示例</originalIssue><optimized>添加一个审查输出的具体示例</optimized></row>
<row><dimension>边界约束</dimension><originalIssue>未说明特殊情况处理</originalIssue><optimized>明确代码为空、代码过长等情况的处理</optimized></row>
<row><dimension>输出规范</dimension><originalIssue>格式描述不够具体</originalIssue><optimized>提供结构化的输出模板</optimized></row>
</analysisTable>
<optimizationDetails>
<item><change>XML 结构化</change><effect>清晰分离角色、输入、任务、输出格式各部分</effect></item>
<item><change>添加少样本示例</change><effect>通过具体示例明确期望的输出格式和详细程度</effect></item>
<item><change>输入占位符</change><effect>明确代码放置位置，避免混淆</effect></item>
<item><change>边界处理</change><effect>说明特殊情况的应对方式</effect></item>
</optimizationDetails>
<optimizedPrompt>
<zh>你是一个专业的代码审查助手，拥有10年以上的软件开发和代码审查经验，擅长发现代码中的潜在问题并提供改进建议。

<code_to_review>
{{在此粘贴需要审查的代码}}
</code_to_review>

<task>
请审查上述代码，重点检查以下方面：
1. 潜在的 bug 和逻辑错误
2. 性能问题和优化空间
3. 代码风格和可读性问题
4. 安全隐患（如适用）
</task>

<output_format>
对于发现的每个问题，请按以下格式输出：

**问题 N：[问题标题]**
- 位置：[行号或代码片段]
- 严重程度：高/中/低
- 问题描述：[具体说明问题是什么]
- 修复建议：[如何修复]

如果代码质量良好没有明显问题，请说明代码的优点和值得学习的地方。
</output_format>

<example>
**问题 1：空指针风险**
- 位置：第15行 user.getName()
- 严重程度：高
- 问题描述：在调用 getName() 前未检查 user 是否为 null
- 修复建议：添加 null 检查：if (user != null) { user.getName(); } 或使用 Optional
</example>

<rules>
- 按严重程度从高到低排列问题
- 每个问题都要提供可执行的修复建议
- 如果代码片段不完整无法判断，请说明需要哪些额外信息
</rules></zh>
<en>You are a professional code review assistant with 10+ years of software development and code review experience.

<code_to_review>
{{paste code to review here}}
</code_to_review>

<task>
Review the code above, focusing on:
1. Potential bugs and logic errors
2. Performance issues and optimization opportunities
3. Code style and readability issues
4. Security concerns (if applicable)
</task>

<output_format>
For each issue found, use this format:

**Issue N: [title]**
- Location: [line number or code snippet]
- Severity: High/Medium/Low
- Description: [what the problem is]
- Fix: [how to fix it]

If the code is well-written with no obvious issues, highlight its strengths.
</output_format>

<example>
**Issue 1: Null pointer risk**
- Location: Line 15 user.getName()
- Severity: High
- Description: No null check before calling getName()
- Fix: Add null check or use Optional
</example></en>
</optimizedPrompt>
</response>
</example_output>
</example>
</examples>

<task>
分析 <original_prompt> 中的提示词：
1. 评估其质量并给出 0-10 分的评分
2. 用犀利但建设性的语气指出核心问题（roast）
3. 列出 3 个最关键的问题（diagnosis）
4. 选择 4-6 个最相关的分析维度进行对比分析
5. 说明应用了哪些优化技术及其效果
6. 生成结构化的优化版本（中英文双语）
</task>

<output_format>
严格按以下 XML 格式输出，直接以 <response> 开始，不要有任何前缀文字：

<response>
<score>评分(0-10整数)</score>
<roast>中文点评，100-200字，犀利指出核心问题，要有建设性</roast>
<diagnosis>
<item>问题1：具体描述</item>
<item>问题2：具体描述</item>
<item>问题3：具体描述</item>
</diagnosis>
<analysisTable>
<row><dimension>维度名称</dimension><originalIssue>原 Prompt 问题</originalIssue><optimized>优化方案</optimized></row>
</analysisTable>
<optimizationDetails>
<item><change>应用的技术</change><effect>具体效果</effect></item>
</optimizationDetails>
<optimizedPrompt>
<zh>优化后的中文提示词，使用 XML 标签组织结构</zh>
<en>Optimized English prompt with XML structure</en>
</optimizedPrompt>
</response>
</output_format>`;

/**
 * Build user prompt by replacing {{input}} placeholder in template
 */
export const buildUserPrompt = (input: string, template: string = DEFAULT_USER_PROMPT_TEMPLATE): string => {
  return template.replace('{{input}}', input);
};

// Prefill to force Claude to start with XML response directly
const RESPONSE_PREFILL = '<response>';

/**
 * Extract text content from an XML tag
 */
function extractXmlTag(xml: string, tag: string): string {
  const regex = new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`);
  const match = xml.match(regex);
  return match ? match[1].trim() : '';
}

/**
 * Extract all items from a repeated XML tag
 */
function extractXmlItems(xml: string, tag: string): string[] {
  const regex = new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`, 'g');
  const items: string[] = [];
  let match;
  while ((match = regex.exec(xml)) !== null) {
    items.push(match[1].trim());
  }
  return items;
}

/**
 * Parse the LLM response XML
 * Falls back gracefully when parsing fails
 */
function parseOptimizationResponse(content: string): OptimizationResult {
  let fullContent = content.trim();
  if (!fullContent.startsWith('<response>')) {
    fullContent = RESPONSE_PREFILL + fullContent;
  }

  const responseMatch = fullContent.match(/<response>([\s\S]*?)<\/response>/);
  const xml = responseMatch ? responseMatch[1] : fullContent;

  // Parse with fallbacks for each field
  const scoreStr = extractXmlTag(xml, 'score');
  const score = parseInt(scoreStr, 10) || 5;

  const roast = extractXmlTag(xml, 'roast') || '解析响应时出现问题，请查看原始内容';

  const diagnosisBlock = extractXmlTag(xml, 'diagnosis');
  const diagnosis = extractXmlItems(diagnosisBlock, 'item');

  const analysisTableBlock = extractXmlTag(xml, 'analysisTable');
  const rows = extractXmlItems(analysisTableBlock, 'row');
  const analysisTable: AnalysisTableRow[] = rows.map((row) => ({
    dimension: extractXmlTag(row, 'dimension') || '-',
    originalIssue: extractXmlTag(row, 'originalIssue') || '-',
    optimized: extractXmlTag(row, 'optimized') || '-',
  }));

  const detailsBlock = extractXmlTag(xml, 'optimizationDetails');
  const detailItems = extractXmlItems(detailsBlock, 'item');
  const optimizationDetails = detailItems.map((item) => ({
    change: extractXmlTag(item, 'change') || '-',
    effect: extractXmlTag(item, 'effect') || '-',
  }));

  const promptBlock = extractXmlTag(xml, 'optimizedPrompt');
  let optimizedPrompt = {
    zh: extractXmlTag(promptBlock, 'zh'),
    en: extractXmlTag(promptBlock, 'en'),
  };

  // Fallback: if optimizedPrompt parsing failed, try to extract any useful content
  if (!optimizedPrompt.zh && !optimizedPrompt.en) {
    // Try to use the raw content as fallback
    const rawContent = content.replace(/<\/?response>/g, '').trim();
    if (rawContent) {
      optimizedPrompt = {
        zh: `[解析失败，原始响应]\n\n${rawContent}`,
        en: `[Parse failed, raw response]\n\n${rawContent}`,
      };
    }
  }

  return {
    score,
    roast,
    diagnosis: diagnosis.length > 0 ? diagnosis : ['响应解析不完整'],
    analysisTable: analysisTable.length > 0 ? analysisTable : undefined,
    optimizationDetails: optimizationDetails.length > 0 ? optimizationDetails : [{ change: '-', effect: '-' }],
    optimizedPrompt,
  };
}

/**
 * Create OpenAI client instance with proper configuration
 */
async function createOpenAIClient(apiConfig: ApiConfig): Promise<OpenAI> {
  let apiBase = apiConfig.apiBase?.trim() || DEFAULT_API_BASE;
  const apiKey = apiConfig.apiKey;

  // Convert relative path to full URL in browser
  if (apiBase.startsWith('/') && typeof window !== 'undefined') {
    apiBase = `${window.location.origin}${apiBase}`;
  }

  // Remove /chat/completions suffix if present (SDK adds it automatically)
  if (apiBase.endsWith('/chat/completions')) {
    apiBase = apiBase.slice(0, -'/chat/completions'.length);
  }

  const config: ConstructorParameters<typeof OpenAI>[0] = {
    // Only set apiKey if user configured one; otherwise let backend use its own key
    apiKey: apiKey || 'dummy-key-for-sdk',
    baseURL: apiBase,
    timeout: REQUEST_TIMEOUT,
    maxRetries: 2,
    dangerouslyAllowBrowser: true,
    // Don't send Authorization header when using backend's key
    ...(apiKey ? {} : { defaultHeaders: { Authorization: '' } }),
  };

  return new OpenAI(config);
}

/**
 * Non-streaming API call
 */
export async function optimizePrompt(
  input: string,
  model: string,
  options: PromptOptions = {},
  apiConfig: ApiConfig = {}
): Promise<OptimizationResult> {
  const systemPrompt = options.systemPrompt || DEFAULT_SYSTEM_PROMPT;
  const userPromptTemplate = options.userPromptTemplate || DEFAULT_USER_PROMPT_TEMPLATE;

  const client = await createOpenAIClient(apiConfig);

  try {
    const response = await client.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: buildUserPrompt(input, userPromptTemplate) },
        { role: 'assistant', content: RESPONSE_PREFILL },
      ],
      stream: false,
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content || '';
    return parseOptimizationResponse(content);
  } catch (err) {
    if (err instanceof OpenAI.APIError) {
      throw new Error(`API 错误 (${err.status}): ${err.message}`);
    }
    if (err instanceof OpenAI.APIConnectionError) {
      throw new Error(
        `无法连接到后端服务。请确认后端服务已启动并运行在正确端口。(${err.message})`
      );
    }
    throw err;
  }
}

/**
 * Streaming API call with progress callback
 */
export async function optimizePromptStream(
  input: string,
  model: string,
  onProgress?: (partial: string) => void,
  options: PromptOptions = {},
  apiConfig: ApiConfig = {}
): Promise<OptimizationResult> {
  const systemPrompt = options.systemPrompt || DEFAULT_SYSTEM_PROMPT;
  const userPromptTemplate = options.userPromptTemplate || DEFAULT_USER_PROMPT_TEMPLATE;

  const client = await createOpenAIClient(apiConfig);

  try {
    const stream = await client.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: buildUserPrompt(input, userPromptTemplate) },
        { role: 'assistant', content: RESPONSE_PREFILL },
      ],
      stream: true,
      temperature: 0.7,
    });

    let fullContent = '';
    let hasReceivedData = false;

    for await (const chunk of stream) {
      hasReceivedData = true;
      const delta = chunk.choices[0]?.delta as {
        content?: string;
        reasoning_content?: string;
      };

      const content = delta?.content || delta?.reasoning_content || '';

      if (content) {
        fullContent += content;
        onProgress?.(fullContent);
      }
    }

    if (!hasReceivedData || !fullContent.trim()) {
      throw new Error('未收到任何响应数据。请检查后端服务是否正常运行。');
    }

    return parseOptimizationResponse(fullContent);
  } catch (err) {
    if (err instanceof TypeError && err.message.includes('fetch')) {
      throw new Error('网络请求失败。请检查网络连接和后端服务状态。');
    }
    if (err instanceof OpenAI.APIError) {
      throw new Error(`API 错误 (${err.status}): ${err.message}`);
    }
    if (err instanceof OpenAI.APIConnectionError) {
      throw new Error(
        `无法连接到后端服务。请确认后端服务已启动并运行在正确端口。`
      );
    }
    if (err instanceof Error) {
      throw err;
    }
    throw new Error(`请求失败: ${String(err)}`);
  }
}
