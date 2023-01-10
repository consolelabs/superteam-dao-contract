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

    let sender = anchor.web3.Keypair.generate();
    let recipient = anchor.web3.Keypair.generate();
    let identifierAccount, applicantProposal, applicantProposal1, applicantProposal2 : anchor.web3.PublicKey;
    let identifierAccount2, approverProposal, approverProposal1, approverProposal2 : anchor.web3.PublicKey;
    let bump: number;
    let mintA;
    const delay = ms => new Promise(res => setTimeout(res, ms));

    before("Boilerplates", async () => {

        await delay(1000*5);
        await airdrop(provider, sender.publicKey, airdropSolAmount)
        await delay(1000*5);
        await airdrop(provider, recipient.publicKey, airdropSolAmount)

    });

    it("[Applicant flow] initialize identifier and proposal", async () => {

        [identifierAccount] = await findPDAIdentifier(sender.publicKey, program)

        await program.methods.createIdentifier()
            .accounts({
                identifier: identifierAccount,
                sender: sender.publicKey,
                systemProgram: SystemProgram.programId,
                rent: anchor.web3.SYSVAR_RENT_PUBKEY,
            })
            .signers([sender])
            .rpc();

        let identifierData = await program.account.identifier.fetch(identifierAccount);
        console.log("[identifier account] Create result: ", identifierData);


        // Create our Token A Mint
        mintA = new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");

        [applicantProposal, bump] = await findPDAProposal(sender.publicKey, identifierData.count, program)

        await program.methods.createProposal(recipient.publicKey, "https://upload.wikimedia.org/wikipedia/en/b/b9/Solana_logo.png",
            "Orca summer Winner", "abc", mintA, "gamefi", new BN(100*(10**MINT_A_DECIMALS)), true, null)
            .accounts({
                proposal: applicantProposal,
                identifier: identifierAccount,
                sender: sender.publicKey,
                systemProgram: SystemProgram.programId,
                rent: anchor.web3.SYSVAR_RENT_PUBKEY,
            })
            .signers([sender])
            .rpc();

        const dataApplicantProposal = await program.account.proposal.fetch(applicantProposal);
        console.log("[proposal account] Create result: ", dataApplicantProposal);

        identifierData = await program.account.identifier.fetch(identifierAccount);

        [applicantProposal1, bump] = await findPDAProposal(sender.publicKey, identifierData.count, program)

        await program.methods.createProposal(recipient.publicKey, "https://upload.wikimedia.org/wikipedia/en/b/b9/Solana_logo.png",
            "Orca summer 2nd", "", mintA, "defi", new BN(100*(10**MINT_A_DECIMALS)), true, null)
            .accounts({
                proposal: applicantProposal1,
                identifier: identifierAccount,
                sender: sender.publicKey,
                systemProgram: SystemProgram.programId,
                rent: anchor.web3.SYSVAR_RENT_PUBKEY,
            })
            .signers([sender])
            .rpc();

        identifierData = await program.account.identifier.fetch(identifierAccount);

        [applicantProposal2, bump] = await findPDAProposal(sender.publicKey, identifierData.count, program)

        await program.methods.createProposal(recipient.publicKey, "https://upload.wikimedia.org/wikipedia/en/b/b9/Solana_logo.png",
            "Orca summer 3rd", "", mintA, "orca", new BN(100*(10**MINT_A_DECIMALS)), true, null)
            .accounts({
                proposal: applicantProposal2,
                identifier: identifierAccount,
                sender: sender.publicKey,
                systemProgram: SystemProgram.programId,
                rent: anchor.web3.SYSVAR_RENT_PUBKEY,
            })
            .signers([sender])
            .rpc();
    });

    it("[Applicant flow] cancel  proposal", async () => {
        const balanceBefore = await provider.connection.getBalance(sender.publicKey);
        console.log("[sender balance before close proposal]: ", balanceBefore);
        const balanceProposalAccount1 = await provider.connection.getBalance(applicantProposal1);
        console.log("[applicantProposal1 balance]: ", balanceProposalAccount1);
        await program.methods.cancelProposal()
            .accounts({
                proposal: applicantProposal1,
                sender: sender.publicKey,
                systemProgram: SystemProgram.programId,
            })
            .signers([sender])
            .rpc();

        const balanceAfter = await provider.connection.getBalance(sender.publicKey);
        console.log("[sender balance after close proposal]: ", balanceAfter);

    });

    it("[Applicant flow] reject  proposal", async () => {
        await program.methods.rejectProposal()
            .accounts({
                proposal: applicantProposal2,
                recipient: recipient.publicKey,
                systemProgram: SystemProgram.programId,
            })
            .signers([recipient])
            .rpc();

        let proposalRejectData2= await program.account.proposal.fetch(applicantProposal2);
        console.log("[applicantProposal2] Create result: ", proposalRejectData2);

    });

    it("[Applicant flow] approve  proposal", async () => {
        await program.methods.approveProposal()
            .accounts({
                proposal: applicantProposal,
                recipient: recipient.publicKey,
                systemProgram: SystemProgram.programId,
                tokenProgram: TOKEN_PROGRAM_ID,
            })
            .signers([recipient])
            .rpc();

        let proposalApproveData= await program.account.proposal.fetch(applicantProposal);
        console.log("[applicantProposal ] Create result: ", proposalApproveData);
    });

    it("[Applicant flow] applicant reject proposal", async () => {
        await delay(1000*2);
        await program.methods.applicantRejectProposal()
            .accounts({
                proposal: applicantProposal,
                applicant: sender.publicKey,
                systemProgram: SystemProgram.programId
            })
            .signers([sender])
            .rpc();

        let proposalApproveData= await program.account.proposal.fetch(applicantProposal);
        console.log("[applicantProposal ] Create result: ", proposalApproveData);
    });

    it("[Applicant flow] approver fill transaction hash", async () => {
        let trasactionHash = "32YZicRkcGKZ46ZPcW3FQ92nG5LDAgkuL1qYExL5HkF9MsKfGPhwXoCvvtQ1oCJ5yqeZCekjutcCZyeAoFhMRXQV"
        await program.methods.fillTransactionHash(trasactionHash)
            .accounts({
                proposal: applicantProposal,
                signer: recipient.publicKey,
                systemProgram: SystemProgram.programId
            })
            .signers([recipient])
            .rpc();

        let proposalApproveData= await program.account.proposal.fetch(applicantProposal);
        console.log("[applicantProposal ] Create result: ", proposalApproveData);
    });

    it("[Applicant flow] applicant approve proposal", async () => {
        await program.methods.applicantConfirmProposal()
            .accounts({
                proposal: applicantProposal,
                applicant: sender.publicKey,
                systemProgram: SystemProgram.programId
            })
            .signers([sender])
            .rpc();

        let proposalApproveData= await program.account.proposal.fetch(applicantProposal);
        console.log("[applicantProposal ] Create result: ", proposalApproveData);
    });

    it("[Applicant flow] close reject  proposal", async () => {

        const balanceBefore = await provider.connection.getBalance(sender.publicKey);
        console.log("[sender balance before close proposal]: ", balanceBefore);
        const balanceProposalAccount2 = await provider.connection.getBalance(applicantProposal2);
        console.log("[proposalAccount 2 balance]: ", balanceProposalAccount2);

        await program.methods.closeProposal()
            .accounts({
                proposal: applicantProposal2,
                sender: sender.publicKey,
                systemProgram: SystemProgram.programId,
            })
            .signers([sender])
            .rpc();


        const balanceAfter = await provider.connection.getBalance(sender.publicKey);
        console.log("[sender balance after close proposal]: ", balanceAfter);

    });

    it("[Approver flow] initialize identifier and proposal", async () => {

        [identifierAccount2] = await findPDAIdentifier(recipient.publicKey, program)

        await program.methods.createIdentifier()
            .accounts({
                identifier: identifierAccount2,
                sender: recipient.publicKey,
                systemProgram: SystemProgram.programId,
                rent: anchor.web3.SYSVAR_RENT_PUBKEY,
            })
            .signers([recipient])
            .rpc();

        let identifierData2 = await program.account.identifier.fetch(identifierAccount2);
        console.log("[identifier account] Create result: ", identifierData2);


        // Create our Token A Mint
        mintA = new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");

        [approverProposal, bump] = await findPDAProposal(recipient.publicKey, identifierData2.count, program)

        await program.methods.createProposal(sender.publicKey, "https://upload.wikimedia.org/wikipedia/en/b/b9/Solana_logo.png",
            "Global Winner", "abc", mintA, "defi", new BN(100*(10**MINT_A_DECIMALS)), false, null)
            .accounts({
                proposal: approverProposal,
                identifier: identifierAccount2,
                sender: recipient.publicKey,
                systemProgram: SystemProgram.programId,
                rent: anchor.web3.SYSVAR_RENT_PUBKEY,
            })
            .signers([recipient])
            .rpc();

        const dataApproverProposal = await program.account.proposal.fetch(approverProposal);
        console.log("[proposal account] Create result: ", dataApproverProposal);

        identifierData2 = await program.account.identifier.fetch(identifierAccount2);

        [approverProposal1, bump] = await findPDAProposal(recipient.publicKey, identifierData2.count, program)

        await program.methods.createProposal(sender.publicKey, "https://upload.wikimedia.org/wikipedia/en/b/b9/Solana_logo.png",
            "Global 2nd", "", mintA, "gamefi", new BN(100*(10**MINT_A_DECIMALS)), false, "32YZicRkcGKZ46ZPcW3FQ92nG5LDAgkuL1qYExL5HkF9MsKfGPhwXoCvvtQ1oCJ5yqeZCekjutcCZyeAoFhMRXQV")
            .accounts({
                proposal: approverProposal1,
                identifier: identifierAccount2,
                sender: recipient.publicKey,
                systemProgram: SystemProgram.programId,
                rent: anchor.web3.SYSVAR_RENT_PUBKEY,
            })
            .signers([recipient])
            .rpc();

        identifierData2 = await program.account.identifier.fetch(identifierAccount2);

        [approverProposal2, bump] = await findPDAProposal(recipient.publicKey, identifierData2.count, program)

        await program.methods.createProposal(recipient.publicKey, "https://upload.wikimedia.org/wikipedia/en/b/b9/Solana_logo.png",
            "Global 3rd", "", mintA, "payment", new BN(100*(10**MINT_A_DECIMALS)), false, null)
            .accounts({
                proposal: approverProposal2,
                identifier: identifierAccount2,
                sender: recipient.publicKey,
                systemProgram: SystemProgram.programId,
                rent: anchor.web3.SYSVAR_RENT_PUBKEY,
            })
            .signers([recipient])
            .rpc();
    });

    it("[Approver flow] approve proposal and confirm proposal", async () => {
        await program.methods.approveProposal()
            .accounts({
                proposal: approverProposal1,
                recipient: sender.publicKey,
                systemProgram: SystemProgram.programId,
                tokenProgram: TOKEN_PROGRAM_ID,
            })
            .signers([sender])
            .rpc();

        let proposalApproveAndConfirmData= await program.account.proposal.fetch(approverProposal1);
        console.log("[approver proposal ] Create result: ", proposalApproveAndConfirmData);
    });

    // it("filter proposal by sender ", async () => {
    //     const connection = new Connection(clusterApiUrl('devnet'))
    //     let programId = new PublicKey("2kAE3hehkVtyjfwBE9mMYgzMMD4uH6s6GLVwzuK179pV");
    //     let sender = new PublicKey("3MdFxxJwwPUytxbLRBiNqmVHVwvG9t8qZs5Wo3SLRZVt");
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
    //
    // it("filter proposal by recipient ", async () => {
    //     let recipient = new PublicKey("AdjN2jSx9J6JekavLzmHuZxUMv1YuMqtkNsDYuRB82nG");
    //     const proposalBySender = await program.account.proposal.all([
    //         {
    //             memcmp: {
    //                 offset: 8, // Discriminator.
    //                 bytes: recipient.toBase58(),
    //             }
    //         }
    //     ]);
    //
    //     console.log(proposalBySender);
    //
    // });

});
