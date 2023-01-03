import * as anchor from "@project-serum/anchor";
import { SuperteamDaoContract } from "../target/types/superteam_dao_contract";
import {airdrop} from "./helper/airdrop";
import { Program, AnchorProvider, BN, Wallet } from '@project-serum/anchor';
import { Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import * as bs58 from "bs58";
import {
    Connection,
    Keypair,
    LAMPORTS_PER_SOL,
    BlockTimestamp,
    SystemProgram,
    PublicKey
} from "@solana/web3.js";
import {findPDAIdentifier, findPDAProposal} from "./helper/setup";
import * as constants from "./constants";
import {getTokenBalance, mintTokenAToUser} from "./helper/helper";
import {MINT_A_AMOUNT, MINT_A_DECIMALS} from "./constants";


const provider = AnchorProvider.env()
anchor.setProvider(provider);

describe("superteam-dao-contract", () => {
    const program = anchor.workspace.SuperteamDaoContract as Program<SuperteamDaoContract>;

    const airdropSolAmount = 2;
    const solToSend   =   0.5;

    let payer = anchor.web3.Keypair.generate();
    let sender = anchor.web3.Keypair.generate();
    let recipient = anchor.web3.Keypair.generate();
    let identifierAccount, proposalAccount, proposalAccount1, proposalAccount2 : anchor.web3.PublicKey;
    let identifierAccountBump, proposalAccountBump, proposalAccountBump1, proposalAccountBump2: number;
    let mintA;

    before("Boilerplates", async () => {
        airdrop
        const delay = ms => new Promise(res => setTimeout(res, ms));
        await delay(1000*5);
        await airdrop(provider, sender.publicKey, airdropSolAmount)
        await delay(1000*5);
        await airdrop(provider, payer.publicKey, airdropSolAmount)
        await delay(1000*5);
        await airdrop(provider, recipient.publicKey, airdropSolAmount)

    });

    it("initialize identifier and proposal", async () => {

        [identifierAccount, identifierAccountBump] = await findPDAIdentifier(sender.publicKey, program)

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
        mintA = await Token.createMint(
            provider.connection,
            payer,
            payer.publicKey,
            null,
            constants.MINT_A_DECIMALS,
            TOKEN_PROGRAM_ID
        );

        [proposalAccount, proposalAccountBump] = await findPDAProposal(sender.publicKey, identifierData.count, program)

        await program.methods.createProposal(recipient.publicKey, "https://upload.wikimedia.org/wikipedia/en/b/b9/Solana_logo.png",
            "Orca summer Winner", "", mintA.publicKey, "gamefi", new BN(100*(10**MINT_A_DECIMALS)))
            .accounts({
                proposal: proposalAccount,
                identifier: identifierAccount,
                sender: sender.publicKey,
                systemProgram: SystemProgram.programId,
                rent: anchor.web3.SYSVAR_RENT_PUBKEY,
            })
            .signers([sender])
            .rpc();

        const dataProposal = await program.account.proposal.fetch(proposalAccount);
        console.log("[proposal account] Create result: ", dataProposal);

        identifierData = await program.account.identifier.fetch(identifierAccount);

        [proposalAccount1, proposalAccountBump1] = await findPDAProposal(sender.publicKey, identifierData.count, program)

        await program.methods.createProposal(recipient.publicKey, "https://upload.wikimedia.org/wikipedia/en/b/b9/Solana_logo.png",
            "Orca summer 2nd", "", mintA.publicKey, "defi", new BN(100*(10**MINT_A_DECIMALS)))
            .accounts({
                proposal: proposalAccount1,
                identifier: identifierAccount,
                sender: sender.publicKey,
                systemProgram: SystemProgram.programId,
                rent: anchor.web3.SYSVAR_RENT_PUBKEY,
            })
            .signers([sender])
            .rpc();

        const dataProposal1 = await program.account.proposal.fetch(proposalAccount1);
        console.log("[proposal account 1] Create result: ", dataProposal1);


        identifierData = await program.account.identifier.fetch(identifierAccount);

        [proposalAccount2, proposalAccountBump2] = await findPDAProposal(sender.publicKey, identifierData.count, program)

        await program.methods.createProposal(recipient.publicKey, "https://upload.wikimedia.org/wikipedia/en/b/b9/Solana_logo.png",
            "Orca summer 3rd", "", mintA.publicKey, "orca", new BN(100*(10**MINT_A_DECIMALS)))
            .accounts({
                proposal: proposalAccount2,
                identifier: identifierAccount,
                sender: sender.publicKey,
                systemProgram: SystemProgram.programId,
                rent: anchor.web3.SYSVAR_RENT_PUBKEY,
            })
            .signers([sender])
            .rpc();

        const dataProposal2 = await program.account.proposal.fetch(proposalAccount2);
        console.log("[proposal account 2] Create result: ", dataProposal2);
        //
    });

    it("cancel  proposal", async () => {
        await program.methods.cancelProposal()
            .accounts({
                proposal: proposalAccount1,
                sender: sender.publicKey,
                systemProgram: SystemProgram.programId,
            })
            .signers([sender])
            .rpc();

        let proposalCancelData1= await program.account.proposal.fetch(proposalAccount1);
        console.log("[proposal cancel account 1] Create result: ", proposalCancelData1);

    });

    it("reject  proposal", async () => {
        await program.methods.rejectProposal()
            .accounts({
                proposal: proposalAccount2,
                recipient: recipient.publicKey,
                systemProgram: SystemProgram.programId,
            })
            .signers([recipient])
            .rpc();

        let proposalRejectData2= await program.account.proposal.fetch(proposalAccount2);
        console.log("[proposal cancel account 2] Create result: ", proposalRejectData2);

    });

    it("approve  proposal", async () => {
        await program.methods.approveProposal("")
            .accounts({
                proposal: proposalAccount,
                recipient: recipient.publicKey,
                systemProgram: SystemProgram.programId,
                tokenProgram: TOKEN_PROGRAM_ID,
            })
            .signers([recipient])
            .rpc();

        let proposalApproveData= await program.account.proposal.fetch(proposalAccount);
        console.log("[proposal approve account] Create result: ", proposalApproveData);
    });

    it("close cancel or reject  proposal", async () => {

        const balanceBefore = await provider.connection.getBalance(sender.publicKey);
        console.log("[sender balance before close proposal]: ", balanceBefore);
        const balanceProposalAccount2 = await provider.connection.getBalance(proposalAccount2);
        console.log("[proposalAccount 2 balance]: ", balanceProposalAccount2);

        await program.methods.closeProposal()
            .accounts({
                proposal: proposalAccount2,
                sender: sender.publicKey,
                systemProgram: SystemProgram.programId,
            })
            .signers([sender])
            .rpc();



        const balanceAfter = await provider.connection.getBalance(sender.publicKey);
        console.log("[sender balance after close proposal]: ", balanceAfter);

    });

    it("close pending and approve proposal", async () => {

        await program.methods.closeProposal()
            .accounts({
                proposal: proposalAccount,
                sender: sender.publicKey,
                systemProgram: SystemProgram.programId,
            })
            .signers([sender])
            .rpc();

        let proposalApproveData= await program.account.proposal.fetch(proposalAccount);
        console.log("[proposal approve account] Create result: ", proposalApproveData);

    });

    it("get all proposal ", async () => {
        const proposal = await program.account.proposal.all();
        console.log(proposal);

    });

    it("filter proposal by sender ", async () => {
        let sender = new PublicKey("J831y4jyRXukQrhLSKg8fY4nNUdzRXzgw7jHuMzKRP81");
        const proposalBySender = await program.account.proposal.all([
            {
                memcmp: {
                    offset: 40, // Discriminator.
                    bytes: sender.toBase58(),
                }
            }
        ]);

        console.log(proposalBySender);

    });

    it("filter proposal by recipient ", async () => {
        let recipient = new PublicKey("CsYj7vtRvE9ZaFghEQqA7JdaBxvPkeFWc2ucNuz8PoWU");
        const proposalByRecipient = await program.account.proposal.all([
            {
                memcmp: {
                    offset: 8, // Discriminator.
                    bytes: recipient.toBase58(),
                }
            }
        ]);

        console.log(proposalByRecipient);

    });

    it("filter proposal by status ", async () => {
        let status = new BN(1);
        const proposalByStatus = await program.account.proposal.all([
            {
                memcmp: {
                    offset: 74, // Discriminator.
                    bytes: bs58.encode(status.toBuffer()),
                }
            }
        ]);

        console.log(proposalByStatus);

    });

    it("filter proposal by image ", async () => {
        let status = new BN(1);
        const proposalByImage = await program.account.proposal.all([
            {
                memcmp: {
                    offset: 8 + 32 + 32 + 1 + 1 + 4, // Discriminator.
                    bytes: bs58.encode(Buffer.from("https://upload.wikimedia.org/wikipedia/en/b/b9/Solana_logo.png")),
                }
            }
        ]);

        console.log(proposalByImage);

    });

});
