'use client';

/**
 * Header Component - Top Navigation Bar
 */

import { Button, Select, Badge } from 'antd';
import { SettingOutlined, HistoryOutlined } from '@ant-design/icons';
import styles from './index.module.css';

interface HeaderProps {
  onHistoryClick: () => void;
  onSettingsClick: () => void;
  // Template selector
  templateOptions: { value: string; label: string }[];
  selectedTemplateId: string;
  onTemplateChange: (id: string) => void;
  // Model selector
  modelOptions: { value: string; label: string }[];
  selectedModelId: string;
  onModelChange: (id: string) => void;
  // API mode indicator
  isCustomApi?: boolean;
}

export const Header = ({
  onHistoryClick,
  onSettingsClick,
  templateOptions,
  selectedTemplateId,
  onTemplateChange,
  modelOptions,
  selectedModelId,
  onModelChange,
  isCustomApi,
}: HeaderProps) => {
  return (
    <header className={styles.header}>
      {/* Logo Section */}
      <div className={styles.logoSection}>
        <div className={styles.logoIcon}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
            <polyline points="13 17 18 12 13 7" />
            <polyline points="6 17 11 12 6 7" />
          </svg>
        </div>
        <span className={styles.brandText}>
          <span className={styles.better}>better</span>
          <span className={styles.prompt}>prompt</span>
        </span>
      </div>

      {/* Center Selectors */}
      <div className={styles.centerSection}>
        <div className={styles.selectorGroup}>
          <span className={styles.selectorLabel}>模板:</span>
          <Select
            value={selectedTemplateId}
            options={templateOptions}
            onChange={onTemplateChange}
            className={styles.selector}
            popupMatchSelectWidth={false}
            variant="borderless"
          />
        </div>
        <div className={styles.selectorGroup}>
          <span className={styles.selectorLabel}>模型:</span>
          <Select
            value={selectedModelId}
            options={modelOptions}
            onChange={onModelChange}
            className={styles.selector}
            popupMatchSelectWidth={false}
            variant="borderless"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className={styles.actions}>
        {isCustomApi && (
          <Badge count="自定义 API" className={styles.customApiBadge} />
        )}
        <Button
          type="text"
          icon={<SettingOutlined />}
          onClick={onSettingsClick}
          title="设置"
          className={styles.settingsBtn}
        />
        <Button
          onClick={onHistoryClick}
          icon={<HistoryOutlined />}
        >
          历史记录
        </Button>
      </div>
    </header>
  );
};
