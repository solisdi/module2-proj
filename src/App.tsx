import './App.css';
import React, { useState } from 'react';
import { Box, Button, Grid } from '@mui/material';
import { Keypair } from '@solana/web3.js';
import { establishConnection, createNewWallet, airdropSOL, transferSOL } from './client/account_functions';
import { hasPhantomProvider, connectWallet } from './client/wallet_functions';

export default function App() {
  const [newWallet, setNewWallet] = useState<Keypair | undefined>();
  const [hasProvider, setHasProvider] = useState<boolean>(false);
  const [phantomWallet, setPhantomWallet] = useState<Keypair | undefined>();

  const generateNewWallet = async () => {
    await establishConnection();
    const wallet = await createNewWallet();
    if (wallet) {
      setNewWallet(wallet);

      // Airdrop 2 SOL
      await airdropSOL(wallet, 2);

      // check if phantom wallet is available
      const hasProvider = await hasPhantomProvider();
      setHasProvider(hasProvider);
    }
  }

  const connectPhantomWallet = async () => {
    const phantomWallet = await connectWallet();
    if (phantomWallet)
      setPhantomWallet(phantomWallet);
  }

  const transferBalance = async () => {
    if (newWallet && phantomWallet) {
      // Airdrop additional 2 SOL to new wallet for transaction fees
      await airdropSOL(newWallet, 2);
      await transferSOL(newWallet, phantomWallet, 2);
    }
  }

  return (
    <Grid container direction="column" justifyContent="center" alignItems="center" spacing={2}>
      {!newWallet && (
        <Grid item xs={12}>
          <Button variant="contained" onClick={generateNewWallet}>Create a new Solana account</Button>
        </Grid>
      )}
      {newWallet && (
        <Grid item xs={12}>
          <Button variant="outlined" fullWidth>{newWallet.publicKey.toString()}</Button>
        </Grid>
      )}
      {newWallet && !hasProvider && (
        <Grid item xs={12}>
          <Button variant="contained" color='error' href="https://phantom.app/">
            No provider found. Install Phantom Browser extension
          </Button>
        </Grid>
      )}
      {newWallet && hasProvider && !phantomWallet && (
        <Grid item xs={12}>
          <Button variant="contained" color='secondary' onClick={connectPhantomWallet} fullWidth>Connect to Phantom Wallet</Button>
        </Grid>
      )}
      {newWallet && hasProvider && phantomWallet && (
        <Grid item xs={12}>
          <Button variant="outlined" color='secondary'>{phantomWallet.publicKey.toString()}</Button>
        </Grid>
      )}
      {newWallet && phantomWallet && (
        <Grid item xs={12}>
          <Button variant="contained" color='success' onClick={transferBalance}>Transfer to Phanom Wallet</Button>
        </Grid>
      )}
    </Grid>
  )
}