# Deployment

## Deploy on devnet

- Changing the cluster: `solana config set --url devnet`
- Setup Anchor.toml:
     ```
      [programs.localnet]
      superteam_dao_contract = "9fHpouSqNrqBKLka9WeUXkRuh2Qt97nvqtP1Km99LKXb"
      freeze_nft_contract = "CQamCKHdgid5vgpRvuc88GQCFXvifPUYRTUmpgv3bDuG"
      [programs.devnet]
      superteam_dao_contract = "9fHpouSqNrqBKLka9WeUXkRuh2Qt97nvqtP1Km99LKXb"
      freeze_nft_contract = "CQamCKHdgid5vgpRvuc88GQCFXvifPUYRTUmpgv3bDuG"
      
      # ...
      
      [provider]
      cluster = "devnet"
      wallet = "/{your_path}/.config/solana/id.json"
     ```
- Airdropping on devnet: `solana airdop 2` (The number of sol that need to be airdropped depends on your program)
- Deploying the program
  ```
  anchor build
  anchor deploy
  ```
## References
- https://lorisleiva.com/create-a-solana-dapp-from-scratch/deploying-to-devnet