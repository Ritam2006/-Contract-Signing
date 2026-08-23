'use client';

import React from 'react';
import { Eye, EyeOff, ShieldAlert, Check } from 'lucide-react';

export const PrivacyInspector: React.FC = () => {
  return (
    <div className="glass-card">
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
        <Eye color="var(--cyan-accent)" size={16} />
        <h2 style={{ fontSize: '0.9rem', fontWeight: 600 }}>Privacy Model Inspector</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        <div style={{
          background: 'rgba(16, 185, 129, 0.05)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          borderRadius: '6px',
          padding: '8px 10px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--emerald-accent)', fontWeight: 700, fontSize: '0.74rem', marginBottom: '4px' }}>
            <EyeOff size={13} /> Observers CANNOT See
          </div>
          <ul style={{ fontSize: '0.7rem', color: 'var(--text-muted)', listStyle: 'none', paddingLeft: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Check size={11} color="var(--emerald-accent)" style={{ flexShrink: 0 }} /> Raw document text & clauses
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Check size={11} color="var(--emerald-accent)" style={{ flexShrink: 0 }} /> Secret signing keys / nonces
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Check size={11} color="var(--emerald-accent)" style={{ flexShrink: 0 }} /> Identity of signers
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Check size={11} color="var(--emerald-accent)" style={{ flexShrink: 0 }} /> Deal values & financial terms
            </li>
          </ul>
        </div>

        <div style={{
          background: 'rgba(99, 102, 241, 0.05)',
          border: '1px solid rgba(99, 102, 241, 0.2)',
          borderRadius: '6px',
          padding: '8px 10px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--primary-accent)', fontWeight: 700, fontSize: '0.74rem', marginBottom: '4px' }}>
            <Eye size={13} /> Disclosed Public State
          </div>
          <ul style={{ fontSize: '0.7rem', color: 'var(--text-muted)', listStyle: 'none', paddingLeft: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Check size={11} color="var(--primary-accent)" style={{ flexShrink: 0 }} /> Terms Hash (`terms_hash`)
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Check size={11} color="var(--primary-accent)" style={{ flexShrink: 0 }} /> Signers Root (`signers_root`)
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Check size={11} color="var(--primary-accent)" style={{ flexShrink: 0 }} /> Required signatures count
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Check size={11} color="var(--primary-accent)" style={{ flexShrink: 0 }} /> Current status (`ACTIVE/SIGNED`)
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
