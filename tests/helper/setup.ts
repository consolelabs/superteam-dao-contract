import * as anchor from "@project-serum/anchor";
import {PublicKey} from "@solana/web3.js";
import { Program, AnchorProvider, BN, Wallet } from '@project-serum/anchor';
import * as constants from "../constants";

export async function findPDAIdentifier(owner: PublicKey, program){
    return await PublicKey.findProgramAddress(
        [
            Buffer.from("v1"),
            Buffer.from(constants.identifierSeed),
            owner.toBuffer(),
            ,
        ],
        program.programId
    );

}

export async function findPDAProposal(owner: PublicKey, identifierCount: BN, program){
    return await PublicKey.findProgramAddress(
        [
            Buffer.from("v1"),
            Buffer.from(constants.proposalSeed),
            owner.toBuffer(),
            identifierCount.toArrayLike(Buffer, "le", 8)
            ,
        ],
        program.programId
    );

}

export const getPage = async (page, perPage, accountPublicKeys, program) => {
    const paginatedPublicKeys = accountPublicKeys.slice(
        (page - 1) * perPage,
        page * perPage,
    );

    if (paginatedPublicKeys.length === 0) {
        return [];
    }
    let arrayData:any[] = [];


    for (var i = 0; i < paginatedPublicKeys.length; i++) {
        let data = await program.account.proposal.fetch(paginatedPublicKeys[i])
        arrayData.push(data)
    }

    return arrayData;
}
