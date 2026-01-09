'use client';

import React, { ReactNode } from 'react';
import { LazorkitProvider as BaseLazorkitProvider } from '@lazorkit/wallet';
import { SOLANA_DEVNET_RPC, LAZORKIT_PORTAL_URL, LAZORKIT_PAYMASTER_URL } from '@/lib/constants';

interface ProviderProps {
    children: ReactNode;
}

/**
 * LazorkitProvider wraps the application to provide passkey wallet context.
 * It configures the SDK to use Solana Devnet and sets up the Paymaster for gasless transactions.
 */
export function LazorkitProvider({ children }: ProviderProps) {
    return (
        <BaseLazorkitProvider
            rpcUrl={SOLANA_DEVNET_RPC}
            portalUrl={LAZORKIT_PORTAL_URL}
            // The paymaster configuration is what enables gasless transactions.
            // Lazorkit will use this URL to sponsor transaction fees for users.
            paymasterConfig={{
                paymasterUrl: LAZORKIT_PAYMASTER_URL,
            }}
        >
            {children}
        </BaseLazorkitProvider>
    );
}
