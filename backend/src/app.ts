// Main Express app. Provides endpoints for init-token, register (create user + simulated Hedera account), topup, consume, balances, list users.

import express from "express";
import dotenv from "dotenv";
dotenv.config();

import { createHederaAccount } from "./hedera/account";
import {
    createTokenIfNotExists,
    mint,
    associateIfNeeded,
    transferToken,
} from "./hedera/token";
import {
    createUser,
    getUser,
    updateBalance,
    listUsers,
    addUsageEvent,
    listUsageEvents,
} from "./storage";

import bodyParser from "body-parser";
import crypto from "crypto";

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

// Initialize token
app.post("/api/init-token", async (req, res) => {
    try {
        const tokenId = await createTokenIfNotExists();
        res.json({ ok: true, tokenId });
    } catch (err: any) {
        res.status(500).json({ ok: false, error: err.message });
    }
});

// Register user
app.post("/api/register", async (req, res) => {
    const { id, name, role } = req.body;
    if (!id || !role)
        return res
            .status(400)
            .json({ ok: false, error: "id and role required" });

    try {
        const { accountId, privateKey } = await createHederaAccount();
        const user = createUser({
            id,
            name,
            role,
            hederaAccount: accountId,
            balance: 0,
        });
        res.json({ ok: true, user, privateKey });
    } catch (err: any) {
        res.status(500).json({ ok: false, error: err.message });
    }
});

// Top-up tokens
app.post("/api/topup", async (req, res) => {
    const { id, amount } = req.body;
    if (!id || !amount)
        return res
            .status(400)
            .json({ ok: false, error: "id and amount required" });

    try {
        const user = getUser(id);
        if (!user) throw new Error("User not found");
        const tokenId = await createTokenIfNotExists();
        await mint(tokenId, amount);
        updateBalance(id, amount);
        res.json({ ok: true, balance: getUser(id)?.balance });
    } catch (err: any) {
        res.status(500).json({ ok: false, error: err.message });
    }
});

// Simulate consumption
app.post("/api/consume", async (req, res) => {
    const { consumerId, providerId, kwh } = req.body;
    if (!consumerId || !providerId || !kwh)
        return res.status(400).json({ ok: false, error: "fields required" });

    try {
        const tokenId = await createTokenIfNotExists();
        const consumer = getUser(consumerId);
        const provider = getUser(providerId);
        if (!consumer || !provider) throw new Error("user not found");
        if (consumer.balance < kwh) throw new Error("insufficient balance");

        const tx = await transferToken(
            tokenId,
            consumer.hederaAccount!,
            provider.hederaAccount!,
            kwh
        );
        updateBalance(consumerId, -kwh);
        updateBalance(providerId, +kwh);

        const ev = addUsageEvent({
            id: crypto.randomUUID(),
            consumerId,
            providerId,
            kwh,
            txHash: tx.txHash,
            timestamp: new Date().toISOString(),
        });
        res.json({ ok: true, event: ev });
    } catch (err: any) {
        res.status(500).json({ ok: false, error: err.message });
    }
});

// List users & usage
app.get("/api/users", (_req, res) => res.json(listUsers()));
app.get("/api/usage", (_req, res) => res.json(listUsageEvents()));

app.listen(PORT, () =>
    console.log(`SolarShare backend running on port ${PORT}`)
);
