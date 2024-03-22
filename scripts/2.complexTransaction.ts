/**
 * Introduction to the Solana web3.js
 * Demonstrates how to build a more complex transaction, with multiple instructions
 */

import * as dotenv from "dotenv";

import {
  Connection,
  SystemProgram,
  TransactionMessage,
  VersionedTransaction,
  clusterApiUrl,
  PublicKey,
  Keypair,
} from "@solana/web3.js";
import {
  addKeypairToEnvFile,
  getExplorerLink,
  getKeypairFromEnvironment,
  initializeKeypair,
} from "@solana-developers/helpers";
import { DEFAULT_CLI_KEYPAIR_PATH, KEYPAIR_PAYER_ENV_NAME, KEYPAIR_TESTER_ENV_NAME } from "@/utils";

dotenv.config();

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

// create a connection to the Solana blockchain
const connection = new Connection(
  process.env.SOLANA_RPC_URL || clusterApiUrl("devnet"),
  "confirmed",
);

const payer = await initializeKeypair(connection, {
  keypairPath: DEFAULT_CLI_KEYPAIR_PATH,
  envVariableName: KEYPAIR_PAYER_ENV_NAME,
});

console.log("Payer address:", payer.publicKey.toBase58(), "\n");

// const testKeypair = await initializeKeypair(connection, {
//   envVariableName: KEYPAIR_TESTER_ENV_NAME,
//   requestAirdropIfRequired: false
// });

const testKeypair = getKeypairFromEnvironment(KEYPAIR_TESTER_ENV_NAME);

console.log("Test keypair address:", testKeypair.publicKey.toBase58());

/**
 * create a simple instruction (using web3.js) to create an account
 */

// on-chain space to allocated (in number of bytes)
const space = 0;

// request the cost (in lamports) to allocate `space` number of bytes on chain
const balanceForRentExemption = await connection.getMinimumBalanceForRentExemption(space);

// create this simple instruction using web3.js helper function
const createTestAccountIx = SystemProgram.createAccount({
  // `fromPubkey` - this account will need to sign the transaction
  fromPubkey: payer.publicKey,
  // `newAccountPubkey` - the account address to create on chain
  newAccountPubkey: testKeypair.publicKey,
  // lamports to store in this account
  lamports: balanceForRentExemption + 2_000_000,
  // total space to allocate
  space,
  // the owning program for this account
  programId: SystemProgram.programId,
});

// create an instruction to transfer lamports
const transferToTestKeypairIx = SystemProgram.transfer({
  lamports: balanceForRentExemption + 100_000,
  // `fromPubkey` - from MUST sign the transaction
  fromPubkey: payer.publicKey,
  // `toPubkey` - does NOT have to sign the transaction
  toPubkey: testKeypair.publicKey,
  programId: SystemProgram.programId,
});

// create an other instruction to transfer lamports
const transferToStaticAddressIx = SystemProgram.transfer({
  lamports: 100_000,
  // `fromPubkey` - from MUST sign the transaction
  fromPubkey: payer.publicKey,
  // `toPubkey` - does NOT have to sign the transaction
  toPubkey: new PublicKey("GQuioVe2yA6KZfstgmirAvugfUZBcdxSi7sHK7JGk3gk"),
  programId: SystemProgram.programId,
});

/**
 * build the transaction to send to the blockchain
 */

// get the latest recent blockhash
let recentBlockhash = await connection.getLatestBlockhash().then(res => res.blockhash);

// create a transaction message
const message = new TransactionMessage({
  payerKey: payer.publicKey,
  recentBlockhash,
  instructions: [
    // create the test account on chain
    createTestAccountIx,
    // transfer lamports to the static address
    transferToStaticAddressIx,
    // transfer lamports to the test address
    transferToTestKeypairIx,
    // transfer lamports to the static address
    transferToStaticAddressIx,
  ],
}).compileToV0Message();

/**
 * try changing the order of the instructions inside of the message above...
 * see what happens :)
 */

// create a versioned transaction using the message
const tx = new VersionedTransaction(message);

// console.log("tx before signing:", tx);

// sign the transaction with our needed Signers (e.g. `payer` and `testKeypair`)
tx.sign([payer, testKeypair]);

// actually send the transaction
const txSig = await connection.sendTransaction(tx);

console.log("Transaction completed");
console.log(getExplorerLink("transaction", txSig, "devnet"));
