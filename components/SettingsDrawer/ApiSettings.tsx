'use client';

/**
 * ApiSettings - API configuration tab
 */

import { Input } from 'antd';
import styles from './index.module.css';

interface ApiSettingsProps {
  apiBase: string;
  apiKey: string;
  onApiBaseChange: (value: string) => void;
  onApiKeyChange: (value: string) => void;
}

export const ApiSettings = ({
  apiBase,
  apiKey,
  onApiBaseChange,
  onApiKeyChange,
}: ApiSettingsProps) => {
  return (
    <div className={styles.content}>
      <div className={styles.formField}>
        <label className={styles.fieldLabel}>API 地址</label>
        <Input
          value={apiBase}
          onChange={(e) => onApiBaseChange(e.target.value)}
          placeholder="https://api.openai.com/v1"
          className={styles.input}
        />
        <div className={styles.fieldHint}>
          完整 URL，例如：https://api.openai.com/v1
        </div>
      </div>

      <div className={styles.formField}>
        <label className={styles.fieldLabel}>API 密钥</label>
        <Input.Password
          value={apiKey}
          onChange={(e) => onApiKeyChange(e.target.value)}
          placeholder="sk-..."
          className={styles.input}
        />
      </div>
    </div>
  );
};
