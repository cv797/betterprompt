'use client';

/**
 * ResultPanel Component - Right side result display (editable)
 */

import { useState, useEffect, useRef } from 'react';
import { Button, Input, Radio } from 'antd';
import { CopyOutlined, CheckOutlined, SaveOutlined, DoubleRightOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Streamdown } from 'streamdown';
import { OptimizationResult } from '@/types';
import { AnalysisTable } from './AnalysisTable';
import { CyberLoader } from './CyberLoader';
import styles from './index.module.css';

const { TextArea } = Input;

interface ResultPanelProps {
  result: OptimizationResult | null;
  lang: 'zh' | 'en';
  onLangChange: (lang: 'zh' | 'en') => void;
  onSave?: (lang: 'zh' | 'en', text: string) => void;
  isLoading?: boolean;
  error?: string | null;
  streamingContent?: string;
}

export const ResultPanel = ({
  result,
  lang,
  onLangChange,
  onSave,
  isLoading = false,
  error = null,
  streamingContent = '',
}: ResultPanelProps) => {
  const [copied, setCopied] = useState(false);
  const [editedText, setEditedText] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const streamingContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when streaming
  useEffect(() => {
    if (isLoading && streamingContainerRef.current) {
      streamingContainerRef.current.scrollTop = streamingContainerRef.current.scrollHeight;
    }
  }, [streamingContent, isLoading]);

  // Sync editedText when result or lang changes
  const originalText = result
    ? (lang === 'zh' ? result.optimizedPrompt.zh : result.optimizedPrompt.en)
    : '';

  useEffect(() => {
    setEditedText(originalText);
    setHasChanges(false);
  }, [originalText]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setEditedText(newText);
    setHasChanges(newText !== originalText);
  };

  const handleSave = () => {
    if (!hasChanges || !onSave) return;
    onSave(lang, editedText);
    setHasChanges(false);
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(editedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.resultPanel}>
      {/* Header with toolbar */}
      <div className={styles.panelHeader}>
        <div className={styles.headerLeft}>
          <DoubleRightOutlined />
          <span>优化后的提示词</span>
        </div>
        <div className={styles.headerRight}>
          <Radio.Group
            value={lang}
            onChange={(e) => onLangChange(e.target.value)}
            size="small"
            optionType="button"
            buttonStyle="solid"
          >
            <Radio.Button value="zh">中文</Radio.Button>
            <Radio.Button value="en">英文</Radio.Button>
          </Radio.Group>
          {result && (
            <div className={styles.toolbarActions}>
              {hasChanges && (
                <Button
                  type="primary"
                  size="small"
                  icon={<SaveOutlined />}
                  onClick={handleSave}
                >
                  保存
                </Button>
              )}
              <Button
                size="small"
                icon={copied ? <CheckOutlined /> : <CopyOutlined />}
                onClick={handleCopy}
              >
                {copied ? '已复制' : '复制'}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Result Content */}
      <div className={styles.resultContent}>
        {error ? (
          <div className={styles.errorState}>
            <div className={styles.errorIcon}>
              <ExclamationCircleOutlined style={{ fontSize: 48 }} />
            </div>
            <h3 className={styles.errorTitle}>请求失败</h3>
            <p className={styles.errorMessage}>{error}</p>
          </div>
        ) : isLoading ? (
          streamingContent ? (
            <div className={styles.streamingContainer} ref={streamingContainerRef}>
              <Streamdown
                mode="streaming"
                isAnimating={true}
                parseIncompleteMarkdown={true}
              >
                {streamingContent}
              </Streamdown>
            </div>
          ) : (
            <CyberLoader />
          )
        ) : result ? (
          <>
            <TextArea
              className={styles.resultTextarea}
              value={editedText}
              onChange={handleTextChange}
              placeholder="优化后的提示词..."
              autoSize={{ minRows: 10, maxRows: 25 }}
            />
            {/* Analysis Table */}
            {result.analysisTable && result.analysisTable.length > 0 && (
              <AnalysisTable data={result.analysisTable} />
            )}
          </>
        ) : (
          <div className={styles.emptyState}>
            {/* Icon */}
            <div className={styles.emptyIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="32" height="32">
                <rect x="4" y="4" width="16" height="16" rx="2" />
                <circle cx="12" cy="12" r="3" />
                <line x1="9" y1="4" x2="9" y2="7" />
                <line x1="15" y1="4" x2="15" y2="7" />
                <line x1="9" y1="17" x2="9" y2="20" />
                <line x1="15" y1="17" x2="15" y2="20" />
                <line x1="4" y1="9" x2="7" y2="9" />
                <line x1="4" y1="15" x2="7" y2="15" />
                <line x1="17" y1="9" x2="20" y2="9" />
                <line x1="17" y1="15" x2="20" y2="15" />
              </svg>
            </div>

            {/* Description */}
            <div className={styles.emptyDesc}>
              <p>在左侧输入原始提示词以开始优化。</p>
            </div>

            {/* Feature Cards */}
            <div className={styles.featureCards}>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <CheckOutlined />
                </div>
                <h3>诊断模块</h3>
                <p>从模型维度分析结构缺陷和提示词失效的原因</p>
              </div>

              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <DoubleRightOutlined />
                </div>
                <h3>优化引擎</h3>
                <p>通过机械锚定和角色激活重写高效提示词</p>
              </div>

              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <SaveOutlined />
                </div>
                <h3>历史记录</h3>
                <p>历史记录保存在本地LocalStorage</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
