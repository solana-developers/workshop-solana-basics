import fs from "fs";
import {
  Connection,
  Keypair,
  PublicKey,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import { getExplorerLink } from "@solana-developers/helpers";

// define some default locations
export const DEFAULT_KEY_DIR_NAME = ".local_keys";
export const DEFAULT_PUBLIC_KEY_FILE = "keys.json";
export const DEFAULT_DEMO_DATA_FILE = "demo.json";

export const DEFAULT_CLI_KEYPAIR_PATH = "~/.config/solana/id.json";
export const KEYPAIR_PAYER_ENV_NAME = "PAYER_KEYPAIR";
export const KEYPAIR_TESTER_ENV_NAME = "TESTER_KEYPAIR";

/**
 * Load locally stored PublicKey addresses
 */
export function loadPublicKeysFromFile(
  absPath: string = `${DEFAULT_KEY_DIR_NAME}/${DEFAULT_PUBLIC_KEY_FILE}`,
) {
  try {
    if (!absPath) throw Error("No path provided");
    if (!fs.existsSync(absPath)) throw Error("File does not exist.");

    // load the public keys from the file
    const data = JSON.parse(fs.readFileSync(absPath, { encoding: "utf-8" })) || {};

    // convert all loaded keyed values into valid public keys
    for (const [key, value] of Object.entries(data)) {
      data[key] = new PublicKey(value as string) ?? "";
    }

    return data;
  } catch (err) {
    // console.warn("Unable to load local file");
  }
  // always return an object
  return {};
}

/*
  Locally save a PublicKey addresses to the filesystem for later retrieval
*/
export function savePublicKeyToFile(
  name: string,
  publicKey: PublicKey,
  absPath: string = `${DEFAULT_KEY_DIR_NAME}/${DEFAULT_PUBLIC_KEY_FILE}`,
) {
  try {
    // if (!absPath) throw Error("No path provided");
    // if (!fs.existsSync(absPath)) throw Error("File does not exist.");

    // fetch all the current values
    let data: any = loadPublicKeysFromFile(absPath);

    // convert all loaded keyed values from PublicKeys to strings
    for (const [key, value] of Object.entries(data)) {
      data[key as any] = (value as PublicKey).toBase58();
    }
    data = { ...data, [name]: publicKey.toBase58() };

    // actually save the data to the file
    fs.writeFileSync(absPath, JSON.stringify(data), {
      encoding: "utf-8",
    });

    // reload the keys for sanity
    data = loadPublicKeysFromFile(absPath);

    return data;
  } catch (err) {
    console.warn("Unable to save to file");
  }
  // always return an object
  return {};
}

/*
  Helper function to extract a transaction signature from a failed transaction's error message
*/
export async function extractSignatureFromFailedTransaction(
  connection: Connection,
  err: any,
  fetchLogs?: boolean,
) {
  if (err?.signature) return err.signature;

  // extract the failed transaction's signature
  const failedSig = new RegExp(/^((.*)?Error: )?(Transaction|Signature) ([A-Z0-9]{32,}) /gim).exec(
    err?.message?.toString(),
  )?.[4];

  // ensure a signature was found
  if (failedSig) {
    // when desired, attempt to fetch the program logs from the cluster
    if (fetchLogs)
      await connection
        .getTransaction(failedSig, {
          maxSupportedTransactionVersion: 0,
        })
        .then(tx => {
          console.log(`\n==== Transaction logs for ${failedSig} ====`);
          console.log(getExplorerLink("transaction", failedSig, "devnet"));
          console.log(tx?.meta?.logMessages ?? "No log messages provided by RPC");
          console.log(`==== END LOGS ====\n`);
        });
    else {
      console.log("\n========================================");
      console.log({ txSignature: failedSig });
      console.log("========================================\n");
    }
  }

  // always return the failed signature value
  return failedSig;
}

/*
  Standard number formatter
*/
export function numberFormatter(num: number, forceDecimals = false) {
  // set the significant figures
  const minimumFractionDigits = num < 1 || forceDecimals ? 10 : 2;

  // do the formatting
  return new Intl.NumberFormat(undefined, {
    minimumFractionDigits,
  }).format(num);
}

/**
 * Helper function to build a signed transaction
 */
export async function buildTransaction({
  connection,
  payer,
  signers,
  instructions,
}: {
  connection: Connection;
  payer: PublicKey;
  signers: Keypair[];
  instructions: TransactionInstruction[];
}): Promise<VersionedTransaction> {
  let blockhash = await connection.getLatestBlockhash().then(res => res.blockhash);

  const messageV0 = new TransactionMessage({
    payerKey: payer,
    recentBlockhash: blockhash,
    instructions,
  }).compileToV0Message();

  const tx = new VersionedTransaction(messageV0);

  signers.forEach(s => tx.sign([s]));

  return tx;
}
