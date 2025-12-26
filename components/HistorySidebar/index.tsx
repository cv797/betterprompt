'use client';

/**
 * HistorySidebar Component - Right side overlay history panel
 */

import { Drawer, Button, Empty } from 'antd';
import { CloseOutlined, DeleteOutlined, DatabaseOutlined } from '@ant-design/icons';
import { HistoryItem } from '@/types';
import styles from './index.module.css';

interface HistorySidebarProps {
  open: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onClear: () => void;
}

export const HistorySidebar = ({
  open,
  onClose,
  history,
  onSelect,
  onClear,
}: HistorySidebarProps) => {
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${hours}:${minutes} · ${year}/${month}/${day}`;
  };

  const truncateText = (text: string, maxLength: number = 80) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  const handleSelect = (item: HistoryItem) => {
    onSelect(item);
    onClose();
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      placement="right"
      title={null}
      closable={false}
      className={styles.drawer}
      styles={{
        wrapper: { width: 400 },
        body: { padding: 0 },
        header: { display: 'none' },
      }}
    >
      <div className={styles.sidebar}>
        {/* Header */}
        <div className={styles.sidebarHeader}>
          <div className={styles.headerTitle}>
            <DatabaseOutlined />
            <span>历史记录</span>
          </div>
          <Button
            type="text"
            icon={<CloseOutlined />}
            onClick={onClose}
            className={styles.closeBtn}
          />
        </div>

        {/* History List */}
        <div className={styles.historyList}>
          {history.length === 0 ? (
            <Empty
              description="暂无历史记录"
              className={styles.emptyState}
            />
          ) : (
            history.map((item, index) => (
              <button
                key={item.id}
                className={styles.historyItem}
                onClick={() => handleSelect(item)}
              >
                <div className={styles.historyTime}>
                  [{String(index + 1).padStart(2, '0')}] {formatTime(item.timestamp)}
                </div>
                <div className={styles.historyText}>
                  {truncateText(item.originalPrompt)}
                </div>
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        {history.length > 0 && (
          <div className={styles.sidebarFooter}>
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={onClear}
              className={styles.clearBtn}
            >
              清除所有记录
            </Button>
          </div>
        )}
      </div>
    </Drawer>
  );
};
