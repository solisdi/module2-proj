import {
    Keypair,
    Connection,
    PublicKey,
    clusterApiUrl,
    LAMPORTS_PER_SOL,
    Transaction,
    SystemProgram,
    sendAndConfirmTransaction
} from '@solana/web3.js';
import * as buffer from "buffer";

window.Buffer = buffer.Buffer;
let connection: Connection;

/**
 * Establish a connection to the cluster
 */
export async function establishConnection(): Promise<void> {
    connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    console.log('Connection to cluster established');
}

/**
 * Create a new wallet and airdrop 2 SOL to the generated wallet
 */
export async function createNewWallet(): Promise<Keypair> {
    const wallet = Keypair.generate();
    console.log('Program Wallet Created: ', wallet.publicKey.toString());
    return wallet;
}

export async function airdropSOL(wallet: Keypair, amount: number): Promise<void> {
    try {
        const walletAirDropSignature = await connection.requestAirdrop(
            wallet.publicKey,
            amount * LAMPORTS_PER_SOL
        );

        await connection.confirmTransaction(walletAirDropSignature);
        console.log('Successfully airdrop ', amount, ' SOL to: ', wallet.publicKey.toString());
        console.log('Signature: ', walletAirDropSignature);

        let balance = await getBalance(wallet);
        console.log('Current balance: ', balance);
    }
    catch (err) {
        console.log(err);
    }
}

export async function transferSOL(from: Keypair, to: Keypair, amount: number): Promise<void> {
    // Get the current balance of the to wallet
    let fromBalance = await getBalance(from);
    let toBalance = await getBalance(to);
    console.log('Program Wallet Balance: ', fromBalance, 'Phantom Wallet Balance: ', toBalance);

    // Send money from "from" wallet and into "to" wallet
    var transaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: from.publicKey,
            toPubkey: to.publicKey,
            lamports: amount * LAMPORTS_PER_SOL
        })
    );

    var signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [from]
    );
    
    fromBalance = await getBalance(from);
    toBalance = await getBalance(to);
    console.log('Successfully transferred ', amount,' SOL to: ', to.publicKey.toString());
    console.log('Signature: ', signature);
    console.log('Program Wallet Balance: ', fromBalance, 'Phantom Wallet Balance: ', toBalance);
}

export async function getBalance(wallet: Keypair): Promise<number> {
    let balance = await connection.getBalance(wallet.publicKey);
    return balance / LAMPORTS_PER_SOL;
}