import {PublicKey} from "@solana/web3.js";

export  async function getTokenBalance(pubkey, provider) {
    return parseInt((await provider.connection.getTokenAccountBalance(pubkey)).value.amount);
}

export async function mintTokenAToUser(userTokenAccount, mint, amount, payer) {
    await mint.mintTo(
        userTokenAccount,
        payer.publicKey,
        [payer],
        amount,
    );
}

export async function getLamportBalance(program, pubkey: PublicKey, name: string) {
  let balance =  await program.provider.connection.getBalance(pubkey)
    console.log(`current balance of ${name} has address ${pubkey.toBase58()} is ${balance}`);
}