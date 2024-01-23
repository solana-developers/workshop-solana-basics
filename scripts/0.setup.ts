/**
 * Stored some reusable keypairs in this repo's `.env` file for use with the other scripts
 */

import { Keypair } from "@solana/web3.js";
import { getKeypairFromFile, addKeypairToEnvFile } from "@solana-developers/helpers";

let payer: Keypair;

try {
  // attempt the load the default Solana CLI keypair into the .env file
  payer = await getKeypairFromFile("~/.config/solana/id.json");
  console.log("Loaded `payer` keypair from the file system");
} catch (err) {
  // fallback to generating a new one
  payer = Keypair.generate();
  console.log("Generated a new, random `payer` keypair");
}

console.log("Payer address:", payer.publicKey.toBase58(), "\n");

await addKeypairToEnvFile(payer, "PAYER_KEYPAIR");

const testWallet = Keypair.generate();

console.log("Test wallet:", testWallet.publicKey.toBase58(), "\n");

await addKeypairToEnvFile(testWallet, "TEST_KEYPAIR");
