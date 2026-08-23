'use client';

import React from 'react';
import { Database, Hash, CheckCircle2, Clock, XCircle, ShieldCheck } from 'lucide-react';

interface LedgerViewerProps {
  status: number;
  termsHash: string;
  signersRoot: string;
  requiredSigners: number;
  completedSignatures: number;
}

const STATUS_MAP: Record<number, { label: string; badge: string; icon: any }> = {
  0: { label: 'DRAFT', badge: 'badge-draft', icon: Clock },
  1: { label: 'ACTIVE', badge: 'badge-active', icon: Clock },
  2: { label: 'SIGNED', badge: 'badge-signed', icon: CheckCircle2 },
  3: { label: 'REVOKED', badge: 'badge-revoked', icon: XCircle }
};

export const LedgerViewer: React.FC<LedgerViewerProps> = ({
  status,
  termsHash,
  signersRoot,
  requiredSigners,
  completedSignatures
}) => {
  const current = STATUS_MAP[status] || STATUS_MAP[1];
  const Icon = current.icon;

  return (
    <div className="glass-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Database color="var(--amber-accent)" size={16} />
          <h2 style={{ fontSize: '0.9rem', fontWeight: 600 }}>Midnight Public Ledger State</h2>
        </div>
        <span className={`badge ${current.badge}`}>
          <Icon size={11} /> {current.label}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{
          padding: '6px 8px',
          background: 'rgba(15, 23, 42, 0.8)',
          borderRadius: '5px',
          border: '1px solid var(--card-border)'
        }}>
          <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)', marginBottom: '1px', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
            Terms Hash (Disclosed)
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--cyan-accent)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {termsHash || '0x0000000000000000000000000000000000000000000000000000000000000000'}
          </div>
        </div>

        <div style={{
          padding: '6px 8px',
          background: 'rgba(15, 23, 42, 0.8)',
          borderRadius: '5px',
          border: '1px solid var(--card-border)'
        }}>
          <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)', marginBottom: '1px', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
            Authorized Signers Root
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--amber-accent)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {signersRoot || '0x0000000000000000000000000000000000000000000000000000000000000000'}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
          <div style={{
            padding: '6px',
            background: 'rgba(15, 23, 42, 0.8)',
            borderRadius: '5px',
            border: '1px solid var(--card-border)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)' }}>Signatures Progress</div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--emerald-accent)', marginTop: '1px' }}>
              {completedSignatures} / {requiredSigners}
            </div>
          </div>

          <div style={{
            padding: '6px',
            background: 'rgba(15, 23, 42, 0.8)',
            borderRadius: '5px',
            border: '1px solid var(--card-border)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)' }}>Proof Verification</div>
            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--emerald-accent)', marginTop: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px' }}>
              <ShieldCheck size={13} /> Verified
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
