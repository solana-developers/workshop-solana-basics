/**
 * Demonstrates how to mint NFTs and store their metadata on chain using the Metaplex MetadataProgram
 */

import * as dotenv from "dotenv";

import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { Metaplex, bundlrStorage, keypairIdentity } from "@metaplex-foundation/js";
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
 * define our ship's JSON metadata
 * checkout: https://nft.storage/ to help store images
 */
const metadata = {
  name: "The Gradient Pearl",
  symbol: "SHIP",
  description:
    "The Gradient Pearl is a legendary Pirate ship that sails the Seven Seas. Captain Rajovenko leads with a drink can in his hand. ",
  image:
    "https://bafybeic75qqhfytc6xxoze2lo5af2lfhmo2kh4mhirelni2wota633dgqu.ipfs.nftstorage.link/",
};
// another ship: "https://bafybeiblld2wlxyivlivnhaqbcixhzxrodjzrycjkitz3kdmzj65gebwxe.ipfs.nftstorage.link/"
// Captain Rajovenko: "https://bafybeihww4tue5pme3h2udqvkpfbzs5zf4h2pysuoowwofbbk372vvtmja.ipfs.nftstorage.link/"

/**
 * Use the Metaplex sdk to handle most NFT actions
 */

// create an instance of Metaplex sdk for use
const metaplex = Metaplex.make(connection)
  // set our keypair to use, and pay for the transaction
  .use(keypairIdentity(payer))
  // define a storage mechanism to upload with
  .use(
    bundlrStorage({
      address: "https://devnet.bundlr.network",
      providerUrl: "https://api.devnet.solana.com",
      timeout: 60000,
    }),
  );

console.log("Uploading metadata...");

// upload the JSON metadata
const { uri } = await metaplex.nfts().uploadMetadata(metadata);

console.log("Metadata uploaded:", uri);

console.log("\n\n----------------------------");
console.log("NFT details", "\n");

console.log("Creating NFT using Metaplex...");

// create a new nft using the metaplex sdk
const { nft, response } = await metaplex.nfts().create({
  uri,
  name: metadata.name,
  symbol: metadata.symbol,

  // `sellerFeeBasisPoints` is the royalty that you can define on nft
  sellerFeeBasisPoints: 500, // Represents 5.00%.

  //
  isMutable: true,
});

console.log(nft);

console.log("\n\n----------------------------");
console.log("NFT created:", "\n");
console.log(getExplorerLink("transaction", response.signature, "devnet"));

process.exit();

/**
 *
 */

console.log("\n\n----------------------------");
console.log("Find my mint:", "\n");

// you can also use the metaplex sdk to retrieve info about the NFT's mint
const mintInfo = await metaplex.nfts().findByMint({
  mintAddress: tokenMint,
});

console.log(mintInfo);
