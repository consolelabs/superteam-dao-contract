export type SuperteamDaoContract = {
  "version": "0.1.0",
  "name": "superteam_dao_contract",
  "instructions": [
    {
      "name": "createIdentifier",
      "accounts": [
        {
          "name": "identifier",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "sender",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "createProposal",
      "accounts": [
        {
          "name": "proposal",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "identifier",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "sender",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "recipient",
          "type": "publicKey"
        },
        {
          "name": "image",
          "type": "string"
        },
        {
          "name": "title",
          "type": "string"
        },
        {
          "name": "subtitle",
          "type": "string"
        },
        {
          "name": "spl",
          "type": "publicKey"
        },
        {
          "name": "tags",
          "type": "string"
        },
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "isOwner",
          "type": "bool"
        }
      ]
    },
    {
      "name": "cancelProposal",
      "accounts": [
        {
          "name": "proposal",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "sender",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "rejectProposal",
      "accounts": [
        {
          "name": "proposal",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "recipient",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "approveProposal",
      "accounts": [
        {
          "name": "proposal",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "recipient",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "transactionHash",
          "type": {
            "option": "string"
          }
        }
      ]
    },
    {
      "name": "closeProposal",
      "accounts": [
        {
          "name": "proposal",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "sender",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "identifier",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "sender",
            "type": "publicKey"
          },
          {
            "name": "count",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "proposal",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "recipient",
            "type": "publicKey"
          },
          {
            "name": "sender",
            "type": "publicKey"
          },
          {
            "name": "status",
            "type": "u8"
          },
          {
            "name": "owner",
            "type": "bool"
          },
          {
            "name": "spl",
            "type": "publicKey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "tags",
            "type": "string"
          },
          {
            "name": "transaction",
            "type": {
              "option": "string"
            }
          },
          {
            "name": "image",
            "type": "string"
          },
          {
            "name": "title",
            "type": "string"
          },
          {
            "name": "subtitle",
            "type": "string"
          },
          {
            "name": "identifier",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "SenderInvalidStateAccount",
      "msg": "Invalid sender"
    },
    {
      "code": 6001,
      "name": "RecipientInvalidStateAccount",
      "msg": "Invalid recipient"
    },
    {
      "code": 6002,
      "name": "NotEnoughLamport",
      "msg": "Not enough lamport"
    },
    {
      "code": 6003,
      "name": "NotEnoughSplToken",
      "msg": "Not enough spl token"
    },
    {
      "code": 6004,
      "name": "OwnerInvalidTokenAccount",
      "msg": "Invalid owner associated token account"
    },
    {
      "code": 6005,
      "name": "StatusPendingInvalid",
      "msg": "proposal is not pending"
    },
    {
      "code": 6006,
      "name": "OwnerInvalidAccount",
      "msg": "Invalid owner account"
    },
    {
      "code": 6007,
      "name": "InvalidAccount",
      "msg": "Account is invalid"
    },
    {
      "code": 6008,
      "name": "InvalidMintAccount",
      "msg": "Mint Account is invalid"
    },
    {
      "code": 6009,
      "name": "TagsTooLong",
      "msg": "The provided tags should be 256 characters long maximum."
    },
    {
      "code": 6010,
      "name": "TitleTooLong",
      "msg": "The provided content should be 256 characters long maximum."
    },
    {
      "code": 6011,
      "name": "SubtitleTooLong",
      "msg": "The provided subtitle should be 256 characters long maximum."
    },
    {
      "code": 6012,
      "name": "ImageTooLong",
      "msg": "The provided image should be 256 characters long maximum."
    }
  ]
};

export const IDL: SuperteamDaoContract = {
  "version": "0.1.0",
  "name": "superteam_dao_contract",
  "instructions": [
    {
      "name": "createIdentifier",
      "accounts": [
        {
          "name": "identifier",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "sender",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "createProposal",
      "accounts": [
        {
          "name": "proposal",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "identifier",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "sender",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "recipient",
          "type": "publicKey"
        },
        {
          "name": "image",
          "type": "string"
        },
        {
          "name": "title",
          "type": "string"
        },
        {
          "name": "subtitle",
          "type": "string"
        },
        {
          "name": "spl",
          "type": "publicKey"
        },
        {
          "name": "tags",
          "type": "string"
        },
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "isOwner",
          "type": "bool"
        }
      ]
    },
    {
      "name": "cancelProposal",
      "accounts": [
        {
          "name": "proposal",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "sender",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "rejectProposal",
      "accounts": [
        {
          "name": "proposal",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "recipient",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "approveProposal",
      "accounts": [
        {
          "name": "proposal",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "recipient",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "transactionHash",
          "type": {
            "option": "string"
          }
        }
      ]
    },
    {
      "name": "closeProposal",
      "accounts": [
        {
          "name": "proposal",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "sender",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "identifier",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "sender",
            "type": "publicKey"
          },
          {
            "name": "count",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "proposal",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "recipient",
            "type": "publicKey"
          },
          {
            "name": "sender",
            "type": "publicKey"
          },
          {
            "name": "status",
            "type": "u8"
          },
          {
            "name": "owner",
            "type": "bool"
          },
          {
            "name": "spl",
            "type": "publicKey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "tags",
            "type": "string"
          },
          {
            "name": "transaction",
            "type": {
              "option": "string"
            }
          },
          {
            "name": "image",
            "type": "string"
          },
          {
            "name": "title",
            "type": "string"
          },
          {
            "name": "subtitle",
            "type": "string"
          },
          {
            "name": "identifier",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "SenderInvalidStateAccount",
      "msg": "Invalid sender"
    },
    {
      "code": 6001,
      "name": "RecipientInvalidStateAccount",
      "msg": "Invalid recipient"
    },
    {
      "code": 6002,
      "name": "NotEnoughLamport",
      "msg": "Not enough lamport"
    },
    {
      "code": 6003,
      "name": "NotEnoughSplToken",
      "msg": "Not enough spl token"
    },
    {
      "code": 6004,
      "name": "OwnerInvalidTokenAccount",
      "msg": "Invalid owner associated token account"
    },
    {
      "code": 6005,
      "name": "StatusPendingInvalid",
      "msg": "proposal is not pending"
    },
    {
      "code": 6006,
      "name": "OwnerInvalidAccount",
      "msg": "Invalid owner account"
    },
    {
      "code": 6007,
      "name": "InvalidAccount",
      "msg": "Account is invalid"
    },
    {
      "code": 6008,
      "name": "InvalidMintAccount",
      "msg": "Mint Account is invalid"
    },
    {
      "code": 6009,
      "name": "TagsTooLong",
      "msg": "The provided tags should be 256 characters long maximum."
    },
    {
      "code": 6010,
      "name": "TitleTooLong",
      "msg": "The provided content should be 256 characters long maximum."
    },
    {
      "code": 6011,
      "name": "SubtitleTooLong",
      "msg": "The provided subtitle should be 256 characters long maximum."
    },
    {
      "code": 6012,
      "name": "ImageTooLong",
      "msg": "The provided image should be 256 characters long maximum."
    }
  ]
};