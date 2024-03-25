# Solana Workshop: Solana Basics

## Quick links to learn more

- https://solana.com/developers
- https://solana.com/developers/guides
- Slides from the workshop:
  [Google Slides](https://docs.google.com/presentation/d/1BpObg9lOMllUxdcHJQ5EpJGVGGiNmwcS1QUysbs91y0/edit?usp=sharing)

## Tech stack used

- uses TypeScript and NodeJS
- `npm` (as the package manager)

## Setup locally

1. Clone this repo to your local system
2. Install the packages via `npm install`

## Recommended flow to explore this repo

After getting setup locally, we recommend exploring the code of the following files (in order):

- [`0.basics.ts`](./scripts/0.basics.ts)
- [`1.simpleTransaction.ts`](./scripts/1.simpleTransaction.ts)
- [`2.complexTransaction.ts`](./scripts/2.complexTransaction.ts)

### Running the included Scripts

Once setup locally, you will be able to run the scripts included within this repo:

```shell
npx esrun ./scripts/<script>
```

#### `0.basics.ts`

A brief introduction to the Solana web3.js package. Demonstrating and explaining the commonly used
portions of web3.js, including:

- connections
- keypairs
- getting an account's SOL balance
- reading data from the blockchain
- account storage `space` and `rent`
- recent blockhash

#### `1.simpleTransaction.ts`

Demonstrating how to build and send simple transactions to the blockchain using web3js. Including:

- connecting to the blockchain
- generating a new keypair
- constructing a simple instruction
- building and signing a transaction
- sending and confirming that transaction

#### `2.complexTransaction.ts`

An introduction to more complex transactions using Solana web3.js. Demonstrates how to build a more
complex transaction, with multiple instructions.

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
