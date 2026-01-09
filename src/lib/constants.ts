export const SOLANA_DEVNET_RPC = "https://api.devnet.solana.com";

// Standard Devnet USDC Mint address
export const DEVNET_USDC_MINT = "4zMMC9srtvSqzRLS31A9UuT73H6p89mH47V5D5SNoSfy";

// NOTE: Replace with your own Paymaster URL in production
// Documentation: https://docs.lazor.sh/
export const LAZORKIT_PORTAL_URL = process.env.NEXT_PUBLIC_LAZORKIT_PORTAL_URL || "https://portal.lazor.sh";
export const LAZORKIT_PAYMASTER_URL =
    process.env.NEXT_PUBLIC_LAZORKIT_PAYMASTER_URL ??
    "https://paymaster.lazor.sh/demo";
