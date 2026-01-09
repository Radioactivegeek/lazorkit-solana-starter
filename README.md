# Lazorkit Solana Starter Template

A high-quality, minimal **developer starter template** demonstrating how to integrate the **Lazorkit SDK** for **passkey-based smart wallets** and **gasless transactions** on **Solana Devnet**.

This repo is designed to help Solana developers get started with **seedless onboarding** and **gas-abstracted UX** in minutes — without wallet extensions or seed phrases.

---

## 🎯 Why This Project Exists

Even in 2025, most Solana dApps still require:
- Installing a browser wallet
- Managing seed phrases
- Holding SOL just to get started

Solana now supports **passkey-based authentication**, and **Lazorkit** enables developers to build:
- Smart wallets secured by biometrics
- Gasless transactions via paymasters
- Seamless onboarding for non-crypto users

This repo provides a **clear, practical reference implementation** for those features.

---

## ✨ Features

- **Passkey Authentication**
  - No seed phrases
  - No wallet extensions
  - Uses FaceID / TouchID / Windows Hello (WebAuthn)

- **Gasless Transactions**
  - Transaction fees sponsored via Lazorkit Paymaster
  - Users can transact with **zero SOL balance**

- **Smart Wallet Abstraction**
  - Programmatic wallet accounts
  - Extensible for batching, automation, and permissions

- **Modern Stack**
  - Next.js (App Router)
  - Tailwind CSS
  - Solana Devnet preconfigured

---

## 📁 Project Structure

```txt
src/
├─ app/                 # Next.js App Router pages
├─ components/          # UI + interaction components
├─ lib/                 # Lazorkit + Solana helpers
├─ contexts/            # Wallet / SDK providers
docs/
├─ passkey-tutorial.md
├─ gasless-transfer-tutorial.md
