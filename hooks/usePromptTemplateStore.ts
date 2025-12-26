'use client';

/**
 * Prompt Template Store - localStorage based template management
 */

import { useState, useEffect, useCallback } from 'react';
import { PromptTemplate } from '@/types';
import { DEFAULT_SYSTEM_PROMPT, DEFAULT_USER_PROMPT_TEMPLATE } from '@/services/api';

const STORAGE_KEY = 'better-prompt-templates';
const SELECTED_TEMPLATE_KEY = 'better-prompt-selected-template';
const DEFAULT_TEMPLATE_ID = 'default';
const TEXT2IMAGE_TEMPLATE_ID = 'text2image';
const IMAGE2IMAGE_TEMPLATE_ID = 'image2image';

// All builtin template IDs
const BUILTIN_TEMPLATE_IDS = [DEFAULT_TEMPLATE_ID, TEXT2IMAGE_TEMPLATE_ID, IMAGE2IMAGE_TEMPLATE_ID];

interface PromptTemplateStore {
  templates: PromptTemplate[];
  selectedTemplateId: string;
  selectedTemplate: PromptTemplate | undefined;
  addTemplate: (template: Omit<PromptTemplate, 'id' | 'isDefault' | 'createdAt' | 'updatedAt'>) => string;
  updateTemplate: (id: string, updates: Partial<Pick<PromptTemplate, 'name' | 'description' | 'systemPrompt' | 'userPromptTemplate'>>) => void;
  deleteTemplate: (id: string) => void;
  selectTemplate: (id: string) => void;
  resetDefaultTemplate: () => void;
}

