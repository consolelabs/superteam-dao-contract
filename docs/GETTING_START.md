# Getting started

- install solana:
  https://docs.solana.com/cli/install-solana-cli-tools
- install anchor:
  https://www.anchor-lang.com/docs/installation

Then, you can run locally in development mode:

```bash
anchor build
anchor test
```

## Code organization

```
.
├── app      
├── migrations                    
├── README.md                    # README file
├── Anchor.toml                  # Anchor configuration
├── programs                     # Program folder
│   └── contract                 
│       └── instructions          
│       └── schema
│       └── lib.rs
│       └── constants.rs
│       └── error.rs                     
├── tests                        # test folder
│   └── test.ts                  # test file 
│── Cargo.lock                    
├── Cargo.toml    
├── package.json               
└── tsconfig.json                # TypeScript configuration
```