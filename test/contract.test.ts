import { describe, it, expect } from 'vitest';
import { LocalContractInstance, hashDocument, computeSignerCommitment, ContractStatus } from '../contract/src/index.js';

describe('Confidential Contract Signing - Smart Contract & Privacy Tests', () => {
  it('1. Document Hashing & Public Ledger Disclosure', () => {
    const documentBody = 'Confidential Non-Disclosure Agreement between Party A and Party B';
    const termsHash = hashDocument(documentBody);

    expect(termsHash).toHaveLength(64);
    expect(termsHash).toEqual(hashDocument(documentBody)); // deterministic
    expect(termsHash).not.toEqual(documentBody); // document body is obfuscated behind hash

    const signersRoot = hashDocument('Alice, Bob');
    const contract = new LocalContractInstance(termsHash, signersRoot, 2);

    const state = contract.getState();
    expect(state.termsHash).toBe(termsHash);
    expect(state.signersRoot).toBe(signersRoot);
    expect(state.requiredSigners).toBe(2);
    expect(state.completedSignatures).toBe(0);
    expect(state.status).toBe(ContractStatus.ACTIVE);
  });

  it('2. Private Witness Signing & State Transition', () => {
    const termsHash = hashDocument('Employment Agreement Confidential Terms');
    const contract = new LocalContractInstance(termsHash, 'root123', 1);

    const secretWitness = {
      secretSigningKey: '0xpriv_key_alice_9876543210',
      documentSecretNonce: '0xnonce_abc123'
    };

    const commitment = computeSignerCommitment(secretWitness.secretSigningKey, secretWitness.documentSecretNonce);
    expect(commitment).toHaveLength(64);

    const success = contract.signContract(secretWitness);
    expect(success).toBe(true);

    const state = contract.getState();
    expect(state.completedSignatures).toBe(1);
    expect(state.status).toBe(ContractStatus.SIGNED);
  });

  it('3. Rejection of Invalid or Duplicate Signatures', () => {
    const termsHash = hashDocument('Confidential Financial Term Sheet');
    const contract = new LocalContractInstance(termsHash, 'root999', 1);

    // Test invalid secret key
    expect(() => {
      contract.signContract({ secretSigningKey: '', documentSecretNonce: '0xnonce123' });
    }).toThrowError('Invalid private key witness');

    // Test valid sign
    contract.signContract({ secretSigningKey: '0xvalidsecretkey', documentSecretNonce: '0xvalidnonce' });

    // Test duplicate sign on fully signed contract
    expect(() => {
      contract.signContract({ secretSigningKey: '0xanotherkey', documentSecretNonce: '0xanothernonce' });
    }).toThrowError('Contract is not active for signing');
  });

  it('4. Contract Revocation & Privacy Witness Validation', () => {
    const termsHash = hashDocument('Temporary NDA');
    const contract = new LocalContractInstance(termsHash, 'root777', 2);

    const secretWitness = {
      secretSigningKey: '0xownerkey',
      documentSecretNonce: '0xownernonce'
    };

    const revoked = contract.revokeContract(secretWitness);
    expect(revoked).toBe(true);

    const state = contract.getState();
    expect(state.status).toBe(ContractStatus.REVOKED);

    expect(() => {
      contract.revokeContract(secretWitness);
    }).toThrowError('Contract is already revoked');
  });
});
