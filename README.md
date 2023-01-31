# contract-tip-bot

# Quick Start

```
# install go package
- install solana:
  https://docs.solana.com/cli/install-solana-cli-tools
- install anchor:
  https://www.anchor-lang.com/docs/installation  
```

## init new project
```
anchor init `project_name`
```

## build program
```
anchor build
```


## deploy program
```
anchor deploy
```

## test with deploy program
```
anchor test
```

## test without deploy program
```
anchor test --skip-deploy
```

## config solana url rpc
```
- local host:
  solana config set --url http://localhost:8899
- devnet:
  solana config set --url https://api.devnet.solana.com
```

## airdrop
```
solana airdrop 2 (or 1)
```


