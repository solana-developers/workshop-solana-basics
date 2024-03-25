/**
 * Introduction to the Solana web3.js package
 * Demonstrating how to build and send simple transactions to the blockchain
 */

import * as dotenv from "dotenv";
import {
  Cluster,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  clusterApiUrl,
} from "@solana/web3.js";

dotenv.config();

/**
 * Clusters
 *
 * `Clusters` are the different Solana networks that are available
 *
 * - `mainnet-beta` (aka mainnet) - real tokens, real interactions
 *    - similar idea of a "production environment" in web2 software development
 * - `devnet` - fake tokens, used for testing dApps and programs in a mainnet-like environment
 *    - similar idea of a "staging environment" in web2 software development
 * - `testnet` - used to test the new features of the Solana blockchain
 * - `localnet` - run a local Solana validator/network on your machine for testing
 *    - requires the Solana CLI be installed, but gives a better developer experience
 */

const cluster: Cluster = "devnet";

/**
 * Connections
 *
 * Connecting to the Solana blockchain is done using the `Connection` class
 * by passing in a URL to your desired RPC endpoint. This URL will determine
 * which Solana Cluster your code will interact with.
 *
 * - `clusterApiUrl()` - can help give you a shorthand for the public RPC endpoints
 * - public RPC endpoints should not be used in production
 *    - you will get rate limited and/or requests blocked
 */

console.log("\n\n------------------------------------------");
console.log("Connections", "\n");

const connection = new Connection(clusterApiUrl(cluster));
console.log(connection.rpcEndpoint);

// using env variables for your RPC provider, with a fallback to another url
const connection2 = new Connection(process.env.SOLANA_RPC_URL || clusterApiUrl(cluster));
console.log(connection2.rpcEndpoint);

/**
 * Keypairs, secret keys, and public keys
 *
 * - `Keypairs` - a securely generated "secret key" and its corresponding "secret key"
 *
 * - `publicKey` - the public address for, normally represented as a base58 string (aka "address")
 *
 * - `secretKey` - raw bytes that allow this secret key to cryptographically sign
 *      transactions on behalf of its respective public key
 *
 * your "Solana wallet" is a keypair that your wallet software (e.g. Phantom,
 * Solflare, Ledger, Backpack, etc) provides a UI that enables you to use your
 * "secret key" to cryptographically sign transactions for its respective
 * "public key" (aka your "Solana address")
 */

console.log("\n\n------------------------------------------");
console.log("Keypairs, secret keys, and public keys", "\n");

// generate a new, random address
const keypair = Keypair.generate();

console.log("New keypair generated:", keypair);
console.log("Public key address (safe to share):", keypair.publicKey.toBase58());
console.log("Secret key (NEVER SHARE):", keypair.secretKey);

// you can also create a valid public key from a base58 string
// this is a random "wallet"
const customPubkey = new PublicKey("nick6zJc6HpW3kfBm4xS2dmbuVRyb5F3AnUvj5ymzR5");

// this is the "token mint" for the USDC token on Solana
const tokenProgramAccount = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");

/**
 * Keypairs can be loaded from environment variables, files on your local file
 * system, maintained withing your favorite wallet app/UI
 *
 * `@solana-developers/helpers` has helper functions for working with and loading keypairs
 */

/**
 * load a keypair from either the local file system or an env variable
 * then auto airdrop some sol if this keypair has a low balance
 */
// const keypair2 = await initializeKeypair(connection, {
//   // this path is the default for the Solana CLI
//   keypairPath: "~/.config/solana/id.json",
//   envVariableName: "MY_PRIVATE_KEY",
// });

// console.log("keypair2 public address:", keypair2.publicKey.toBase58(), "\n");

/**
 * Account balances
 *
 * every active account on Solana is required to keep a balance of SOL (aka `lamports`)
 */

console.log("\n\n------------------------------------------");
console.log("Account balances", "\n");

// get the current balance of the `payer` account on chain
const currentBalance = await connection.getBalance(keypair.publicKey);
console.log("Account address:", keypair.publicKey.toBase58());
console.log("Current balance (in lamports):", currentBalance);
console.log("Current balance (in SOL):", currentBalance / LAMPORTS_PER_SOL);

// note:
// since the newly generated `keypair.publicKey` account has not been allocated
// on chain (aka it does not actually exist yet), it's balance should be zero

console.log("\n");

const currentBalance2 = await connection.getBalance(customPubkey);
console.log("Account address:", customPubkey.toBase58());
console.log("Current balance (in lamports):", currentBalance2);
console.log("Current balance (in SOL):", currentBalance2 / LAMPORTS_PER_SOL);

/**
 * Space and data storage fees called "rent"
 *
 * every account must pay a refundable data storage fee called "rent".
 *
 * you can think of "rent" as the required minimum deposit of SOL into an
 * account that the Solana validators require keep your account's data on chain
 *
 * the rent deposited into an account can be reclaimed/refunded when the account
 * is closed (by transferring the all deposited `lamports` to another account
 * making the final post-transaction balance to be exactly zero)
 */

console.log("\n\n------------------------------------------");
console.log("Space and rent", "\n");

// request the cost (in lamports) to allocate `space` number of bytes on chain
const space = 0;
const lamports = await connection.getMinimumBalanceForRentExemption(space);
console.log(`Total lamports to store ${space} bytes:`, lamports);
console.log("Total in SOL:", lamports / LAMPORTS_PER_SOL);

console.log("\n");

const space10k = 10_000;
const lamports10k = await connection.getMinimumBalanceForRentExemption(space10k);
console.log(`Total lamports to store ${space10k} bytes:`, lamports10k);
console.log("Total in SOL:", lamports10k / LAMPORTS_PER_SOL);

console.log("\n");

const space100k = 100_000;
const lamports100k = await connection.getMinimumBalanceForRentExemption(space100k);
console.log(`Total lamports to store ${space100k} bytes:`, lamports100k);
console.log("Total in SOL:", lamports100k / LAMPORTS_PER_SOL);

/**
 * Reading data from the blockchain
 *
 * remember: all data is stored in accounts, and all accounts have a unique address
 */

console.log("\n\n------------------------------------------");
console.log("Reading data", "\n");

const accountInfo = await connection.getAccountInfo(customPubkey);
console.log("Account info for:", customPubkey.toBase58());
console.log(accountInfo);

console.log("\n");

const accountInfo2 = await connection.getAccountInfo(tokenProgramAccount);
console.log("Account info for:", tokenProgramAccount.toBase58());
console.log(accountInfo2);

/**
 * note: the `accountInfo.data` is a buffer of raw bytes (i.e. an array of numbers).
 * to get the structured data out of a specific account, your code will need to
 * know how to correctly "deserialize" these raw bytes into the correct data
 * structure (i.e. a Javascript object)
 *
 * since each program can choose their own structure for the `data` they want
 * to store in their related accounts, you may need to consult their specific
 * programs documentation or SDK in order to be able to correctly deserialize
 * the raw bytes stored in the `accountInfo.data` for use within your code
 */

/**
 * Recent blockhash
 *
 * A "recent blockhash" is like a special timestamp that the blockchain
 * will use to help validate transactions, especially making sure they
 * were recently created.
 *
 * A blockhash expires after about 13 seconds
 */

console.log("\n\n------------------------------------------");
console.log("Recent blockhash", "\n");

const latestBlockhash = await connection.getLatestBlockhash();
console.log("latestBlockhash:", latestBlockhash);

// this is the more common way to get the recent blockhash
const recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
console.log("recentBlockhash:", recentBlockhash);
