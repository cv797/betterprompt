'use client';

/**
 * PromptTemplateDrawer - Template management drawer
 */

import { useState, useCallback } from 'react';
import { Drawer, Button, Input, Modal, Tooltip, Tag } from 'antd';
import { CloseOutlined, PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined, AppstoreOutlined } from '@ant-design/icons';
import { PromptTemplate } from '@/types';
import styles from './index.module.css';

const { TextArea } = Input;

interface PromptTemplateDrawerProps {
  open: boolean;
  onClose: () => void;
  templates: PromptTemplate[];
  selectedTemplateId: string;
  onSelect: (id: string) => void;
  onAdd: (template: Omit<PromptTemplate, 'id' | 'isDefault' | 'createdAt' | 'updatedAt'>) => string;
  onUpdate: (id: string, updates: Partial<Pick<PromptTemplate, 'name' | 'description' | 'systemPrompt' | 'userPromptTemplate'>>) => void;
  onDelete: (id: string) => void;
  onResetDefault: () => void;
}

interface EditingTemplate {
  id: string | null; // null means creating new
  name: string;
  description: string;
  systemPrompt: string;
  userPromptTemplate: string;
}

export const PromptTemplateDrawer = ({
  open,
  onClose,
  templates,
  selectedTemplateId,
  onSelect,
  onAdd,
  onUpdate,
  onDelete,
  onResetDefault,
}: PromptTemplateDrawerProps) => {
  const [editingTemplate, setEditingTemplate] = useState<EditingTemplate | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleCreateNew = useCallback(() => {
    setEditingTemplate({
      id: null,
      name: '',
      description: '',
      systemPrompt: '',
      userPromptTemplate: '<original_prompt>\n{{input}}\n</original_prompt>\n\n<!-- 在此添加你的优化指令 -->',
    });
  }, []);

  const handleEdit = useCallback((template: PromptTemplate) => {
    setEditingTemplate({
      id: template.id,
      name: template.name,
      description: template.description || '',
      systemPrompt: template.systemPrompt,
      userPromptTemplate: template.userPromptTemplate,
    });
  }, []);

  const handleSave = useCallback(() => {
    if (!editingTemplate) return;
    if (!editingTemplate.name.trim()) return;

    if (editingTemplate.id === null) {
      // Create new
      const newId = onAdd({
        name: editingTemplate.name.trim(),
        description: editingTemplate.description.trim() || undefined,
        systemPrompt: editingTemplate.systemPrompt,
        userPromptTemplate: editingTemplate.userPromptTemplate,
      });
      onSelect(newId);
    } else {
      // Update existing
      onUpdate(editingTemplate.id, {
        name: editingTemplate.name.trim(),
        description: editingTemplate.description.trim() || undefined,
        systemPrompt: editingTemplate.systemPrompt,
        userPromptTemplate: editingTemplate.userPromptTemplate,
      });
    }

    setEditingTemplate(null);
  }, [editingTemplate, onAdd, onUpdate, onSelect]);

  const handleCancelEdit = useCallback(() => {
    setEditingTemplate(null);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (deleteConfirmId) {
      onDelete(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  }, [deleteConfirmId, onDelete]);

  const handleSelect = useCallback((id: string) => {
    onSelect(id);
  }, [onSelect]);

  // Edit mode view
  if (editingTemplate) {
    return (
      <Drawer
        open={open}
        onClose={onClose}
        placement="right"
        title={null}
        closable={false}
        className={styles.drawer}
        styles={{
          wrapper: { width: 500 },
          body: { padding: 0 },
          header: { display: 'none' },
        }}
      >
        <div className={styles.sidebar}>
          {/* Header */}
          <div className={styles.sidebarHeader}>
            <div className={styles.headerTitle}>
              <AppstoreOutlined />
              <span>{editingTemplate.id === null ? '新建模板' : '编辑模板'}</span>
            </div>
            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={handleCancelEdit}
              className={styles.closeBtn}
            />
          </div>

          {/* Edit Form */}
          <div className={styles.editForm}>
            <div className={styles.formField}>
              <label className={styles.fieldLabel}>模板名称 *</label>
              <Input
                value={editingTemplate.name}
                onChange={(e) => setEditingTemplate((prev) => prev ? { ...prev, name: e.target.value } : null)}
                placeholder="如：绘图提示词优化"
                className={styles.input}
              />
            </div>

            <div className={styles.formField}>
              <label className={styles.fieldLabel}>描述（可选）</label>
              <Input
                value={editingTemplate.description}
                onChange={(e) => setEditingTemplate((prev) => prev ? { ...prev, description: e.target.value } : null)}
                placeholder="简要描述此模板的用途"
                className={styles.input}
              />
            </div>

            <div className={styles.formField}>
              <label className={styles.fieldLabel}>系统提示词</label>
              <TextArea
                value={editingTemplate.systemPrompt}
                onChange={(e) => setEditingTemplate((prev) => prev ? { ...prev, systemPrompt: e.target.value } : null)}
                placeholder="定义 AI 的角色和行为..."
                className={styles.textarea}
                autoSize={{ minRows: 6, maxRows: 12 }}
              />
            </div>

            <div className={styles.formField}>
              <label className={styles.fieldLabel}>
                用户提示词模板
                <span className={styles.fieldHint}>使用 {'{{input}}'} 作为用户输入的占位符</span>
              </label>
              <TextArea
                value={editingTemplate.userPromptTemplate}
                onChange={(e) => setEditingTemplate((prev) => prev ? { ...prev, userPromptTemplate: e.target.value } : null)}
                placeholder="包含 {{input}} 的模板..."
                className={styles.textarea}
                autoSize={{ minRows: 6, maxRows: 12 }}
              />
            </div>
          </div>

          {/* Footer */}
          <div className={styles.editFooter}>
            <Button onClick={handleCancelEdit}>
              取消
            </Button>
            <Button
              type="primary"
              onClick={handleSave}
              disabled={!editingTemplate.name.trim()}
            >
              保存
            </Button>
          </div>
        </div>
      </Drawer>
    );
  }

  // List mode view
  return (
    <>
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
              <AppstoreOutlined />
              <span>提示词模板</span>
            </div>
            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={onClose}
              className={styles.closeBtn}
            />
          </div>

          {/* Add Button */}
          <div className={styles.addSection}>
            <Button
              type="dashed"
              block
              icon={<PlusOutlined />}
              onClick={handleCreateNew}
            >
              新建模板
            </Button>
          </div>

          {/* Template List */}
          <div className={styles.templateList}>
            {templates.map((template) => (
              <div
                key={template.id}
                className={`${styles.templateItem} ${selectedTemplateId === template.id ? styles.selected : ''}`}
                onClick={() => handleSelect(template.id)}
              >
                <div className={styles.templateInfo}>
                  <div className={styles.templateName}>
                    {template.name}
                    {template.isDefault && <Tag color="blue" className={styles.defaultBadge}>默认</Tag>}
                  </div>
                  {template.description && (
                    <div className={styles.templateDesc}>{template.description}</div>
                  )}
                </div>
                <div className={styles.templateActions}>
                  <Tooltip title="编辑">
                    <Button
                      type="text"
                      size="small"
                      icon={<EditOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(template);
                      }}
                    />
                  </Tooltip>
                  {template.isDefault ? (
                    <Tooltip title="恢复默认">
                      <Button
                        type="text"
                        size="small"
                        icon={<ReloadOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          onResetDefault();
                        }}
                      />
                    </Tooltip>
                  ) : (
                    <Tooltip title="删除">
                      <Button
                        type="text"
                        size="small"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteConfirmId(template.id);
                        }}
                      />
                    </Tooltip>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Drawer>

      {/* Delete Confirmation Dialog */}
      <Modal
        open={!!deleteConfirmId}
        title="确认删除"
        onCancel={() => setDeleteConfirmId(null)}
        onOk={handleDeleteConfirm}
        okText="删除"
        cancelText="取消"
        okButtonProps={{ danger: true }}
      >
        <p>确定要删除此模板吗？此操作无法撤销。</p>
      </Modal>
    </>
  );
};
