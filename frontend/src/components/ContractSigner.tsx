'use client';

import React, { useState } from 'react';
import { KeyRound, ShieldCheck, Cpu, AlertTriangle, CheckCircle2, Lock } from 'lucide-react';

interface ContractSignerProps {
  onSign: (secretKey: string, secretNonce: string) => void;
  onRevoke: (secretKey: string, secretNonce: string) => void;
  isSigning: boolean;
  contractStatus: number;
  completedSignatures: number;
  requiredSigners: number;
}

export const ContractSigner: React.FC<ContractSignerProps> = ({
  onSign,
  onRevoke,
  isSigning,
  contractStatus,
  completedSignatures,
  requiredSigners
}) => {
  const [secretKey, setSecretKey] = useState('0xpriv_alice_sec_9876543210');
  const [secretNonce, setSecretNonce] = useState('0xnonce_doc_314159265');
  const [signatureDone, setSignatureDone] = useState(false);

  const handleSign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!secretKey || !secretNonce) return;
    onSign(secretKey, secretNonce);
    setSignatureDone(true);
  };

  const handleRevoke = () => {
    if (!secretKey || !secretNonce) return;
    if (window.confirm('Are you sure you want to revoke this confidential contract?')) {
      onRevoke(secretKey, secretNonce);
    }
  };

  const isCompleted = contractStatus === 2; // SIGNED
  const isRevoked = contractStatus === 3; // REVOKED

  return (
    <div className="glass-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <KeyRound color="var(--emerald-accent)" size={16} />
          <h2 style={{ fontSize: '0.9rem', fontWeight: 600 }}>Private Witness Signing Panel</h2>
        </div>
        <span className="badge badge-active" style={{ fontSize: '0.65rem' }}>
          <Lock size={9} /> Disclose Witness: NONE
        </span>
      </div>

      {isRevoked ? (
        <div style={{
          padding: '8px 10px',
          borderRadius: '6px',
          background: 'rgba(244, 63, 94, 0.1)',
          border: '1px solid rgba(244, 63, 94, 0.3)',
          color: 'var(--rose-accent)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <AlertTriangle size={16} />
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.8rem' }}>Contract Revoked</div>
            <div style={{ fontSize: '0.72rem' }}>This agreement has been revoked on-chain via ZK proof verification.</div>
          </div>
        </div>
      ) : isCompleted ? (
        <div style={{
          padding: '8px 10px',
          borderRadius: '6px',
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          color: 'var(--emerald-accent)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <CheckCircle2 size={16} />
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.8rem' }}>Fully Executed & Signed</div>
            <div style={{ fontSize: '0.72rem' }}>All {requiredSigners} required confidential signatures have been successfully submitted and verified!</div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSign}>
          <div style={{ marginBottom: '8px' }}>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '3px' }}>
              Secret Signing Key (Private Witness Input)
            </label>
            <input
              type="password"
              className="input-field"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              placeholder="Enter your secret key..."
            />
          </div>

          <div style={{ marginBottom: '8px' }}>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '3px' }}>
              Document Secret Nonce (Salt Witness)
            </label>
            <input
              type="text"
              className="input-field"
              value={secretNonce}
              onChange={(e) => setSecretNonce(e.target.value)}
              placeholder="Enter random salt nonce..."
            />
          </div>

          <div style={{
            background: 'rgba(99, 102, 241, 0.08)',
            border: '1px dashed rgba(99, 102, 241, 0.3)',
            borderRadius: '5px',
            padding: '6px 8px',
            fontSize: '0.7rem',
            color: 'var(--text-muted)',
            marginBottom: '10px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '5px'
          }}>
            <Cpu size={13} color="var(--primary-accent)" style={{ flexShrink: 0, marginTop: '1px' }} />
            <div>
              <strong style={{ color: 'var(--text-main)' }}>Zero-Knowledge Guarantee:</strong> Secret key and nonce stay local in Compact circuit witness.
            </div>
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ flex: 1 }}
              disabled={isSigning || !secretKey || !secretNonce}
            >
              <ShieldCheck size={14} /> {isSigning ? 'Proving ZK Circuit...' : 'Sign Privately via ZK Proof'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleRevoke}
              disabled={isSigning}
              style={{ color: 'var(--rose-accent)' }}
            >
              Revoke
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
