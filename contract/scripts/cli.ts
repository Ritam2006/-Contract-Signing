import { LocalContractInstance, hashDocument, ContractStatus } from '../src/index.js';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const askQuestion = (query: string): Promise<string> => {
  return new Promise((resolve) => rl.question(query, resolve));
};

async function main() {
  console.log('====================================================');
  console.log('    CONFIDENTIAL CONTRACT SIGNING - CLI INTERACTION  ');
  console.log('====================================================\n');

  const docText = await askQuestion('Enter Confidential Document Body text: ');
  const termsHash = hashDocument(docText || 'Confidential NDA Agreement sample terms');
  const signersRoot = hashDocument('Signers: Alice, Bob');

  console.log(`\n[INIT] Generated Terms Hash: ${termsHash}`);
  console.log(`[INIT] Initializing contract with 1 required signature...`);

  const contract = new LocalContractInstance(termsHash, signersRoot, 1);
  console.log('[LEDGER STATE]', contract.getState());

  const signAnswer = await askQuestion('\nDo you want to sign this contract privately? (y/n): ');
  if (signAnswer.toLowerCase().startsWith('y')) {
    const secretKey = await askQuestion('Enter Private Signing Key (secret witness): ');
    const secretNonce = await askQuestion('Enter Document Secret Nonce (secret witness): ');

    try {
      console.log('\n[ZK PROOF] Generating Zero-Knowledge Proof for secret key witness...');
      contract.signContract({
        secretSigningKey: secretKey || '0xprivatesecretkey123',
        documentSecretNonce: secretNonce || '0xnonce98765'
      });
      console.log('[SUCCESS] Signature verified on-chain via ZK proof!');
      console.log('[UPDATED LEDGER STATE]', contract.getState());
      console.log(`[VERIFICATION] Contract status is now: ${ContractStatus[contract.getState().status]}`);
    } catch (err: any) {
      console.error('[ERROR] Signature failed:', err.message);
    }
  }

  rl.close();
}

main().catch((err) => {
  console.error('[ERROR]', err);
  process.exit(1);
});
