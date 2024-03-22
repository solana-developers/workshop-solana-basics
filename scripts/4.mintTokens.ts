/**
 * Demonstrates how to create new SPL tokens (aka "minting tokens") into an existing SPL Token Mint
 */

import * as dotenv from "dotenv";

import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount, mintTo } from "@solana/spl-token";
import { getExplorerLink, initializeKeypair } from "@solana-developers/helpers";
import { loadPublicKeysFromFile, DEFAULT_CLI_KEYPAIR_PATH, KEYPAIR_PAYER_ENV_NAME } from "@/utils";

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

// load the stored PublicKeys for ease of use
let localKeys = loadPublicKeysFromFile();

// ensure the desired script was already run
if (!localKeys?.tokenMint) {
  console.warn("No local keys were found. Please run '3.createTokenWithMetadata.ts'");
  process.exit();
}

const tokenMint: PublicKey = localKeys.tokenMint;

console.log("==== Local PublicKeys loaded ====");
console.log("Token's mint address:", tokenMint.toBase58());
console.log(getExplorerLink("address", tokenMint.toBase58(), "devnet"));

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

/**
 * SPL tokens are owned using a special relationship where the actual tokens
 * are stored/owned by a different account, which is then owned by the user's
 * wallet/account
 * This special account is called "associated token account" (or "ata" for short)
 * ---
 * think of it like this: tokens are stored in the ata for each "tokenMint",
 * the ata is then owned by the user's wallet
 */

// get or create the token's ata
const tokenAccount = await getOrCreateAssociatedTokenAccount(
  connection,
  payer,
  tokenMint,
  payer.publicKey,
).then(ata => ata.address);

/*
    note: when creating an ata, the instruction will allocate space on chain
    if you attempt to allocate space at an existing address on chain, the transaction will fail.
    ---
    sometimes, it may be useful to directly create the ata when you know it has not already been created on chain
    you can see how to do that below
  */

// directly create the ata
// const tokenAccount = await createAccount(connection, payer, tokenMint, payer.publicKey);

console.log("Token account address:", tokenAccount.toBase58());

/**
 * The number of tokens to mint takes into account the `decimal` places set on your `tokenMint`.
 * So ensure you are minting the correct, desired number of tokens.
 * ---
 * examples:
 * - if decimals=2, amount=1_000 => actual tokens minted == 10
 * - if decimals=2, amount=10_000 => actual tokens minted == 100
 * - if decimals=2, amount=10 => actual tokens minted == 0.10
 */

const amountOfTokensToMint = 1_000;

// mint some token to the "ata"
console.log("Minting some tokens to the ata...");
const mintSig = await mintTo(
  connection,
  payer,
  tokenMint,
  tokenAccount,
  payer, // mint authority
  amountOfTokensToMint,
);

console.log(getExplorerLink("transaction", mintSig, "devnet"));
