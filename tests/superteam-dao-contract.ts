import * as anchor from "@project-serum/anchor";
import { SuperteamDaoContract } from "../target/types/superteam_dao_contract";
import {airdrop} from "./helper/airdrop";
import { Program, AnchorProvider, BN, Wallet } from '@project-serum/anchor';
import { Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import * as bs58 from "bs58";
import {
    Connection,
    clusterApiUrl,
    Keypair,
    LAMPORTS_PER_SOL,
    BlockTimestamp,
    SystemProgram,
    PublicKey
} from "@solana/web3.js";
import {findPDAIdentifier, findPDAProposal, getPage} from "./helper/setup";
import * as constants from "./constants";
import {getTokenBalance, mintTokenAToUser} from "./helper/helper";
import {MINT_A_AMOUNT, MINT_A_DECIMALS} from "./constants";


const provider = AnchorProvider.env()
anchor.setProvider(provider);

describe("superteam-dao-contract", () => {
    const program = anchor.workspace.SuperteamDaoContract as Program<SuperteamDaoContract>;

    const airdropSolAmount = 2;

    let payer = anchor.web3.Keypair.generate();
    let sender = anchor.web3.Keypair.generate();
    let receiver = anchor.web3.Keypair.generate();
    let  applicantProposal, applicantProposal1, applicantProposal2 : anchor.web3.PublicKey;
    let txn, txn1, txn2: String;
    let bump: number;
    let mintA;
    const delay = ms => new Promise(res => setTimeout(res, ms));

    before("Boilerplates", async () => {
        let secondDelay = 5;
        await delay(1000*secondDelay);
        await airdrop(provider, sender.publicKey, airdropSolAmount)
        await delay(1000*secondDelay);
        await airdrop(provider, payer.publicKey, airdropSolAmount)
        await delay(1000*secondDelay);
        await airdrop(provider, receiver.publicKey, airdropSolAmount)

    });

    it("[Applicant flow] initialize identifier and proposal", async () => {
        txn = "3danKMRy4oyf4mD7Sun3FtnHxQGsHyxJwxBzHN1CWzaRdK6vjwEUH6gv5yNN2Cp6SPnUxwSHYbuimkNyX2zm24bZ";
        txn1 = "65K56thKZjgD5VNwq4g2HYQYWz2qvTkoy2YXb5zssbHZm6RvPFDrP26xiFMKyLRV1dDv6mR44DENeDfL771QXZJK";
        txn2 = "2XZ7GSVsEiMW14DxUQc2fLU3doU7NpJgshJVWELc5VNPsfqtZ89yxzoennbzYEuJPLXoafvDjCfyx3giC2J6iSsL";

        // Create our Token A Mint
        mintA = new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");

        [applicantProposal, bump] = await findPDAProposal(txn.substring(0, 32), txn.substring(32, 64), txn.substring(64, 88), sender.publicKey, receiver.publicKey, program)

        await program.methods.createProposal(txn.substring(0, 32), txn.substring(32, 64), txn.substring(64, 88), sender.publicKey, receiver.publicKey, "https://upload.wikimedia.org/wikipedia/en/b/b9/Solana_logo.png",
            "Orca summer Winner", "The analogies and problems used in these experiments were not specific to any domain of expertise and used fantasy problems relying only on linguistic descriptions, The semantic descriptions of the devices were varied, but the pictures were identical for both conditions, The following descriptions focus on the local purge in each town and the points at which the local and legal purges diverged.", mintA, "gamefi", new BN(100*(10**MINT_A_DECIMALS)))
            .accounts({
                proposal: applicantProposal,
                payer: payer.publicKey,
                systemProgram: SystemProgram.programId,
                rent: anchor.web3.SYSVAR_RENT_PUBKEY,
            })
            .signers([payer])
            .rpc();

        const dataApplicantProposal = await program.account.proposal.fetch(applicantProposal);
        console.log("[proposal account] Create result: ", dataApplicantProposal);


        [applicantProposal1, bump] = await findPDAProposal(txn1.substring(0, 32), txn1.substring(32, 64), txn1.substring(64, 88), sender.publicKey, receiver.publicKey, program)

        await program.methods.createProposal(txn1.substring(0, 32), txn1.substring(32, 64), txn1.substring(64, 88), sender.publicKey, receiver.publicKey,  "https://upload.wikimedia.org/wikipedia/en/b/b9/Solana_logo.png",
            "Orca summer 2nd", "", mintA, "defi", new BN(100*(10**MINT_A_DECIMALS)))
            .accounts({
                proposal: applicantProposal1,
                payer: payer.publicKey,
                systemProgram: SystemProgram.programId,
                rent: anchor.web3.SYSVAR_RENT_PUBKEY,
            })
            .signers([payer])
            .rpc();

        [applicantProposal2, bump] = await findPDAProposal(txn2.substring(0, 32), txn2.substring(32, 64), txn2.substring(64, 88), sender.publicKey, receiver.publicKey, program)

        await program.methods.createProposal(txn2.substring(0, 32), txn2.substring(32, 64), txn2.substring(64, 88), sender.publicKey, receiver.publicKey,  "https://upload.wikimedia.org/wikipedia/en/b/b9/Solana_logo.png",
            "Solcan summer 3rd", "", mintA, "gamefi", new BN(100*(10**MINT_A_DECIMALS)))
            .accounts({
                proposal: applicantProposal2,
                payer: payer.publicKey,
                systemProgram: SystemProgram.programId,
                rent: anchor.web3.SYSVAR_RENT_PUBKEY,
            })
            .signers([payer])
            .rpc();

    });

    it("[sender] approve  proposal", async () => {
        await program.methods.senderApproveProposal()
            .accounts({
                proposal: applicantProposal,
                sender: sender.publicKey,
                systemProgram: SystemProgram.programId,
            })
            .signers([sender])
            .rpc();

        const dataApplicantProposal = await program.account.proposal.fetch(applicantProposal);
        console.log("[proposal account] sender approve : ", dataApplicantProposal);
    });

    it("[submitter] cancel  proposal", async () => {
        const balanceBefore = await provider.connection.getBalance(payer.publicKey);
        console.log("[payer balance before close proposal]: ", balanceBefore);
        const balanceProposalAccount2 = await provider.connection.getBalance(applicantProposal2);
        console.log("[applicantProposal2 balance]: ", balanceProposalAccount2);
        await program.methods.cancelProposal()
            .accounts({
                proposal: applicantProposal2,
                payer: payer.publicKey,
                systemProgram: SystemProgram.programId,
            })
            .signers([payer])
            .rpc();
        const balanceAfter = await provider.connection.getBalance(payer.publicKey);
        console.log("[payer balance after close proposal]: ", balanceAfter);
    });

    it("[sender] reject  proposal", async () => {
        await program.methods.senderRejectProposal()
            .accounts({
                proposal: applicantProposal1,
                sender: sender.publicKey,
                systemProgram: SystemProgram.programId,
            })
            .signers([sender])
            .rpc();

        const dataApplicantProposal1 = await program.account.proposal.fetch(applicantProposal1);
        console.log("[proposal account] sender approve : ", dataApplicantProposal1);
    });

    it("[submitter] close  proposal", async () => {
        const balanceBefore = await provider.connection.getBalance(payer.publicKey);
        console.log("[payer balance before close proposal]: ", balanceBefore);
        const balanceProposalAccount1 = await provider.connection.getBalance(applicantProposal1);
        console.log("[applicantProposal1 balance]: ", balanceProposalAccount1);
        await program.methods.cancelProposal()
        await program.methods.closeProposal()
            .accounts({
                proposal: applicantProposal1,
                submitter: payer.publicKey,
                payer: receiver.publicKey,
                systemProgram: SystemProgram.programId,
            })
            .signers([receiver])
            .rpc();
        const balanceAfter = await provider.connection.getBalance(payer.publicKey);
        console.log("[payer balance after close proposal]: ", balanceAfter);
    });

    // it("filter proposal by sender ", async () => {
    //     const connection = new Connection(clusterApiUrl('devnet'))
    //     let programId = new PublicKey("2kAE3hehkVtyjfwBE9mMYgzMMD4uH6s6GLVwzuK179pV");
    //     let sender = new PublicKey("DbkRkU7N21CHaPPBHvDhCpt3DpHjSqesiQFY84ebGneL");
    //     const proposalsBySender = await connection.getProgramAccounts(programId, {
    //         filters: [
    //             { memcmp: { offset: 40, bytes: sender.toBase58() } }, // Ensure it's a CandyMachine account.
    //         ],
    //     });
    //     const accountPublicKeys = proposalsBySender.map(account => account.pubkey)
    //     const perPage = 6
    //     const page1 = await getPage(1, perPage, accountPublicKeys, program)
    //     console.log(page1)
    //
    // });

    it("get proposal by transaction, sender, receiver ", async () => {
        let transaction = "3danKMRy4oyf4mD7Sun3FtnHxQGsHyxJwxBzHN1CWzaRdK6vjwEUH6gv5yNN2Cp6SPnUxwSHYbuimkNyX2zm24bZ"
        const proposalBySender = await program.account.proposal.all([
            {
                memcmp: {
                    offset: 8, // Discriminator.
                    bytes: receiver.publicKey.toBase58(),
                },
            },
            {
                memcmp: {
                    offset: 40, // Discriminator.
                    bytes: sender.publicKey.toBase58(),
                },
            },
            {
                memcmp: {
                    offset: 118, // Discriminator.
                    bytes: bs58.encode(Buffer.from(transaction)),
                },
            }
        ]);

        console.log(proposalBySender);

    });

    it("get proposal by receiver ", async () => {
        const proposal = await program.account.proposal.all([
            {
                memcmp: {
                    offset: 8, // Discriminator.
                    bytes: receiver.publicKey.toBase58(),
                },
            },
        ]);

        console.log(proposal);

    });

    it("get proposal by sender ", async () => {
        const proposal = await program.account.proposal.all([
            {
                memcmp: {
                    offset: 40, // Discriminator.
                    bytes: sender.publicKey.toBase58(),
                },
            },
        ]);

        console.log(proposal);

    });

    it("get proposal by submitter ", async () => {
        const proposal = await program.account.proposal.all([
            {
                memcmp: {
                    offset: 72, // Discriminator.
                    bytes: payer.publicKey.toBase58(),
                },
            },
        ]);

        console.log(proposal);

    });

    // it("check proposal is exist", async () => {
    //     let key = new PublicKey("B9zsa2U1qgYMnsxAr6dm96hJkiGHcxxcnZTNTwmTVJGN")
    //     const proposal = await program.account.proposal.fetch(key)
    //     console.log(proposal)
    // })


});
