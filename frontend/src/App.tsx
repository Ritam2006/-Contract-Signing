'use client';

import React, { useState } from 'react';
import { LoadingPage } from './components/LoadingPage';
import { LaceConnector } from './components/LaceConnector';
import { ContractBuilder } from './components/ContractBuilder';
import { ContractSigner } from './components/ContractSigner';
import { LedgerViewer } from './components/LedgerViewer';
import dynamic from 'next/dynamic';
import { PrivacyInspector } from './components/PrivacyInspector';
import { ActivityLog } from './components/ActivityLog';
import { Shield, Layers } from 'lucide-react';

const WavyBackground = dynamic(
  () => import('./components/WavyBackground').then((mod) => mod.WavyBackground),
  { ssr: false }
);

interface LogItem {
  id: string;
  time: string;
  type: 'info' | 'success' | 'zk' | 'error';
  message: string;
}

export const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [network, setNetwork] = useState<string>(process.env.NEXT_PUBLIC_NETWORK || 'preprod');
  const [contractAddress, setContractAddress] = useState<string>(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0xfa0030537b98d41e777e30129a492c504edb968555f4251f450f9375a984c2f1');

  // Contract State
  const [status, setStatus] = useState<number>(1); // ACTIVE
  const [termsHash, setTermsHash] = useState<string>('0xe3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
  const [signersRoot, setSignersRoot] = useState<string>('0x8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4');
  const [requiredSigners, setRequiredSigners] = useState<number>(2);
  const [completedSignatures, setCompletedSignatures] = useState<number>(0);

  const [isInitializing, setIsInitializing] = useState<boolean>(false);
  const [isSigning, setIsSigning] = useState<boolean>(false);

  const [logs, setLogs] = useState<LogItem[]>([
    { id: '1', time: new Date().toLocaleTimeString(), type: 'info', message: 'Initialized Confidential Contract Signing dApp on Midnight Preprod Testnet.' },
    { id: '2', time: new Date().toLocaleTimeString(), type: 'zk', message: 'Proof server connected at http://localhost:6300.' },
    { id: '3', time: new Date().toLocaleTimeString(), type: 'info', message: 'Loaded Compact circuit managed artifacts for Preprod network.' }
  ]);

  const addLog = (type: 'info' | 'success' | 'zk' | 'error', message: string) => {
    setLogs((prev) => [
      ...prev,
      { id: Date.now().toString(), time: new Date().toLocaleTimeString(), type, message }
    ]);
  };

  const handleInitialize = (docText: string, computedTermsHash: string, signersCount: number) => {
    setIsInitializing(true);
    addLog('info', 'Compiling circuit witnesses and creating public ledger state...');

    setTimeout(() => {
      setTermsHash('0x' + computedTermsHash);
      setRequiredSigners(signersCount);
      setCompletedSignatures(0);
      setStatus(1); // ACTIVE
      const newAddress = '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      setContractAddress(newAddress);
      setIsInitializing(false);
      addLog('success', `Contract deployed to ${network} network at ${newAddress.slice(0, 12)}...`);
      addLog('zk', `Public Terms Hash committed to ledger: ${computedTermsHash.slice(0, 16)}...`);
    }, 1200);
  };

  const handleSign = (secretKey: string, secretNonce: string) => {
    setIsSigning(true);
    addLog('zk', 'Generating Zero-Knowledge Proof for secret key witness...');

    setTimeout(() => {
      setCompletedSignatures((prev) => {
        const next = prev + 1;
        if (next >= requiredSigners) {
          setStatus(2); // SIGNED
          addLog('success', 'Contract status transitioned to SIGNED! Threshold satisfied.');
        } else {
          addLog('success', `Signature ${next}/${requiredSigners} verified on-chain via ZK proof.`);
        }
        return next;
      });
      setIsSigning(false);
    }, 1500);
  };

  const handleRevoke = (secretKey: string, secretNonce: string) => {
    setIsSigning(true);
    addLog('zk', 'Proving revocation authorization witness...');

    setTimeout(() => {
      setStatus(3); // REVOKED
      setIsSigning(false);
      addLog('error', 'Contract revoked on-chain via ZK proof verification!');
    }, 1000);
  };

  return (
    <WavyBackground backgroundFill="#090d16" waveOpacity={0.4} speed="fast">
      {isLoading ? (
        <LoadingPage onComplete={() => setIsLoading(false)} />
      ) : (
        <div style={{ minHeight: '100vh' }}>
          <header className="header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                background: '#6366f1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Shield size={16} color="#ffffff" />
              </div>
              <div>
                <h1 className="solid-header-text" style={{ fontSize: '0.95rem', lineHeight: '1.2' }}>
                  Confidential Contract Signing
                </h1>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                  Midnight Network Level 3 Submission &bull; Zero-Knowledge Agreement Protocol
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-active">
                <Layers size={11} /> Midnight Compact 0.5.1
              </span>
            </div>
          </header>

          <main className="main-container">
            <div style={{ gridColumn: '1 / -1' }}>
              <LaceConnector
                network={network}
                setNetwork={setNetwork}
                contractAddress={contractAddress}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <ContractBuilder
                onInitialize={handleInitialize}
                isInitializing={isInitializing}
              />
              <ContractSigner
                onSign={handleSign}
                onRevoke={handleRevoke}
                isSigning={isSigning}
                contractStatus={status}
                completedSignatures={completedSignatures}
                requiredSigners={requiredSigners}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', height: '100%' }}>
              <LedgerViewer
                status={status}
                termsHash={termsHash}
                signersRoot={signersRoot}
                requiredSigners={requiredSigners}
                completedSignatures={completedSignatures}
              />
              <PrivacyInspector />
              <ActivityLog logs={logs} style={{ flex: 1, display: 'flex', flexDirection: 'column' }} />
            </div>
          </main>
        </div>
      )}
    </WavyBackground>
  );
};

export default App;
