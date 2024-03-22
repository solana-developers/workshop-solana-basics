/**
 * Demonstrates how to update the metadata for an SPL token, using the Metaplex MetadataProgram
 */

import * as dotenv from "dotenv";

import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import {
  PROGRAM_ID as METADATA_PROGRAM_ID,
  createUpdateMetadataAccountV2Instruction,
} from "@metaplex-foundation/mpl-token-metadata";
import { getExplorerLink, initializeKeypair } from "@solana-developers/helpers";
import {
  buildTransaction,
  extractSignatureFromFailedTransaction,
  loadPublicKeysFromFile,
  DEFAULT_CLI_KEYPAIR_PATH,
  KEYPAIR_PAYER_ENV_NAME,
} from "@/utils";

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

// define the new token config settings
const tokenConfig = {
  // new name
  name: "New Super Sweet Token",
  // new symbol
  symbol: "nSST",
  // new uri
  uri: "https://thisisnot.arealurl/new.json",
};

/**
 * Build the instruction to store the token's metadata on chain
 * - derive the pda for the metadata account
 * - create the instruction with the actual metadata in it
 */

// derive the pda address for the Metadata account
const metadataAccount = PublicKey.findProgramAddressSync(
  [Buffer.from("metadata"), METADATA_PROGRAM_ID.toBuffer(), tokenMint.toBuffer()],
  METADATA_PROGRAM_ID,
)[0];

console.log("Metadata address:", metadataAccount.toBase58());

// Create the Metadata account for the Mint
const updateMetadataInstruction = createUpdateMetadataAccountV2Instruction(
  {
    metadata: metadataAccount,
    updateAuthority: payer.publicKey,
  },
  {
    updateMetadataAccountArgsV2: {
      data: {
        creators: null,
        name: tokenConfig.name,
        symbol: tokenConfig.symbol,
        uri: tokenConfig.uri,
        sellerFeeBasisPoints: 0,
        collection: null,
        uses: null,
      },
      isMutable: true,
      primarySaleHappened: null,
      updateAuthority: payer.publicKey,
    },
  },
);

/**
 * Build the transaction to send to the blockchain
 */

const tx = await buildTransaction({
  connection,
  payer: payer.publicKey,
  signers: [payer],
  instructions: [updateMetadataInstruction],
});

console.log("\n\n----------------------------\n");

try {
  // actually send the transaction
  const sig = await connection.sendTransaction(tx);

  // print the explorer url
  console.log("Transaction completed.");
  console.log(getExplorerLink("transaction", sig, "devnet"));

  // locally save our addresses for the demo
  // savePublicKeyToFile("tokenMint", mintKeypair.publicKey);
} catch (err) {
  console.error("Failed to send transaction:");
  // console.log(tx);

  // attempt to extract the signature from the failed transaction
  const failedSig = await extractSignatureFromFailedTransaction(connection, err);
  if (failedSig)
    console.log("Failed signature:", getExplorerLink("transaction", failedSig, "devnet"));

  throw err;
}
