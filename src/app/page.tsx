'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@lazorkit/wallet';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { createTransferCheckedInstruction, getAssociatedTokenAddress, getMint } from '@solana/spl-token';
import { SOLANA_DEVNET_RPC, DEVNET_USDC_MINT } from '@/lib/constants';

export default function Home() {
  const { smartWalletPubkey, wallet, connect, disconnect, signAndSendTransaction } = useWallet();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [txSig, setTxSig] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeSections, setActiveSections] = useState<Record<string, boolean>>({});

  // Section Observer for 3D transitions
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSections((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    ['onboarding', 'capabilities', 'playground'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  // 1. Connect function (Passkey Flow)
  const handleConnect = async () => {
    try {
      setLoading(true);
      setStatus('Prompting for passkey...');
      await connect({ feeMode: 'paymaster' } as any);
      setStatus('Connected successfully!');
    } catch (err: any) {
      console.error('Connection failed:', err);
      setStatus(`Connection failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 2. Gasless USDC Transfer function
  const handleGaslessTransfer = async () => {
    if (!smartWalletPubkey) return;

    try {
      setLoading(true);
      setStatus('Preparing gasless transfer...');
      setTxSig(null);

      const connection = new Connection(SOLANA_DEVNET_RPC, 'confirmed');
      const mintPublicKey = new PublicKey(DEVNET_USDC_MINT);
      const recipient = smartWalletPubkey;
      const amount = 0.1;

      const mintInfo = await getMint(connection, mintPublicKey);
      const amountInRaw = amount * Math.pow(10, mintInfo.decimals);

      const senderATA = await getAssociatedTokenAddress(mintPublicKey, smartWalletPubkey);
      const recipientATA = await getAssociatedTokenAddress(mintPublicKey, recipient);

      const instruction = createTransferCheckedInstruction(
        senderATA,
        mintPublicKey,
        recipientATA,
        smartWalletPubkey,
        amountInRaw,
        mintInfo.decimals
      );

      const transaction = new Transaction().add(instruction);
      setStatus('Signing and sending gasless transaction...');
      const signature = await signAndSendTransaction(transaction);

      setTxSig(signature);
      setStatus('Transaction successful! No SOL was spent.');
    } catch (err: any) {
      console.error('Transfer failed:', err);
      setStatus(`Transfer failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 3. Mint Demo Token function
  const handleMintDemo = async () => {
    if (!wallet) return;
    try {
      setLoading(true);
      setStatus('Simulating programmatic mint...');
      setTxSig(null);
      await new Promise(resolve => setTimeout(resolve, 1500));
      const mockSig = "mint_demo_" + Math.random().toString(36).substring(7);
      setTxSig(mockSig);
      setStatus('Success! 1,000 DemoTokens minted to your Smart Wallet.');
    } catch (err: any) {
      console.error('Mint failed:', err);
      setStatus(`Mint failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 4. Burn Demo Token function
  const handleBurnDemo = async () => {
    if (!wallet) return;
    try {
      setLoading(true);
      setStatus('Simulating deflationary burn...');
      setTxSig(null);
      await new Promise(resolve => setTimeout(resolve, 1500));
      const mockSig = "burn_demo_" + Math.random().toString(36).substring(7);
      setTxSig(mockSig);
      setStatus('Success! 500 DemoTokens removed from supply via Smart Wallet.');
    } catch (err: any) {
      console.error('Burn failed:', err);
      setStatus(`Burn failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 5. Simulated Airdrop function
  const handleAirdrop = async () => {
    try {
      setLoading(true);
      setStatus('Success! Initializing Devnet Airdrop...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      const mockSig = "airdrop_" + Math.random().toString(36).substring(7);
      setTxSig(mockSig);
      setStatus('Success! 0.5 SOL (Devnet) airdropped to your Smart Account.');
    } catch (err: any) {
      console.error('Airdrop failed:', err);
      setStatus(`Airdrop failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      onMouseMove={handleMouseMove}
      className="min-h-screen bg-black text-white p-8 font-sans flex flex-col items-center relative overflow-hidden"
    >
      {/* Background Decor */}
      <div
        className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-1000"
        style={{
          backgroundImage: `
            radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, rgba(16, 185, 129, 0.08) 0%, transparent 350px),
            radial-gradient(circle, rgba(16, 185, 129, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 40px 40px'
        }}
      />

      {/* Sticky Navigation */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-black/50 backdrop-blur-xl border border-white/10 px-2 py-2 rounded-full hidden sm:flex items-center gap-1 shadow-2xl">
        {['Onboarding', 'Capabilities', 'Playground'].map((tab) => (
          <button
            key={tab}
            onClick={() => document.getElementById(tab.toLowerCase())?.scrollIntoView({ behavior: 'smooth' })}
            className="px-6 py-2 rounded-full text-[11px] font-black uppercase tracking-widest text-zinc-500 hover:text-emerald-500 hover:bg-white/5 transition-all"
          >
            {tab}
          </button>
        ))}
      </nav>

      <div className="max-w-4xl w-full space-y-48 py-20 relative z-10">
        {/* SECTION 1: ONBOARDING */}
        <section
          id="onboarding"
          style={{
            opacity: activeSections.onboarding ? 1 : 0,
            transform: `perspective(1000px) translateZ(${activeSections.onboarding ? '0' : '-40px'})`,
          }}
          className="flex flex-col items-center space-y-16 scroll-mt-32 transition-all duration-1000 ease-out transform-gpu"
        >
          <header className={`text-center space-y-6 transition-all duration-1000 delay-100 ${activeSections.onboarding ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="space-y-4">
              <h1 className="text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
                Seedless Onboarding <br />
                <span className="text-emerald-500">Gasless Execution.</span>
              </h1>
              <p className="text-zinc-400 font-medium max-w-xl mx-auto leading-relaxed text-lg">
                Experience the future of Solana UX with <span className="text-white font-bold">Passkeys + Smart Wallets</span>.
                Zero seed phrases, zero gas hurdles, total security.
              </p>
            </div>
            <div className="inline-block px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full">
              <p className="text-[10px] text-emerald-500 uppercase font-black tracking-widest">Protocol Version 1.0</p>
            </div>
          </header>

          <div className="w-full max-w-xl">
            {/* Section 1: Wallet Connection (Stay flat at rest, but entry is okay) */}
            <section className="group perspective-[1000px] transform-style-3d">
              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 space-y-6 translate-z-4 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] relative overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-700/50 to-transparent" />
                <div className="space-y-2">
                  <h2 className="text-xl font-bold italic tracking-tight">Active Session Flow</h2>
                  <p className="text-sm text-zinc-500">Secure hardware authentication via FIDO2 standards.</p>
                </div>

                {!wallet ? (
                  <button
                    id="connect-button"
                    onClick={handleConnect}
                    disabled={loading}
                    className="w-full py-4 bg-emerald-600 font-bold text-white rounded-xl disabled:opacity-50 transition-colors flex items-center justify-center gap-3"
                  >
                    {loading ? <Spinner /> : 'Initialize Passkey Wallet'}
                  </button>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-zinc-500 font-medium">Authentication</span>
                      <span className="text-emerald-500 font-bold uppercase tracking-widest text-[10px]">Trusted</span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">Smart Account Address</p>
                      <code className="block p-3 bg-black border border-zinc-800 rounded-lg text-xs break-all font-mono text-emerald-100">
                        {smartWalletPubkey?.toBase58()}
                      </code>
                    </div>
                    <button
                      onClick={disconnect}
                      className="w-full py-2 bg-zinc-800 text-zinc-400 hover:text-red-400 text-xs font-bold rounded-lg transition-colors uppercase tracking-widest"
                    >
                      Teardown Session
                    </button>
                  </div>
                )}
              </div>
            </section>
          </div>
        </section>

        {/* SECTION 2: CAPABILITIES */}
        <section
          id="capabilities"
          style={{
            opacity: activeSections.capabilities ? 1 : 0,
            transform: `perspective(1000px) translateZ(${activeSections.capabilities ? '0' : '-40px'})`,
          }}
          className="space-y-12 scroll-mt-32 transition-all duration-1000 ease-out transform-gpu"
        >
          <div className={`space-y-2 text-center sm:text-left transition-all duration-1000 delay-100 ${activeSections.capabilities ? 'translate-x-0' : '-translate-x-10'}`}>
            <h2 className="text-3xl font-bold tracking-tight">Core Infrastructure</h2>
            <p className="text-zinc-500 text-sm max-w-lg">The architectural pillars that enable non-custodial, gasless account abstraction.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6 w-full">
            {FEATURE_ITEMS.filter(f => !f.action && f.type !== 'puzzle').map((feature, i) => (
              <FlipCard
                key={i}
                title={feature.title}
                desc={feature.desc}
                bullets={feature.bullets}
                wallet={wallet}
                loading={loading}
              />
            ))}
          </div>
        </section>

        {/* SECTION 3: PLAYGROUND */}
        <section
          id="playground"
          style={{
            opacity: activeSections.playground ? 1 : 0,
            transform: `perspective(1000px) translateZ(${activeSections.playground ? '0' : '-40px'})`,
          }}
          className="space-y-12 scroll-mt-32 transition-all duration-1000 ease-out transform-gpu"
        >
          <div className={`space-y-2 text-center sm:text-left transition-all duration-1000 delay-100 ${activeSections.playground ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h2 className="text-3xl font-bold tracking-tight">Interactive Execution</h2>
            <p className="text-zinc-500 text-sm max-w-lg">Live simulations of smart wallet capabilities on Solana Devnet.</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 space-y-6">
              {/* Gasless Transaction Action */}
              <section className="group perspective-[1000px] transform-style-3d">
                <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 space-y-6 translate-z-4 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] relative overflow-hidden">
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-700/50 to-transparent" />
                  <div className="space-y-2">
                    <h2 className="text-xl font-bold italic tracking-tight">Sponsored Swap/Transfer</h2>
                    <p className="text-sm text-zinc-500">Execute a USDC transfer with zero SOL. Paid by Paymaster.</p>
                  </div>

                  <button
                    onClick={handleGaslessTransfer}
                    disabled={!wallet || loading}
                    className="w-full py-4 bg-white font-bold text-black rounded-xl disabled:opacity-30 transition-all duration-200 hover:bg-zinc-100 flex items-center justify-center gap-3 shadow-xl"
                  >
                    {loading ? <Spinner dark /> : 'Simulate Gasless Transfer'}
                  </button>

                  {txSig && (
                    <div className="p-4 bg-emerald-900/10 border border-emerald-500/20 rounded-xl space-y-3">
                      <p className="text-xs font-bold text-emerald-500 flex items-center gap-2">
                        <span>🎉</span> Sequence Finalized
                      </p>
                      <a
                        href={`https://solscan.io/tx/${txSig}?cluster=devnet`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block w-full text-center py-2 bg-emerald-600 text-white text-[10px] font-black rounded-lg transition-colors uppercase tracking-widest"
                      >
                        Verify on Solscan
                      </a>
                    </div>
                  )}
                </div>
              </section>

              {status && !txSig && (
                <div className="text-center py-4 bg-zinc-900/30 border border-zinc-800/50 rounded-2xl">
                  <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest animate-pulse">{status}</p>
                </div>
              )}
            </div>

            <div className="flex-1 grid gap-6">
              {FEATURE_ITEMS.filter(f => f.action || f.type === 'puzzle').map((feature, i) => {
                if (feature.type === 'puzzle') {
                  return (
                    <PuzzleCard
                      key={i}
                      wallet={wallet}
                      onSuccess={handleAirdrop}
                      loading={loading}
                    />
                  );
                }
                return (
                  <FlipCard
                    key={i}
                    title={feature.title}
                    desc={feature.desc}
                    bullets={feature.bullets}
                    action={feature.action ? { ...feature.action, onClick: feature.action.id === 'mint' ? handleMintDemo : handleBurnDemo } : null}
                    wallet={wallet}
                    loading={loading}
                  />
                );
              })}
            </div>
          </div>
        </section>


        <footer className="pt-32 border-t border-zinc-900/50 text-center space-y-6 pb-12">
          <div className="space-y-2">
            <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest opacity-40">Solana Devnet · Powered by Lazorkit</p>
          </div>
          <div className="flex justify-center gap-10 text-[11px] font-bold text-zinc-400 uppercase tracking-widest opacity-60">
            <a href="https://github.com/lazor-kit" target="_blank" className="hover:text-emerald-500 transition-colors">GitHub</a>
            <div className="w-[1px] h-3 bg-zinc-800 self-center" />
            <a href="https://docs.lazorkit.sh" target="_blank" className="hover:text-emerald-500 transition-colors">Docs</a>
          </div>
        </footer>
      </div>
    </main>
  );
}

function Spinner({ dark }: { dark?: boolean }) {
  return <div className={`w-4 h-4 border-2 rounded-full animate-spin ${dark ? 'border-black/30 border-t-black' : 'border-white/30 border-t-white'}`} />;
}

const FEATURE_ITEMS: any[] = [
  {
    title: "Passkey Authentication",
    desc: "Hardware-level security using biometrics. No seed phrases, no private keys, just confidence.",
    bullets: [
      "FIDO2 / WebAuthn standard",
      "Secure Enclave protection",
      "Biometric auth (FaceID/TouchID)",
      "Non-custodial by default"
    ]
  },
  {
    title: "Gasless Transactions",
    desc: "Sponsor user interactions via a Paymaster. Execute transactions with zero SOL in the user's wallet.",
    bullets: [
      "Fully sponsored TX fees",
      "Paymaster architecture",
      "Zero SOL required for users",
      "Real-time sponsorship logic"
    ]
  },
  {
    title: "Mint Token (Demo)",
    desc: "Demonstrates programmatic asset issuance directly from a Smart Wallet account.",
    action: { id: 'mint', label: "Mint Demo Token" },
    bullets: [
      "On-chain asset creation",
      "Programmatic authority",
      "Zero gas (if sponsored)",
      "Immediate supply update"
    ]
  },
  {
    title: "Burn Token (Demo)",
    desc: "Demonstrates secure deflationary mechanics by reducing asset supply on-chain.",
    action: { id: 'burn', label: "Burn Demo Token" },
    bullets: [
      "Supply control logic",
      "Deflationary mechanics",
      "DAO / Protocol use cases",
      "Immutable transaction proof"
    ]
  },
  {
    title: "Developer Puzzle",
    desc: "Solve a simple task to unlock a Devnet airdrop simulation. Gated by Smart Wallet authentication.",
    type: "puzzle"
  },
  {
    title: "Smart Wallets",
    desc: "Programmable accounts that enable complex logic like batching and spending limits.",
    bullets: [
      "Program-Derived Addresses",
      "Atomic multi-step batching",
      "Configurable session keys",
      "Account Abstraction ready"
    ]
  },
  {
    title: "Developer-First SDK",
    desc: "Integrate seedless onboarding and gasless UX with just a few lines of code.",
    bullets: [
      "Simple React hooks logic",
      "Universal passkey support",
      "Production-ready endpoints",
      "Minimal boilerplate setup"
    ]
  }
];

function PuzzleCard({ wallet, onSuccess, loading }: any) {
  const [answer, setAnswer] = useState('');
  const [solved, setSolved] = useState(false);
  const [error, setError] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    setRotation({
      x: ((y - centerY) / centerY) * -4,
      y: ((x - centerX) / centerX) * 4
    });
  };

  const checkAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (answer === '12') {
      setSolved(true);
      setError(false);
      onSuccess();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setRotation({ x: 0, y: 0 })}
      style={{
        transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
        transition: rotation.x === 0 ? 'transform 0.5s ease-out' : 'none'
      }}
      className={`p-6 bg-zinc-900/40 border rounded-2xl flex flex-col justify-between transition-all duration-300 h-[220px] translate-z-2 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] transform-style-3d ${!wallet ? 'opacity-40 grayscale pointer-events-none' : 'border-zinc-800 hover:border-emerald-500/30 hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-900/10'}`}
    >
      <div className="space-y-4 translate-z-10">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-white uppercase tracking-tight text-sm">Developer Puzzle</h3>
          {!wallet && <span className="text-[9px] font-black text-zinc-600 bg-zinc-800 px-2 py-1 rounded border border-white/5 uppercase">Locked</span>}
        </div>

        {wallet ? (
          <div className="space-y-4">
            {!solved ? (
              <form onSubmit={checkAnswer} className="space-y-3">
                <p className="text-xs text-zinc-400">Complete the sequence: <span className="text-emerald-500 font-bold">3, 6, 9, ...</span></p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Result?"
                    className={`flex-1 bg-black/50 border rounded-lg px-3 py-2 text-xs focus:outline-none transition-colors ${error ? 'border-red-500' : 'border-zinc-800 focus:border-emerald-500'}`}
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-emerald-600 px-4 py-2 rounded-lg text-xs font-bold hover:bg-emerald-500 transition-colors disabled:opacity-50"
                  >
                    Solve
                  </button>
                </div>
              </form>
            ) : (
              <div className="py-2 space-y-2">
                <div className="text-xs text-emerald-500 font-bold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  Puzzle Deciphered
                </div>
                <p className="text-[10px] text-zinc-500">Programmatic access granted. Airdrop sequence initiated.</p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-xs text-zinc-600 leading-relaxed italic">Authentication required to access developer challenges.</p>
        )}
      </div>

      <div className="pt-4 border-t border-white/5 text-[9px] font-black uppercase text-zinc-600 tracking-widest flex justify-between">
        <span>Gated Experience</span>
        <span>Demo Only</span>
      </div>
    </div>
  );
}

function FlipCard({ title, desc, bullets, action, wallet, loading }: any) {
  const [flipped, setFlipped] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (flipped) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    setRotation({
      x: ((y - centerY) / centerY) * -4,
      y: ((x - centerX) / centerX) * 4
    });
  };

  return (
    <div
      className="group perspective-[1000px] h-[220px] cursor-pointer transform-style-3d"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setRotation({ x: 0, y: 0 })}
      onClick={() => { setFlipped(!flipped); setRotation({ x: 0, y: 0 }); }}
    >
      <div
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y + (flipped ? 180 : 0)}deg)`,
          transition: rotation.x === 0 ? 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)' : 'none'
        }}
        className={`relative w-full h-full preserve-3d`}
      >
        {/* FRONT */}
        <div className={`absolute inset-0 backface-hidden p-6 bg-zinc-900/40 border border-zinc-800 rounded-2xl flex flex-col justify-between transition-all duration-300 translate-z-2 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] ${!flipped ? 'hover:border-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-900/10' : ''}`}>
          <div className="space-y-2 translate-z-10 text-shadow-sm">
            <h3 className="font-bold text-white uppercase tracking-tight text-sm">{title}</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">{desc}</p>
          </div>

          {action ? (
            <button
              onClick={(e) => { e.stopPropagation(); action.onClick(); }}
              disabled={!wallet || loading}
              className="w-full py-2 bg-emerald-600 font-bold text-white text-[10px] uppercase tracking-widest rounded-lg disabled:opacity-30 transition-all duration-150 hover:brightness-110 mt-4 h-10 flex items-center justify-center shadow-lg shadow-emerald-900/20"
            >
              {loading ? <Spinner /> : action.label}
            </button>
          ) : (
            <div className="pt-2 text-[9px] font-bold text-emerald-500 text-center tracking-widest opacity-80">Click to view technical details</div>
          )}
        </div>

        {/* BACK */}
        <div
          className="absolute inset-0 backface-hidden rotate-y-180 p-6 bg-emerald-700 text-white rounded-2xl flex flex-col justify-center border border-emerald-500/30 shadow-2xl shadow-emerald-900/40"
        >
          <h3 className="font-bold uppercase tracking-tight text-sm mb-3">Technical Detail</h3>
          <ul className="space-y-2">
            {bullets?.map((b: string, i: number) => (
              <li key={i} className="text-[10px] font-bold flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-white/40 rounded-full" />
                {b}
              </li>
            ))}
          </ul>
          <div className="pt-6 text-[9px] font-black text-white/50 text-center tracking-widest">Click to Return</div>
        </div>
      </div>
    </div>
  );
}
