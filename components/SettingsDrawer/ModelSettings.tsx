'use client';

/**
 * ModelSettings - Model list management tab
 */

import { useState, useCallback } from 'react';
import { Input, Button, Tooltip, Modal, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { ModelOption } from '@/types';
import styles from './index.module.css';

interface ModelSettingsProps {
  models: ModelOption[];
  onAdd: (model: Omit<ModelOption, 'id' | 'isBuiltIn'>) => string;
  onUpdate: (id: string, updates: Partial<Pick<ModelOption, 'value' | 'label'>>) => void;
  onDelete: (id: string) => void;
}

interface EditingModel {
  id: string | null; // null = creating new
  value: string;
  label: string;
}

export const ModelSettings = ({
  models,
  onAdd,
  onUpdate,
  onDelete,
}: ModelSettingsProps) => {
  const [editingModel, setEditingModel] = useState<EditingModel | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleCreateNew = useCallback(() => {
    setEditingModel({
      id: null,
      value: '',
      label: '',
    });
  }, []);

  const handleEdit = useCallback((model: ModelOption) => {
    setEditingModel({
      id: model.id,
      value: model.value,
      label: model.label,
    });
  }, []);

  const handleSave = useCallback(() => {
    if (!editingModel) return;
    if (!editingModel.value.trim() || !editingModel.label.trim()) return;

    if (editingModel.id === null) {
      onAdd({
        value: editingModel.value.trim(),
        label: editingModel.label.trim(),
      });
    } else {
      onUpdate(editingModel.id, {
        value: editingModel.value.trim(),
        label: editingModel.label.trim(),
      });
    }

    setEditingModel(null);
  }, [editingModel, onAdd, onUpdate]);

  const handleCancelEdit = useCallback(() => {
    setEditingModel(null);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (deleteConfirmId) {
      onDelete(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  }, [deleteConfirmId, onDelete]);

  // Edit mode
  if (editingModel) {
    return (
      <div className={styles.content}>
        <div className={styles.editForm}>
          <div className={styles.formField}>
            <label className={styles.fieldLabel}>显示名称 *</label>
            <Input
              value={editingModel.label}
              onChange={(e) => setEditingModel((prev) => prev ? { ...prev, label: e.target.value } : null)}
              placeholder="如：Claude Opus 4.5"
              className={styles.input}
            />
          </div>

          <div className={styles.formField}>
            <label className={styles.fieldLabel}>模型标识 *</label>
            <Input
              value={editingModel.value}
              onChange={(e) => setEditingModel((prev) => prev ? { ...prev, value: e.target.value } : null)}
              placeholder="如：claude-opus-4-5-20251101"
              className={styles.input}
            />
            <div className={styles.fieldHint}>
              发送给 API 的模型名称
            </div>
          </div>
        </div>

        <div className={styles.editFooter}>
          <Button onClick={handleCancelEdit}>
            取消
          </Button>
          <Button
            type="primary"
            onClick={handleSave}
            disabled={!editingModel.value.trim() || !editingModel.label.trim()}
          >
            保存
          </Button>
        </div>
      </div>
    );
  }

  // List mode
  return (
    <>
      <div className={styles.content}>
        <Button
          type="dashed"
          block
          icon={<PlusOutlined />}
          onClick={handleCreateNew}
          className={styles.addBtn}
        >
          添加模型
        </Button>

        <div className={styles.modelList}>
          {models.map((model) => (
            <div key={model.id} className={styles.modelItem}>
              <div className={styles.modelInfo}>
                <div className={styles.modelName}>
                  {model.label}
                  {model.isBuiltIn && <Tag color="blue" className={styles.builtInBadge}>内置</Tag>}
                </div>
                <div className={styles.modelValue}>{model.value}</div>
              </div>
              <div className={styles.modelActions}>
                <Tooltip title="编辑">
                  <Button
                    type="text"
                    size="small"
                    icon={<EditOutlined />}
                    onClick={() => handleEdit(model)}
                  />
                </Tooltip>
                {!model.isBuiltIn && (
                  <Tooltip title="删除">
                    <Button
                      type="text"
                      size="small"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => setDeleteConfirmId(model.id)}
                    />
                  </Tooltip>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal
        open={!!deleteConfirmId}
        title="确认删除"
        onCancel={() => setDeleteConfirmId(null)}
        onOk={handleDeleteConfirm}
        okText="删除"
        cancelText="取消"
        okButtonProps={{ danger: true }}
      >
        <p>确定要删除此模型吗？此操作无法撤销。</p>
      </Modal>
    </>
  );
};
