'use client';

import React from 'react';
import { Terminal, Shield, CheckCircle2, AlertCircle } from 'lucide-react';

interface LogItem {
  id: string;
  time: string;
  type: 'info' | 'success' | 'zk' | 'error';
  message: string;
}

interface ActivityLogProps {
  logs: LogItem[];
  style?: React.CSSProperties;
}

export const ActivityLog: React.FC<ActivityLogProps> = ({ logs, style }) => {
  return (
    <div className="glass-card" style={style}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
        <Terminal color="var(--primary-accent)" size={15} />
        <h2 style={{ fontSize: '0.9rem', fontWeight: 600 }}>ZK Proof & Activity Audit Console</h2>
      </div>

      <div style={{
        background: '#040711',
        border: '1px solid var(--card-border)',
        borderRadius: '5px',
        padding: '6px 10px',
        minHeight: '110px',
        flex: 1,
        overflowY: 'auto',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.68rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '3px'
      }}>
        {logs.map((log) => (
          <div key={log.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '5px' }}>
            <span style={{ color: 'var(--text-dim)', flexShrink: 0 }}>[{log.time}]</span>
            {log.type === 'zk' && <Shield size={11} color="var(--cyan-accent)" style={{ marginTop: '1px', flexShrink: 0 }} />}
            {log.type === 'success' && <CheckCircle2 size={11} color="var(--emerald-accent)" style={{ marginTop: '1px', flexShrink: 0 }} />}
            {log.type === 'error' && <AlertCircle size={11} color="var(--rose-accent)" style={{ marginTop: '1px', flexShrink: 0 }} />}
            <span style={{
              color: log.type === 'zk' ? 'var(--cyan-accent)' :
                log.type === 'success' ? 'var(--emerald-accent)' :
                log.type === 'error' ? 'var(--rose-accent)' : 'var(--text-muted)'
            }}>
              {log.message}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
