import {
    Keypair
} from "@solana/web3.js";

export async function hasPhantomProvider(): Promise<boolean> {
    if ("solana" in window) {
        // @ts-ignore
        const provider = window.solana as any;
        if (provider.isPhantom) return true;
    }
    return false;
};

export async function connectWallet(): Promise<Keypair | undefined> {
    // @ts-ignore
    const { solana } = window;

    // checks if phantom wallet exists
    if (solana) {
        try {
            // connects wallet and returns response which includes the wallet public key
            const response = await solana.connect();
            console.log('Wallet successfully connected: ', response.publicKey.toString());
            return response;
        } catch (err) {
            // { code: 4001, message: 'User rejected the request.' }
        }
    }
    
    return undefined;
}