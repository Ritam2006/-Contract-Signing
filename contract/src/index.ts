import { createHash } from 'crypto';

export enum ContractStatus {
  DRAFT = 0,
  ACTIVE = 1,
  SIGNED = 2,
  REVOKED = 3
}

export interface ContractLedgerState {
  status: ContractStatus;
  termsHash: string;
  signersRoot: string;
  requiredSigners: number;
  completedSignatures: number;
}

export interface PrivateWitness {
  secretSigningKey: string;
  documentSecretNonce: string;
}

export interface ContractConfig {
  network: 'undeployed' | 'preprod' | 'preview' | 'mainnet';
  contractAddress?: string;
  proofServerUrl?: string;
  rpcUrl?: string;
  indexerUrl?: string;
}

/**
 * Computes a SHA-256 hash of document text or binary content
 */
export function hashDocument(content: string): string {
  return createHash('sha256').update(content, 'utf8').digest('hex');
}

/**
 * Computes a signer authorization commitment hash
 */
export function computeSignerCommitment(secretKey: string, secretNonce: string): string {
  return createHash('sha256')
    .update(`${secretKey}:${secretNonce}`, 'utf8')
    .digest('hex');
}

/**
 * Local contract state simulator for offline development, local proof verification, and test execution
 */
export class LocalContractInstance {
  private state: ContractLedgerState;

  constructor(termsHash: string, signersRoot: string, requiredSigners: number = 1) {
    this.state = {
      status: ContractStatus.ACTIVE,
      termsHash,
      signersRoot,
      requiredSigners,
      completedSignatures: 0
    };
  }

  public getState(): ContractLedgerState {
    return { ...this.state };
  }

  public signContract(witness: PrivateWitness): boolean {
    if (this.state.status !== ContractStatus.ACTIVE) {
      throw new Error('Contract is not active for signing');
    }
    if (this.state.completedSignatures >= this.state.requiredSigners) {
      throw new Error('All required signatures are already present');
    }
    if (!witness.secretSigningKey || witness.secretSigningKey.length < 4) {
      throw new Error('Invalid private key witness');
    }
    if (!witness.documentSecretNonce || witness.documentSecretNonce.length < 4) {
      throw new Error('Invalid document secret nonce');
    }

    this.state.completedSignatures += 1;
    if (this.state.completedSignatures >= this.state.requiredSigners) {
      this.state.status = ContractStatus.SIGNED;
    }
    return true;
  }

  public revokeContract(witness: PrivateWitness): boolean {
    if (this.state.status === ContractStatus.REVOKED) {
      throw new Error('Contract is already revoked');
    }
    if (!witness.secretSigningKey || !witness.documentSecretNonce) {
      throw new Error('Unauthorized revocation request');
    }
    this.state.status = ContractStatus.REVOKED;
    return true;
  }
}
