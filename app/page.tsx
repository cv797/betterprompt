'use client';

/**
 * BetterPrompt - Prompt Optimization Engine
 *
 * Layout: Header + (InputPanel | ResultPanel | HistorySidebar)
 */

import { useState, useCallback, useMemo } from 'react';

import { Header } from '@/components/Header';
import { InputPanel } from '@/components/InputPanel';
import { ResultPanel } from '@/components/ResultPanel';
import { HistorySidebar } from '@/components/HistorySidebar';
import { PromptTemplateDrawer } from '@/components/PromptTemplateDrawer';
import { SettingsDrawer } from '@/components/SettingsDrawer';
import { useHistoryStore } from '@/hooks/useHistoryStore';
import { usePromptTemplateStore } from '@/hooks/usePromptTemplateStore';
import { useSettingsStore } from '@/hooks/useSettingsStore';
import { optimizePromptStream } from '@/services/api';
import { OptimizationResult, HistoryItem } from '@/types';

import styles from './page.module.css';

export default function PromptPage() {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [resultLang, setResultLang] = useState<'zh' | 'en'>('zh');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [templateDrawerOpen, setTemplateDrawerOpen] = useState(false);
  const [settingsDrawerOpen, setSettingsDrawerOpen] = useState(false);
  const [currentHistoryId, setCurrentHistoryId] = useState<string | null>(null);
  const [streamingContent, setStreamingContent] = useState('');

  // Settings store
  const {
    settings,
    updateApiBase,
    updateApiKey,
    addModel,
    updateModel,
    deleteModel,
    selectModel,
    getSelectedModelValue,
    getModelOptions,
  } = useSettingsStore();

  const { history, addHistory, updateHistoryItem, clearHistory } = useHistoryStore();
  const {
    templates,
    selectedTemplateId,
    selectedTemplate,
    addTemplate,
    updateTemplate,
    deleteTemplate,
    selectTemplate,
    resetDefaultTemplate,
  } = usePromptTemplateStore();

  // Memoized options for Header
  const templateOptions = useMemo(
    () => templates.map((t) => ({ value: t.id, label: t.name })),
    [templates]
  );
  const modelOptions = useMemo(() => getModelOptions(), [getModelOptions]);

  const handleOptimize = useCallback(async () => {
    if (!inputValue.trim() || isLoading) return;

    setIsLoading(true);
    setResult(null);
    setError(null);
    setStreamingContent('');
    try {
      const promptOptions = selectedTemplate
        ? {
            systemPrompt: selectedTemplate.systemPrompt,
            userPromptTemplate: selectedTemplate.userPromptTemplate,
          }
        : {};

      const apiConfig = {
        apiBase: settings.apiBase,
        apiKey: settings.apiKey || undefined,
      };

      const optimized = await optimizePromptStream(
        inputValue,
        getSelectedModelValue(),
        (partial) => {
          setStreamingContent(partial);
        },
        promptOptions,
        apiConfig
      );
      setResult(optimized);
      setStreamingContent('');

      // Save to history
      addHistory({
        originalPrompt: inputValue,
        result: optimized,
      });
      // New optimization - will be linked to history when user edits and saves
      setCurrentHistoryId(null);
    } catch (err) {
      console.error('Optimization failed:', err);
      setError(err instanceof Error ? err.message : '未知错误');
    } finally {
      setIsLoading(false);
    }
  }, [inputValue, isLoading, addHistory, settings.apiBase, settings.apiKey, getSelectedModelValue, selectedTemplate]);

  const handleHistorySelect = useCallback((item: HistoryItem) => {
    setInputValue(item.originalPrompt);
    setResult(item.result);
    setCurrentHistoryId(item.id);
  }, []);

  const handleClear = useCallback(() => {
    setInputValue('');
    setResult(null);
    setCurrentHistoryId(null);
  }, []);

  const handleResultSave = useCallback((lang: 'zh' | 'en', text: string) => {
    if (!result) return;

    // Update local result state
    const updatedResult: OptimizationResult = {
      ...result,
      optimizedPrompt: {
        ...result.optimizedPrompt,
        [lang]: text,
      },
    };
    setResult(updatedResult);

    // If viewing from history, update the history item
    if (currentHistoryId) {
      updateHistoryItem(currentHistoryId, updatedResult);
    } else {
      // If it's a fresh optimization (not from history), find and update the most recent matching item
      const matchingItem = history.find(
        (item) => item.originalPrompt === inputValue
      );
      if (matchingItem) {
        updateHistoryItem(matchingItem.id, updatedResult);
        setCurrentHistoryId(matchingItem.id);
      }
    }
  }, [result, currentHistoryId, updateHistoryItem, history, inputValue]);

  return (
    <div className={styles.container}>
      {/* Header */}
      <Header
        onHistoryClick={() => setSidebarOpen(true)}
        onSettingsClick={() => setSettingsDrawerOpen(true)}
        templateOptions={templateOptions}
        selectedTemplateId={selectedTemplateId}
        onTemplateChange={selectTemplate}
        modelOptions={modelOptions}
        selectedModelId={settings.selectedModelId}
        onModelChange={selectModel}
        isCustomApi={!!settings.apiBase}
      />

      {/* Main Layout: Input | Result */}
      <div className={styles.mainLayout}>
        {/* Left: Input Panel */}
        <InputPanel
          value={inputValue}
          onChange={setInputValue}
          onOptimize={handleOptimize}
          onClear={handleClear}
          isLoading={isLoading}
        />

        {/* Right: Result Panel */}
        <ResultPanel
          result={result}
          lang={resultLang}
          onLangChange={setResultLang}
          onSave={handleResultSave}
          isLoading={isLoading}
          error={error}
          streamingContent={streamingContent}
        />
      </div>

      {/* History Sidebar (overlay) */}
      <HistorySidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        history={history}
        onSelect={handleHistorySelect}
        onClear={clearHistory}
      />

      {/* Template Management Drawer */}
      <PromptTemplateDrawer
        open={templateDrawerOpen}
        onClose={() => setTemplateDrawerOpen(false)}
        templates={templates}
        selectedTemplateId={selectedTemplateId}
        onSelect={selectTemplate}
        onAdd={addTemplate}
        onUpdate={updateTemplate}
        onDelete={deleteTemplate}
        onResetDefault={resetDefaultTemplate}
      />

      {/* Settings Drawer */}
      <SettingsDrawer
        open={settingsDrawerOpen}
        onClose={() => setSettingsDrawerOpen(false)}
        apiBase={settings.apiBase}
        apiKey={settings.apiKey}
        onApiBaseChange={updateApiBase}
        onApiKeyChange={updateApiKey}
        models={settings.models}
        onModelAdd={addModel}
        onModelUpdate={updateModel}
        onModelDelete={deleteModel}
        onOpenTemplateDrawer={() => setTemplateDrawerOpen(true)}
      />
    </div>
  );
}
