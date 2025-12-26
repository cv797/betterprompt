'use client';

/**
 * InputPanel Component - Left side input area
 */

import { Button, Input } from 'antd';
import { ClearOutlined, ThunderboltOutlined, DoubleRightOutlined } from '@ant-design/icons';
import styles from './index.module.css';

const { TextArea } = Input;

interface InputPanelProps {
  value: string;
  onChange: (value: string) => void;
  onOptimize: () => void;
  onClear: () => void;
  isLoading: boolean;
}

export const InputPanel = ({
  value,
  onChange,
  onOptimize,
  onClear,
  isLoading,
}: InputPanelProps) => {
  const charCount = value.length;
  const maxChars = 5000;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Enter to submit, Shift+Enter for new line
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !isLoading) {
        onOptimize();
      }
    }
  };

  return (
    <div className={styles.inputPanel}>
      {/* Header */}
      <div className={styles.panelHeader}>
        <div className={styles.headerLeft}>
          <DoubleRightOutlined />
          <span>原始提示词输入</span>
        </div>
        <div className={styles.headerRight}>
          <span className={styles.charCount}>{charCount} / {maxChars}</span>
          {value && (
            <Button
              type="text"
              size="small"
              className={styles.clearBtn}
              onClick={onClear}
              icon={<ClearOutlined />}
            >
              清空
            </Button>
          )}
        </div>
      </div>

      {/* Textarea */}
      <div className={styles.textareaWrapper} onKeyDownCapture={handleKeyDown}>
        <TextArea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="> 在此粘贴原始提示词..."
          className={styles.textarea}
          maxLength={maxChars}
        />
      </div>

      {/* Submit Button */}
      <Button
        type="primary"
        className={styles.submitBtn}
        onClick={onOptimize}
        disabled={!value.trim() || isLoading}
        loading={isLoading}
        icon={<ThunderboltOutlined />}
        size="large"
      >
        {isLoading ? '优化中...' : '执行优化'}
      </Button>
    </div>
  );
};
