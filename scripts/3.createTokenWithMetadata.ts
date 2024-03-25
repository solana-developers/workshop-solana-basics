/**
 * Demonstrates how to create a SPL token and store it's metadata on chain (using the Metaplex MetaData program)
 */

import * as dotenv from "dotenv";

import {
  extractSignatureFromFailedTransaction,
  savePublicKeyToFile,
  DEFAULT_CLI_KEYPAIR_PATH,
  KEYPAIR_PAYER_ENV_NAME,
  KEYPAIR_TESTER_ENV_NAME,
} from "@/utils";
import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  TransactionMessage,
  VersionedTransaction,
  clusterApiUrl,
} from "@solana/web3.js";
import { MINT_SIZE, TOKEN_PROGRAM_ID, createInitializeMint2Instruction } from "@solana/spl-token";
import {
  PROGRAM_ID as METADATA_PROGRAM_ID,
  createCreateMetadataAccountV3Instruction,
} from "@metaplex-foundation/mpl-token-metadata";
import {
  getExplorerLink,
  getKeypairFromEnvironment,
  initializeKeypair,
} from "@solana-developers/helpers";

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

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

// generate a new keypair to be used for our mint
const mintKeypair = Keypair.generate();

console.log("Mint address:", mintKeypair.publicKey.toBase58());

// define the assorted token config settings
const tokenConfig = {
  // define how many decimals we want our tokens to have
  decimals: 2,
  // custom name for the token
  name: "My Custom Token",
  // custom symbol for the token
  symbol: "CUSTOM",
  // off-chain metadata url (normally a json file)
  uri: "https://thisisnot.arealurl/info.json",
};

// image url: https://bafybeihkc3tu4ugc5camayoqw7tl2lahtzgm2kpiwps3itvfsv7zcmceji.ipfs.nftstorage.link/

/**
 * Build the 2 instructions required to create the token mint:
 * - standard "create account" to allocate space on chain
 * - initialize the token mint
 */

// create instruction for the token mint account
const createMintAccountInstruction = SystemProgram.createAccount({
  fromPubkey: payer.publicKey,
  newAccountPubkey: mintKeypair.publicKey,
  // the `space` required for a token mint is accessible in the `@solana/spl-token` sdk
  space: MINT_SIZE,
  // store enough lamports needed for our `space` to be rent exempt
  lamports: await connection.getMinimumBalanceForRentExemption(MINT_SIZE),
  // tokens are owned by the "token program"
  programId: TOKEN_PROGRAM_ID,
});

// Initialize that account as a Mint
const initializeMintInstruction = createInitializeMint2Instruction(
  mintKeypair.publicKey,
  tokenConfig.decimals,
  payer.publicKey, // mint authority
  payer.publicKey,
);

/**
 * Alternatively, you could also use the helper function from the
 * `@solana/spl-token` sdk to create and initialize the token's mint
 * ---
 * NOTE: this method is less efficient since the payer would need to
 * sign and pay for multiple transactions to perform all the actions. It
 * would also require more "round trips" to the blockchain as well.
 * But this option is available, should it fit your use case :)
 * */

/*
  console.log("Creating a token mint...");
  const mint = await createMint(
    connection,
    payer,
    // mint authority
    payer.publicKey,
    // freeze authority
    payer.publicKey,
    // decimals - use any number you desire
    tokenConfig.decimals,
    // manually define our token mint address
    mintKeypair,
  );
  console.log("Token's mint address:", mint.toBase58());
  */

/**
 * Build the instruction to store the token's metadata on chain
 * - derive the pda for the metadata account
 * - create the instruction with the actual metadata in it
 */

// derive the pda address for the Metadata account
const metadataAccount = PublicKey.findProgramAddressSync(
  [Buffer.from("metadata"), METADATA_PROGRAM_ID.toBuffer(), mintKeypair.publicKey.toBuffer()],
  METADATA_PROGRAM_ID,
)[0];

console.log("Metadata address:", metadataAccount.toBase58());

// Create the Metadata account for the Mint
const createMetadataInstruction = createCreateMetadataAccountV3Instruction(
  {
    metadata: metadataAccount,
    mint: mintKeypair.publicKey,
    mintAuthority: payer.publicKey,
    payer: payer.publicKey,
    updateAuthority: payer.publicKey,
  },
  {
    createMetadataAccountArgsV3: {
      data: {
        creators: null,
        name: tokenConfig.name,
        symbol: tokenConfig.symbol,
        uri: tokenConfig.uri,
        sellerFeeBasisPoints: 0,
        collection: null,
        uses: null,
      },
      // `collectionDetails` - for non-nft type tokens, normally set to `null` to not have a value set
      collectionDetails: null,
      // should the metadata be updatable?
      isMutable: true,
    },
  },
);

/**
 * Build the transaction to send to the blockchain
 */

const blockhash = (await connection.getLatestBlockhash()).blockhash;

const tx = new VersionedTransaction(
  new TransactionMessage({
    payerKey: payer.publicKey,
    recentBlockhash: blockhash,
    instructions: [
      createMintAccountInstruction,
      initializeMintInstruction,
      createMetadataInstruction,
    ],
  }).compileToV0Message(),
);

tx.sign([payer, mintKeypair]);

console.log("\n\n----------------------------\n");

try {
  // actually send the transaction
  const sig = await connection.sendTransaction(tx);

  // print the explorer url
  console.log("Transaction completed.");
  console.log(getExplorerLink("transaction", sig, "devnet"));

  // locally save our addresses for the demo
  savePublicKeyToFile("tokenMint", mintKeypair.publicKey);
} catch (err) {
  console.error("Failed to send transaction:");
  console.log(tx);

  // attempt to extract the signature from the failed transaction
  const failedSig = await extractSignatureFromFailedTransaction(connection, err);
  if (failedSig)
    console.log("Failed signature:", getExplorerLink("transaction", failedSig, "devnet"));

  throw err;
}
