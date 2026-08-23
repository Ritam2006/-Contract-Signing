'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Lock, Sparkles, Hash, Users, ArrowRight } from 'lucide-react';

interface ContractBuilderProps {
  onInitialize: (docText: string, termsHash: string, requiredSigners: number) => void;
  isInitializing: boolean;
}

export const ContractBuilder: React.FC<ContractBuilderProps> = ({ onInitialize, isInitializing }) => {
  const [docText, setDocText] = useState(
    'CONFIDENTIAL NON-DISCLOSURE AGREEMENT\n\n' +
    'This Agreement is entered into between Party A and Party B. ' +
    'All proprietary software source code, zero-knowledge circuit definitions, and key materials ' +
    'disclosed under this contract shall remain strictly confidential.\n\n' +
    'Jurisdiction: Midnight Network Local / Preprod Testnet.'
  );
  const [requiredSigners, setRequiredSigners] = useState<number>(2);
  const [termsHash, setTermsHash] = useState<string>('');

  // Simple SHA-256 computation in browser for demonstration
  useEffect(() => {
    async function computeHash() {
      const msgUint8 = new TextEncoder().encode(docText);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      setTermsHash(hashHex);
    }
    computeHash();
  }, [docText]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docText.trim()) return;
    onInitialize(docText, termsHash, requiredSigners);
  };

  return (
    <div className="glass-card">
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
        <FileText color="var(--primary-accent)" size={16} />
        <h2 style={{ fontSize: '0.9rem', fontWeight: 600 }}>Create Confidential Agreement</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '8px' }}>
          <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '3px' }}>
            Agreement Document Body (Private Input)
          </label>
          <textarea
            className="input-field"
            value={docText}
            onChange={(e) => setDocText(e.target.value)}
            placeholder="Type or paste contract terms..."
            rows={3}
            style={{ fontSize: '0.74rem' }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '3px', fontSize: '0.68rem', color: 'var(--cyan-accent)' }}>
            <Lock size={10} /> Document text stays local and is never sent to blockchain.
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '8px', marginBottom: '10px' }}>
          <div style={{ minWidth: 0 }}>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '3px' }}>
              Computed Terms Hash (Public Commitment)
            </label>
            <div style={{
              padding: '5px 8px',
              background: 'rgba(15, 23, 42, 0.9)',
              border: '1px solid var(--card-border)',
              borderRadius: '5px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.68rem',
              color: 'var(--amber-accent)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              <Hash size={10} style={{ display: 'inline', marginRight: '3px' }} />
              {termsHash ? `${termsHash.slice(0, 14)}...${termsHash.slice(-10)}` : 'Computing...'}
            </div>
          </div>

          <div style={{ minWidth: 0 }}>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '3px', whiteSpace: 'nowrap' }}>
              Required Signers Count
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Users size={12} color="var(--text-muted)" style={{ flexShrink: 0 }} />
              <input
                type="number"
                min="1"
                max="10"
                className="input-field"
                style={{ width: '100%', padding: '4px 6px' }}
                value={requiredSigners}
                onChange={(e) => setRequiredSigners(parseInt(e.target.value) || 1)}
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: '100%' }}
          disabled={isInitializing || !termsHash}
        >
          {isInitializing ? (
            'Deploying Compact Circuit & Public Ledger State...'
          ) : (
            <>
              <Sparkles size={14} /> Initialize Contract on Midnight Ledger <ArrowRight size={13} />
            </>
          )}
        </button>
      </form>
    </div>
  );
};
