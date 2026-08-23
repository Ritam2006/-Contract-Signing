'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Wallet, ShieldCheck, Cpu, LogOut, CheckCircle2, AlertCircle, ChevronDown, Check } from 'lucide-react';

interface LaceConnectorProps {
  network: string;
  setNetwork: (net: string) => void;
  contractAddress: string;
}

const NETWORK_OPTIONS = [
  { value: 'preprod', label: 'Midnight Preprod' },
  { value: 'undeployed', label: 'Local (Undeployed)' },
  { value: 'preview', label: 'Midnight Preview' }
];

export const LaceConnector: React.FC<LaceConnectorProps> = ({
  network,
  setNetwork,
  contractAddress
}) => {
  const [isConnected, setIsConnected] = useState(true);
  const [walletAddress] = useState('mn_addr_preprod1q9x2a40386ff90d7c3bc21008f1a7d65c49089e90a88b1f23');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = NETWORK_OPTIONS.find(o => o.value === network) || NETWORK_OPTIONS[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleConnect = async () => {
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnected(true);
      setIsConnecting(false);
    }, 800);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
  };

  return (
    <div className="glass-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: '#6366f1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Wallet size={18} color="#ffffff" />
          </div>
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600 }}>Lace Wallet Connection</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              <span>Network:</span>

              {/* Custom Dark Dropdown */}
              <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  style={{
                    background: '#1e293b',
                    color: 'var(--cyan-accent)',
                    border: '1px solid #334155',
                    borderRadius: '5px',
                    padding: '2px 8px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    outline: 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span>{selectedOption.label}</span>
                  <ChevronDown
                    size={12}
                    style={{
                      transform: isDropdownOpen ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.2s ease'
                    }}
                  />
                </button>

                {isDropdownOpen && (
                  <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 4px)',
                    left: 0,
                    zIndex: 100,
                    minWidth: '160px',
                    background: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '6px',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.7)',
                    overflow: 'hidden',
                    padding: '3px'
                  }}>
                    {NETWORK_OPTIONS.map((opt) => {
                      const isSelected = opt.value === network;
                      return (
                        <div
                          key={opt.value}
                          onClick={() => {
                            setNetwork(opt.value);
                            setIsDropdownOpen(false);
                          }}
                          style={{
                            padding: '6px 10px',
                            fontSize: '0.75rem',
                            fontWeight: isSelected ? 600 : 500,
                            color: isSelected ? '#6366f1' : '#f8fafc',
                            background: isSelected ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            transition: 'background 0.15s ease'
                          }}
                          onMouseEnter={(e) => {
                            if (!isSelected) e.currentTarget.style.background = '#1e293b';
                          }}
                          onMouseLeave={(e) => {
                            if (!isSelected) e.currentTarget.style.background = 'transparent';
                          }}
                        >
                          <span>{opt.label}</span>
                          {isSelected && <Check size={12} color="#6366f1" />}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {isConnected ? (
            <>
              <div style={{ textAlign: 'right' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', fontWeight: 600, color: 'var(--emerald-accent)' }}>
                  <CheckCircle2 size={13} /> Connected to Lace
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '1px' }}>
                  {walletAddress.slice(0, 12)}...{walletAddress.slice(-6)}
                </div>
              </div>
              <button className="btn btn-secondary" onClick={handleDisconnect} title="Disconnect Wallet">
                <LogOut size={14} /> Disconnect
              </button>
            </>
          ) : (
            <button className="btn btn-primary" onClick={handleConnect} disabled={isConnecting}>
              <ShieldCheck size={15} /> {isConnecting ? 'Connecting...' : 'Connect Lace Wallet'}
            </button>
          )}
        </div>
      </div>

      <div style={{
        marginTop: '10px',
        paddingTop: '10px',
        borderTop: '1px solid var(--card-border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '8px',
        fontSize: '0.75rem',
        color: 'var(--text-muted)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <Cpu size={12} color="var(--cyan-accent)" /> Contract:
          <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-main)', fontSize: '0.72rem' }}>
            {contractAddress.slice(0, 10)}...{contractAddress.slice(-6)}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <AlertCircle size={12} color="var(--amber-accent)" /> Proof Server:
          <span style={{ color: 'var(--emerald-accent)', fontWeight: 600, fontSize: '0.72rem' }}>Active (Port 6300)</span>
        </div>
      </div>
    </div>
  );
};
