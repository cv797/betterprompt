'use client';

/**
 * SettingsDrawer - Unified settings panel
 */

import { Drawer, Tabs, Button } from 'antd';
import { SettingOutlined, CloseOutlined, AppstoreOutlined } from '@ant-design/icons';
import { ModelOption } from '@/types';
import { ApiSettings } from './ApiSettings';
import { ModelSettings } from './ModelSettings';
import styles from './index.module.css';

interface SettingsDrawerProps {
  open: boolean;
  onClose: () => void;
  // API settings
  apiBase: string;
  apiKey: string;
  onApiBaseChange: (value: string) => void;
  onApiKeyChange: (value: string) => void;
  // Model settings
  models: ModelOption[];
  onModelAdd: (model: Omit<ModelOption, 'id' | 'isBuiltIn'>) => string;
  onModelUpdate: (id: string, updates: Partial<Pick<ModelOption, 'value' | 'label'>>) => void;
  onModelDelete: (id: string) => void;
  // Template management
  onOpenTemplateDrawer: () => void;
}

export const SettingsDrawer = ({
  open,
  onClose,
  apiBase,
  apiKey,
  onApiBaseChange,
  onApiKeyChange,
  models,
  onModelAdd,
  onModelUpdate,
  onModelDelete,
  onOpenTemplateDrawer,
}: SettingsDrawerProps) => {
  const handleOpenTemplates = () => {
    onClose();
    onOpenTemplateDrawer();
  };

  const tabItems = [
    {
      key: 'api',
      label: 'API 配置',
      children: (
        <ApiSettings
          apiBase={apiBase}
          apiKey={apiKey}
          onApiBaseChange={onApiBaseChange}
          onApiKeyChange={onApiKeyChange}
        />
      ),
    },
    {
      key: 'models',
      label: '模型管理',
      children: (
        <ModelSettings
          models={models}
          onAdd={onModelAdd}
          onUpdate={onModelUpdate}
          onDelete={onModelDelete}
        />
      ),
    },
    {
      key: 'templates',
      label: '模板管理',
      children: (
        <div className={styles.content}>
          <div className={styles.templateEntry}>
            <AppstoreOutlined className={styles.templateEntryIcon} />
            <div className={styles.templateEntryText}>
              <div className={styles.templateEntryTitle}>提示词模板</div>
              <div className={styles.templateEntryDesc}>管理和配置提示词优化模板</div>
            </div>
            <Button type="primary" ghost onClick={handleOpenTemplates}>
              管理模板
            </Button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <Drawer
      open={open}
      onClose={onClose}
      placement="right"
      title={null}
      closable={false}
      className={styles.drawer}
      styles={{
        wrapper: { width: 480 },
        body: { padding: 0 },
        header: { display: 'none' },
      }}
    >
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            <SettingOutlined />
            <span>设置</span>
          </div>
          <Button
            type="text"
            icon={<CloseOutlined />}
            onClick={onClose}
            className={styles.closeBtn}
          />
        </div>

        {/* Tabs */}
        <Tabs
          items={tabItems}
          className={styles.tabs}
        />
      </div>
    </Drawer>
  );
};
