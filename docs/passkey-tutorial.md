# Tutorial 1: Creating a Passkey-Based Solana Wallet

This tutorial walks through implementing **seedless onboarding** on Solana using **Lazorkit** and **WebAuthn (Passkeys)**.  
Users can create and access a smart wallet using biometrics (FaceID, TouchID, Windows Hello) — without installing a wallet extension or managing seed phrases.

---

## Prerequisites

- A Next.js project (App Router or Pages Router)
- Node.js 18+
- `@lazorkit/wallet` SDK installed
- A Lazorkit project (Portal URL)

> ⚠️ This tutorial is configured for **Solana Devnet** and demo usage only.

---

## Step 1: Wrap Your App with `LazorkitProvider`

The `LazorkitProvider` initializes the SDK and provides wallet context to your app.  
It must wrap your application **once at the root level**.

```tsx
// src/components/LazorkitProvider.tsx
import { LazorkitProvider } from '@lazorkit/wallet';

export function MyProvider({ children }) {
  return (
    <LazorkitProvider
      rpcUrl="https://api.devnet.solana.com"
      portalUrl="https://portal.lazor.sh" // Replace with your Lazorkit portal URL
    >
      {children}
    </LazorkitProvider>
  );
}


Step 2: Trigger Passkey Wallet Creation

Use the useWallet hook to access the connect function.
Calling connect() prompts the browser’s native passkey flow.

import { useWallet } from '@lazorkit/wallet';

const { connect } = useWallet();

const handleConnect = async () => {
  // Triggers FaceID / TouchID / Windows Hello
  await connect();
};