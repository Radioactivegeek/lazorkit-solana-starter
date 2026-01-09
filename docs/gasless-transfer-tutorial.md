# Tutorial 2: Sending Gasless USDC Transactions

One of the biggest onboarding friction points on Solana is the requirement for users to hold **SOL** just to pay for transaction fees.

**Lazorkit removes this requirement** by introducing a **Paymaster**, which can sponsor transaction fees on behalf of users.  
This enables truly gasless user experiences — especially important for consumer-facing apps.

This tutorial demonstrates how to send a **gasless USDC transfer** using a passkey-based Lazorkit smart wallet on **Solana Devnet**.

---

## Prerequisites

- A working Lazorkit passkey wallet (see Tutorial 1)
- Lazorkit Paymaster URL
- Solana Devnet configuration

---

## Step 1: Configure the Paymaster

To enable gasless transactions, configure the Paymaster in your `LazorkitProvider`.

```tsx
<LazorkitProvider
  rpcUrl="https://api.devnet.solana.com"
  portalUrl="https://portal.lazor.sh"
  paymasterConfig={{
    paymasterUrl: "https://paymaster.lazor.sh/your-project-id",
  }}
>

Step 2: Request Gasless Mode on Wallet Connect

When connecting the wallet, explicitly request paymaster mode.

import { useWallet } from '@lazorkit/wallet';

const { connect } = useWallet();

const handleConnect = async () => {
  await connect({ feeMode: 'paymaster' });
};


Step 3: Send a Gasless Transaction

Once connected, build and send a transaction as usual.

import { Transaction } from '@solana/web3.js';
import { useWallet } from '@lazorkit/wallet';

const { smartWalletPubkey, signAndSendTransaction } = useWallet();

const handleTransfer = async () => {
  const transaction = new Transaction().add(
    // Example: SPL token transfer instruction
  );

  const signature = await signAndSendTransaction(transaction);
};