# Solana Basics Crash Course

## Quick links to learn more

- https://solana.com/developers
- https://solana.com/developers/guides
- Slides from the workshop:
  [Google Slides](https://docs.google.com/presentation/d/1BpObg9lOMllUxdcHJQ5EpJGVGGiNmwcS1QUysbs91y0/edit?usp=sharing)

## Tech stack used

- uses TypeScript and NodeJS
- yarn (as the package manager)

## Setup locally

1. Clone this repo to your local system
2. Install the packages via `yarn install`

## Recommended flow to explore this repo

After getting setup locally, we recommend exploring the code of the following files (in order):

- [`1.simpleTransaction.ts`](./scripts/1.simpleTransaction.ts)
- [`2.complexTransaction.ts`](./scripts/2.complexTransaction.ts)
- [`3.createTokenWithMetadata.ts`](./scripts/3.createTokenWithMetadata.ts)
- [`4.mintTokens.ts`](./scripts/4.mintTokens.ts)
- [`5.updateMetadata.ts`](./scripts/5.updateMetadata.ts)
- [`6.createNFTs.ts`](./scripts/6.createNFTs.ts)

After reviewing the code in each of these scripts, try running each in order.

> **Note:** Running each of these scripts may save some various bits of data to a `.local_keys`
> folder within this repo for use by the other scripts later in this ordered list. Therefore,
> running them in a different order may result in them not working as written/desired. You have been
> warned :)

### Running the included Scripts

Once setup locally, you will be able to run the scripts included within this repo:

```
npx esrun ./scripts/<script>
```

#### `1.simpleTransaction.ts`

A brief introduction to the Solana web3.js package. Demonstrating how to build and send simple
transactions to the blockchain

#### `2.complexTransaction.ts`

An introduction to more complex transactions using Solana web3.js Demonstrates how to build a more
complex transaction, with multiple instructions.

#### `3.createTokenWithMetadata.ts`

Demonstrates how to create a SPL token and store it's metadata on chain (using the Metaplex MetaData
program)

#### `4.mintTokens.ts`

Demonstrates how to create new SPL tokens (aka "minting tokens") into an existing SPL Token Mint

#### `5.updateMetadata.ts`

Demonstrates how to update the metadata for an SPL token, using the Metaplex MetadataProgram

#### `6.createNFTs.ts`

Demonstrates how to mint NFTs and store their metadata on chain using the Metaplex MetadataProgram

## Resources

Checkout this
[comprehensive guide to setting up your local environment](https://solana.com/developers/guides/getstarted/setup-local-development).
The following resources my also be helpful:

- Installing NodeJS:
  - https://www.linode.com/docs/guides/how-to-install-use-node-version-manager-nvm/
  - https://www.freecodecamp.org/news/node-version-manager-nvm-install-guide/
  - https://collabnix.com/how-to-install-and-configure-nvm-on-mac-os/
  - https://adamtheautomator.com/install-nvm-on-windows/
  - https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable
- Installing Rust:
  - https://www.rust-lang.org/tools/install
  - https://solanacookbook.com/getting-started/installation.html
  - https://learn.microsoft.com/en-us/windows/dev-environment/rust/setup
- Installing the Solana CLI:
  - https://solanacookbook.com/getting-started/installation.html
  - https://docs.solana.com/cli/install-solana-cli-tools
  - https://mammothinteractive.com/how-to-install-solana-on-windows/
- Generating Keypairs:
  - https://docs.metaplex.com/guides/cli-wallet
  - https://solanacookbook.com/references/keypairs-and-wallets.html#how-to-generate-a-new-keypair
  - https://docs.solana.com/cli/conventions#keypair-conventions
  - https://stackoverflow.com/questions/69109345/how-to-use-keys-from-solana-keygen-to-use-a-web-wallet
- General Solana Resources:
  - Docs & How-To's:
    - https://solana.com/docs/
    - https://solana.com/developers/guides/
    - https://solanacookbook.com/
    - https://solana.stackexchange.com/
  - Blockchain Explorer Tools:
    - https://explorer.solana.com/
    - https://solana.fm/
  - Popular Libraries:
    - Rust:
      - https://docs.rs/solana-program/1.15.2/solana_program/
      - https://docs.rs/spl-token/3.5.0/spl_token/
      - https://docs.rs/spl-associated-token-account/1.1.3/spl_associated_token_account/
      - https://docs.rs/mpl-token-metadata/1.11.0/mpl_token_metadata/
      - https://docs.rs/anchor-lang/0.27.0/anchor_lang/
      - https://docs.rs/anchor-spl/0.27.0/anchor_spl/
    - JavaScript:
      - https://www.npmjs.com/package/@solana/web3.js
      - https://www.npmjs.com/package/@solana/spl-token
      - https://www.npmjs.com/package/@metaplex-foundation/mpl-token-metadata
      - https://www.npmjs.com/package/@metaplex-foundation/js
      - https://www.npmjs.com/package/@coral-xyz/anchor
    - Python:
      - https://seahorse-lang.org/
      - https://michaelhly.github.io/solana-py/
      - https://github.com/kevinheavey/anchorpy
