'use client';

import React, { useState, useEffect } from 'react';
import { Shield, CheckCircle2, Cpu, Database, Wallet, ArrowRight } from 'lucide-react';

interface LoadingPageProps {
  onComplete: () => void;
}

const INIT_STEPS = [
  { label: 'Initializing Midnight Network Configuration', icon: Database },
  { label: 'Connecting to Proof Server (Port 6300)', icon: Cpu },
  { label: 'Loading Compact Smart Contract Managed Circuits', icon: Shield },
  { label: 'Verifying Lace Wallet Provider Interface', icon: Wallet }
];

export const LoadingPage: React.FC<LoadingPageProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState<number>(0);
  const [activeStep, setActiveStep] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const next = prev + 5;
        if (next >= 25 && next < 50) setActiveStep(1);
        else if (next >= 50 && next < 75) setActiveStep(2);
        else if (next >= 75) setActiveStep(3);
        return next;
      });
    }, 90);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'transparent',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50,
      padding: '16px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '410px',
        background: 'rgba(17, 24, 39, 0.88)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '12px',
        padding: '24px 22px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.6), 0 0 30px rgba(99, 102, 241, 0.15)'
      }}>
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '10px',
          background: '#6366f1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '14px',
          boxShadow: '0 0 0 6px rgba(99, 102, 241, 0.15)'
        }}>
          <Shield size={24} color="#ffffff" />
        </div>

        <h1 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc', marginBottom: '4px', textAlign: 'center' }}>
          Confidential Contract Signing
        </h1>
        <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '20px', textAlign: 'center' }}>
          Midnight Network &bull; Zero-Knowledge Agreement Protocol
        </p>

        {/* Progress Bar */}
        <div style={{ width: '100%', marginBottom: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '6px', fontWeight: 600 }}>
            <span>System Initialization</span>
            <span style={{ fontFamily: 'var(--font-mono)', color: '#6366f1' }}>{progress}%</span>
          </div>
          <div style={{ width: '100%', height: '6px', background: '#1e293b', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{
              width: `${progress}%`,
              height: '100%',
              background: '#6366f1',
              transition: 'width 0.1s linear'
            }} />
          </div>
        </div>

        {/* Step Checklist */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '22px' }}>
          {INIT_STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isDone = progress >= (idx + 1) * 25;
            const isCurrent = activeStep === idx && !isDone;

            return (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '7px 10px',
                background: isCurrent ? 'rgba(99, 102, 241, 0.1)' : '#0f172a',
                border: isCurrent ? '1px solid #4f46e5' : '1px solid #1f2937',
                borderRadius: '6px',
                fontSize: '0.76rem',
                transition: 'all 0.2s ease'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: isDone || isCurrent ? '#f8fafc' : '#64748b' }}>
                  <Icon size={14} color={isDone ? '#10b981' : isCurrent ? '#6366f1' : '#64748b'} />
                  <span style={{ fontWeight: isCurrent ? 600 : 400 }}>{step.label}</span>
                </div>
                {isDone ? (
                  <CheckCircle2 size={14} color="#10b981" />
                ) : isCurrent ? (
                  <div className="spinner" style={{ width: '12px', height: '12px', borderWidth: '2px', marginBottom: 0 }} />
                ) : (
                  <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Pending</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        {progress >= 100 ? (
          <button
            className="btn btn-primary"
            onClick={onComplete}
            style={{ width: '100%', padding: '9px 16px', fontSize: '0.88rem', borderRadius: '6px' }}
          >
            Launch Confidential dApp <ArrowRight size={15} />
          </button>
        ) : (
          <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div className="spinner" style={{ width: '12px', height: '12px', borderWidth: '2px', marginBottom: 0 }} />
            Preparing Zero-Knowledge runtime environment...
          </div>
        )}
      </div>
    </div>
  );
};
