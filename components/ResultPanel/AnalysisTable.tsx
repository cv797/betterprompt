'use client';

/**
 * AnalysisTable Component - Displays optimization analysis comparison table
 * Collapsible by default, click to expand
 */

import { useState } from 'react';
import { DownOutlined, FileTextOutlined } from '@ant-design/icons';
import { AnalysisTableRow } from '@/types';
import styles from './AnalysisTable.module.css';

interface AnalysisTableProps {
  data: AnalysisTableRow[];
}

export const AnalysisTable = ({ data }: AnalysisTableProps) => {
  const [expanded, setExpanded] = useState(false);

  if (!data || data.length === 0) return null;

  return (
    <div className={styles.analysisSection}>
      <button
        className={styles.sectionHeader}
        onClick={() => setExpanded(!expanded)}
        type="button"
      >
        <FileTextOutlined />
        <span>优化说明</span>
        <span className={styles.itemCount}>{data.length} 项</span>
        <DownOutlined className={`${styles.chevron} ${expanded ? styles.expanded : ''}`} />
      </button>

      {expanded && (
        <div className={styles.tableWrapper}>
          <table className={styles.analysisTable}>
            <thead>
              <tr>
                <th className={styles.dimensionCol}>维度</th>
                <th className={styles.issueCol}>原 Prompt 问题</th>
                <th className={styles.optimizedCol}>优化后</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index}>
                  <td className={styles.dimensionCell}>
                    <span className={styles.dimensionTag}>{row.dimension}</span>
                  </td>
                  <td className={styles.issueCell}>{row.originalIssue}</td>
                  <td className={styles.optimizedCell}>{row.optimized}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