const generateId = () => {
  return `tpl-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const createDefaultTemplate = (): PromptTemplate => ({
  id: DEFAULT_TEMPLATE_ID,
  name: '通用优化',
  description: '默认的提示词优化模板，适用于大多数场景',
  systemPrompt: DEFAULT_SYSTEM_PROMPT,
  userPromptTemplate: DEFAULT_USER_PROMPT_TEMPLATE,
  isDefault: true,
  createdAt: Date.now(),
  updatedAt: Date.now(),
});

// Text-to-image optimization template
const TEXT2IMAGE_SYSTEM_PROMPT = `# Role: 通用自然语言图像提示词优化专家

## Profile
- Author: prompt-optimizer
- Version: 1.3.0
- Language: 中文
- Description: 面向多模态图像模型的通用自然语言提示词优化，围绕主体、动作、环境锚点、构图/视角、光线/时间、色彩/材质与氛围进行层次化叙述；全程使用自然语言，不含参数、权重或负面清单

## Background
- 多模态大模型对自然语言理解良好；无需标签、权重或负面清单
- 结构化的画面信息（主体、构图、光线、配色、材质、氛围）能显著提升可控性与稳定性
- 使用连贯的自然语言代替关键词堆砌，追求具体、可视且细节分层的描述

## 任务理解
围绕用户的原始描述进行直接丰富与结构化表达；通过自然语言补充主体特征、动作与互动、环境锚点、光线与配色、材质与纹理、氛围与情绪、构图与视角（必要时说明画幅）。

## Skills
1. 主体与动作
   - 用 2–3 个精准修饰词刻画形态、表情与质感
   - 加入一个明确动作或与道具的互动，增强叙事性
   - 当需要表达互动或动态感时，用自然语言加入细微动作线索：眼神交流、手势回应、身体轻微前倾/转动、表情呼应、物体微动（如杯中水波、器物轻碰）；避免僵硬摆拍与完全静态的描述
2. 环境与空间
   - 设置可识别的环境锚点（小屋/花园小径/林间空地等）
   - 明确前景/中景/背景层次，稳定空间关系
3. 光线与时间
   - 描述光质与方向（柔和/硬朗，侧光/逆光/顶光等）
   - 指明时间氛围（清晨/黄昏/夜景），与光线效果相呼应
   - 补充"定向光/侧光/逆光/边缘高光/光斑与反射"的情感作用
   - 说明光线对主体的作用（勾勒轮廓、突出五官、柔化背景）
4. 色彩与材质
   - 主色倾向与互补对比（粉彩/暖土色/冷色系）
   - 材质质感与画面肌理（手绘线条/柔和笔触/纸张颗粒/金属/玻璃/织物）
   - 示例材质：胶片颗粒/塑料/金属/玻璃/橡胶/纸张颗粒；强调真实细节（倒角、反射、微刮痕）
5. 氛围与风格
   - 用抽象风格词表达统一审美（童话/故事书/田园温馨/冷峻/戏剧性）
6. 构图与视角
   - 说明画幅（如"正方形构图/方幅画面"）、镜头距离（特写/半身/大全景）与视角（平视/俯视/仰视）
   - 补充构图类型（自拍构图/等轴测/三视图），以自然语言表达画幅与视角
7. 对比与呼应
   - 明暗、冷暖、软硬、动静等对比形成画面张力
   - 前景细节与背景意象形成主题呼应与统一性

## Goals
- 产出清晰、具体、具画面感的自然语言提示词
- 不包含参数、权重或负面清单
- 语言简洁连贯，可直接使用

## Constraints
- 不使用采样/步数/seed 等技术参数
- 不使用权重语法或负面清单
- 保持原始创意意图

## 质量保底
- 清晰焦点与干净边缘；背景简洁不干扰主体
- 关注主体，避免信息过载；保持构图稳定

## 创作指引
- 保留原始创意意图，以自然语言直观表达
- 采用结构化叙述：将信息组织为3-6个独立但连贯的句子
  * 简单场景：3句；复杂场景：5-6句
  * 每句话专注1个核心任务，避免在单句中堆砌过多维度
- 修饰词密度：每个关键名词应配2-3个精准修饰词
  * 示例：不只说"光线"，而是"柔和的、漫射的晨光"
  * 示例：不只说"熊猫"，而是"蓬松黑白毛发的大熊猫"
 - 推荐句子任务分配：
   * 句1：主体+关键特征+动作+环境锚点
   * 句2：光照来源+光质+时间+配色倾向
   * 句3：氛围与情绪+抽象风格词
   * 句4（可选）：材质与纹理（线条/笔触/纸张颗粒等）
   * 句5（可选）：构图/视角/画幅（自然语言表达，如等轴测/自拍构图）
   * 句6（可选）：叙事张力/意象（小冲突、停顿与呼吸空间）
  * 动态/互动表现建议：使用"抓拍瞬间""正在……中""彼此注视与手势回应"等自然语言；结合浅景深与微小动作线索（如手部轻微运动、物体轻碰/微震）以弱化静态摆拍感
- 用自然语言替代技术参数：
  * 比例用"正方形构图/方幅画面"等表述
  * 风格用"电影级动画的圆润体积与柔和材质"等抽象特征

## Output Requirements
- 直接输出优化后的提示词（自然语言、纯文本）
- 禁止添加任何前缀或解释说明；仅输出提示词本体
- 输出结构：3–6 个独立但连贯的句子（简单场景 3 句，复杂场景 5–6 句）
- 每句专注 1 个核心维度，使用完整的叙述性语言，避免关键词堆砌
- 每个关键名词配 2–3 个精准修饰词，提升信息密度
- 不使用参数/权重/负面清单
- 不使用列表、代码块或 JSON
- 鼓励在自然语言中体现对比与呼应（明暗/冷暖/软硬/动静），增强叙事与可读性`;

const TEXT2IMAGE_USER_PROMPT_TEMPLATE = `请将以下描述优化为通用的自然语言图像提示词：

说明：
- 仅使用自然语言；不包含参数、权重或负面清单
- 输出 3–6 个结构化的句子，每句专注 1 个核心维度
- 每个关键名词配 2–3 个精准修饰词（如"柔和、漫射的晨光"）
- 句式参考：主体+动作+环境锚点 → 光照+时间+配色 → 氛围+风格 → （可选）材质纹理/构图视角

原始描述：
{{input}}

请输出优化后的提示词：`;

const createText2ImageTemplate = (): PromptTemplate => ({
  id: TEXT2IMAGE_TEMPLATE_ID,
  name: '文生图优化',
  description: '面向多模态图像模型的自然语言提示词优化，围绕主体、动作、环境、光线、色彩、材质与氛围进行层次化叙述',
  systemPrompt: TEXT2IMAGE_SYSTEM_PROMPT,
  userPromptTemplate: TEXT2IMAGE_USER_PROMPT_TEMPLATE,
  isDefault: true,
  createdAt: Date.now(),
  updatedAt: Date.now(),
});

// Image-to-image optimization template
const IMAGE2IMAGE_SYSTEM_PROMPT = `# Role: 图生图提示词优化专家

## Profile
- Author: prompt-optimizer
- Version: 1.0.0
- Language: 中文
- Description: 专门针对图生图(Image-to-Image)场景的提示词优化专家，基于现有图像进行克制而自然的编辑与优化指导

## Background
- 基于现有图像进行编辑，需要在保持原图特征的基础上做克制改动
- 需要明确指出保留什么、修改什么、增强什么
- 要考虑原图的构图、风格、主体、光线与色彩的一致性
- 指令需要精确、具体，避免过度改变原图意图
- 需平衡"保留原图特色"与"实现修改需求"

## 任务理解
你的任务是将用户的图像修改需求优化为自然语言的图生图提示词，确保在保持原图核心特征的基础上实现用户想要的修改效果。

**关键原则：用户的提示词表达的是"想要改变/添加/删除的内容"，而非"对原图已有内容的描述"。**

## Skills
1. 修改意图识别（核心能力）
   - **识别添加意图**：用户描述的新元素（人物、物体、效果）在原图中不存在，需要自然添加
   - **识别删除意图**：用户明确提到"去掉/移除/删除"某元素
   - **识别替换意图**：用户提到"改成/换成/变成"，需要替换原有元素
   - **识别增强意图**：用户提到"更/加强/优化"某特征，原图已有但需增强
   - **默认保留原则**：用户未提及的原图元素，默认保留

2. 图像编辑理解
   - 判断修改的可行性与影响
   - 预测新旧元素的融合方式
   - 确保整体效果的连贯性

3. 精确指令构建
   - 明确指出保持不变的元素
   - 精确描述需要修改的部分
   - 提供具体的修改方向和程度
   - 用自然语言清晰描述期望风格与效果（不使用参数/权重/数值）

## Goals
- 若需求仅涉及具体单物或简洁画面，默认采用"单物居中构图、背景干净、柔和接地阴影、材质表达清楚"的倾向
- 保持原图的核心构图与主要特征
- 精确实现用户的修改需求
- 避免不必要的过度修改
- 确保修改后效果自然协调

## Constrains
- 必须尊重原图的基本构图和主体
- 修改幅度适中，避免面目全非
- 保持原图在风格/光照/色彩/透视上的一致性
- 指令清晰、具体、可执行，仅使用自然语言

## 创作指引
- **首要任务：识别用户描述的是"添加/删除/替换/增强"哪种意图**
- 用自然语言清楚表达"保留/添加/删除/增强"的边界
- 对于**添加元素**：明确新元素的位置、大小、姿态、与原图的关系
- 对于**删除元素**：说明如何自然填补删除后的空白
- 对于**替换元素**：明确替换范围和新元素特征
- 对于**增强元素**：说明增强的具体方面和程度
- 强调新旧元素在风格、光线、透视与色彩上的自然衔接
- 依据"Lens 自适应"调整措辞与细节重心（摄影/设计/国风/插画）
- 简洁连贯，无需遵循固定步骤

## Output Requirements
- 直接输出优化后的图生图提示词（自然语言、纯文本），推荐长度 3–6 句
- 禁止添加任何前缀或解释；仅输出提示词本体
- **必须明确说明是"添加/删除/替换/增强"操作**，让图生图模型理解修改意图
- 明确区分"保留/添加/删除/增强"元素，强调与原图在风格/光线/透视/色彩上的自然衔接
- 不使用任何参数/权重/负面清单
- 当缺少明确线索时，优先保持画面简洁：注意力集中于主体、边缘干净、背景无杂物
- 指令精确、可执行、效果自然

## 意图识别示例
**添加意图**：用户描述了原图不存在的新元素 → 输出应明确"添加XX元素，位置为...，与原图融合方式..."
**删除意图**：用户说"去掉/移除背景" → 输出应明确"移除XX区域，保持主体完整，自然填补..."
**替换意图**：用户说"把XX改成YY" → 输出应明确"将XX区域替换为YY，保持其他元素不变..."
**增强意图**：用户说"让花朵更鲜艳" → 输出应明确"增强花朵的色彩饱和度和层次感，保持其他特征..."

❌ 常见错误：假设原图已有用户描述的元素 → 导致输出"保留XX与YY的关系"（但原图根本没有XX）`;

const IMAGE2IMAGE_USER_PROMPT_TEMPLATE = `请将以下图像修改需求优化为自然语言的图生图提示词。

重要说明：
- **用户的提示词是"期望的最终效果"，而非"对原图的描述"**
- **判断意图的关键**：用户描述的元素在原图中是否存在？
  * 若用户描述了原图没有的元素 → **添加意图**（如原图只有花，用户说"人拿着花" → 需添加人）
  * 若用户明确说"去掉/删除/移除" → **删除意图**
  * 若用户说"改成/换成/变成" → **替换意图**
  * 若用户说"更/加强/突出"某特征 → **增强意图**（该特征原图已有）
- **不要臆测原图内容**：只基于用户提示词与常识判断，不要假设原图有未被提及的复杂元素
- 明确"保留元素/添加元素/删除元素/增强元素"，用自然语言具体描述
- 不使用任何参数/权重/负面清单或强度数值
- 修改后效果需与原图在风格、光照、透视上自然衔接

需要优化的修改需求：
{{input}}

请输出精确的图生图优化提示词：`;

const createImage2ImageTemplate = (): PromptTemplate => ({
  id: IMAGE2IMAGE_TEMPLATE_ID,
  name: '图生图优化',
  description: '基于现有图像进行编辑的提示词优化，支持添加、删除、替换、增强等操作意图识别',
  systemPrompt: IMAGE2IMAGE_SYSTEM_PROMPT,
  userPromptTemplate: IMAGE2IMAGE_USER_PROMPT_TEMPLATE,
  isDefault: true,
  createdAt: Date.now(),
  updatedAt: Date.now(),
});

// Get all builtin templates
const getBuiltinTemplates = (): PromptTemplate[] => [
  createDefaultTemplate(),
  createText2ImageTemplate(),
  createImage2ImageTemplate(),
];

const loadTemplates = (): PromptTemplate[] => {
  if (typeof window === 'undefined') return getBuiltinTemplates();

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const templates = JSON.parse(stored) as PromptTemplate[];
      const builtinTemplates = getBuiltinTemplates();
      const builtinIds = new Set(BUILTIN_TEMPLATE_IDS);

      // Separate user custom templates
      const userTemplates = templates.filter((t) => !builtinIds.has(t.id));

      // Return: builtin templates (fixed order) + user custom templates
      return [...builtinTemplates, ...userTemplates];
    }
  } catch (e) {
    console.error('Failed to load templates from localStorage:', e);
  }
  return getBuiltinTemplates();
};

const saveTemplates = (templates: PromptTemplate[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
  } catch (e) {
    console.error('Failed to save templates to localStorage:', e);
  }
};

const loadSelectedTemplateId = (): string => {
  if (typeof window === 'undefined') return DEFAULT_TEMPLATE_ID;

  try {
    const stored = localStorage.getItem(SELECTED_TEMPLATE_KEY);
    if (stored) {
      return stored;
    }
  } catch (e) {
    console.error('Failed to load selected template from localStorage:', e);
  }
  return DEFAULT_TEMPLATE_ID;
};

const saveSelectedTemplateId = (id: string) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SELECTED_TEMPLATE_KEY, id);
  } catch (e) {
    console.error('Failed to save selected template to localStorage:', e);
  }
};

export const usePromptTemplateStore = (): PromptTemplateStore => {
  const [templates, setTemplates] = useState<PromptTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(DEFAULT_TEMPLATE_ID);

  // Load templates and selected template on mount
  useEffect(() => {
    const loadedTemplates = loadTemplates();
    setTemplates(loadedTemplates);

    const loadedSelectedId = loadSelectedTemplateId();
    const selectedExists = loadedTemplates.some((t) => t.id === loadedSelectedId);
    if (selectedExists) {
      setSelectedTemplateId(loadedSelectedId);
    } else {
      setSelectedTemplateId(DEFAULT_TEMPLATE_ID);
      saveSelectedTemplateId(DEFAULT_TEMPLATE_ID);
    }
  }, []);

  const addTemplate = useCallback((template: Omit<PromptTemplate, 'id' | 'isDefault' | 'createdAt' | 'updatedAt'>): string => {
    const newId = generateId();
    const newTemplate: PromptTemplate = {
      ...template,
      id: newId,
      isDefault: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    setTemplates((prev) => {
      const updated = [...prev, newTemplate];
      saveTemplates(updated);
      return updated;
    });

    return newId;
  }, []);

  const updateTemplate = useCallback((id: string, updates: Partial<Pick<PromptTemplate, 'name' | 'description' | 'systemPrompt' | 'userPromptTemplate'>>) => {
    setTemplates((prev) => {
      const updated = prev.map((t) =>
        t.id === id
          ? { ...t, ...updates, updatedAt: Date.now() }
          : t
      );
      saveTemplates(updated);
      return updated;
    });
  }, []);

  const deleteTemplate = useCallback((id: string) => {
    // Cannot delete builtin templates
    if (BUILTIN_TEMPLATE_IDS.includes(id)) {
      console.warn('Cannot delete builtin template');
      return;
    }

    setTemplates((prev) => {
      const updated = prev.filter((t) => t.id !== id);
      saveTemplates(updated);
      return updated;
    });

    // If deleted template was selected, switch to default
    setSelectedTemplateId((prev) => {
      if (prev === id) {
        saveSelectedTemplateId(DEFAULT_TEMPLATE_ID);
        return DEFAULT_TEMPLATE_ID;
      }
      return prev;
    });
  }, []);

  const selectTemplate = useCallback((id: string) => {
    setSelectedTemplateId(id);
    saveSelectedTemplateId(id);
  }, []);

  const resetDefaultTemplate = useCallback(() => {
    setTemplates((prev) => {
      const updated = prev.map((t) =>
        t.id === DEFAULT_TEMPLATE_ID
          ? createDefaultTemplate()
          : t
      );
      saveTemplates(updated);
      return updated;
    });
  }, []);

  const selectedTemplate = templates.find((t) => t.id === selectedTemplateId);

  return {
    templates,
    selectedTemplateId,
    selectedTemplate,
    addTemplate,
    updateTemplate,
    deleteTemplate,
    selectTemplate,
    resetDefaultTemplate,
  };
};
