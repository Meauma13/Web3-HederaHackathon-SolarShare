# SolarShare — Hackathon Starter (Solar microgrid + Hedera demo)

## Overview

This starter repo provides a minimal backend (TypeScript/Express) and frontend (React/Vite) to demo SolarShare: community solar + Hedera micro-payments. The backend supports MOCK_MODE so you can demo immediately without Hedera keys.

## Quickstart (dev/demo)

1. Start backend

```bash
cd solarshare/backend
cp .env.example .env
# optionally set MOCK_MODE=false and add Hedera keys to use testnet
npm install
npm run dev
```
