'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Handle Lazorkit passkey authentication callback.
 * This page acts as a silent intermediary to bypass 404 issues on Vercel deployments.
 */
export default function AuthCallback() {
    const router = useRouter();

    useEffect(() => {
        // Immediately return to homepage after Lazorkit sets its internal state
        router.replace('/');
    }, [router]);

    return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="text-center space-y-4">
                <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">
                    Completing authentication...
                </p>
            </div>
        </div>
    );
}
