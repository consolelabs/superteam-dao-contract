# Superteam Dao Dapp

Superteam dao contract is a Bounty log proof of work onchain.

| Program                                                    | Devnet | Mainnet Beta |
|------------------------------------------------------------|--------|------------- |
| [superteam-dao-contract](/programs/superteam-dao-contract) | `9fHpouSqNrqBKLka9WeUXkRuh2Qt97nvqtP1Km99LKXb` | coming soon |
| [freeze-nft-contract](/programs/freeze-nft-contract)       | `7V56BshogTppQUSshpoFcwvyc8hfMtbCwoTWVKBoFokC` | coming soon |

## Installation

Require `node`, `yarn`, `anchor`, `rust` and `solana` installed.

```sh
# Compile the Solana program (smart contract)
anchor build

anchor test
```

### Develop

```sh
# In 2 terminal panes;
# 1. Start the Solana blockchain locally
solana-test-validator
# 2. Get logs
solana logs
```


### Project structure

- app - Where our frontend code will go
- programs - This is where the Rust code lives for the Solana program
- test - Where the JavaScript tests for the program live
- migrations - A basic deploy script

### Documents
- [Getting started](/docs/GETTING_START.md)
- [Tech ecosystem](/docs/TECH_ECOSYSTEM.md)
- [Writing tests](/docs/WRITING_TEST.md)
- [Editor](/docs/EDITOR.md)
- [Deployment](/docs/DEPLOYMENT.md)
