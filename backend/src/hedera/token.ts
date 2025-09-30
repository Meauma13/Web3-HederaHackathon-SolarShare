// Token creation, mint, associate and transfer functions. Works in MOCK_MODE too.

import dotenv from "dotenv";
dotenv.config();
import {
    Client,
    PrivateKey,
    AccountId,
    TokenCreateTransaction,
    TokenType,
    TokenSupplyType,
    TokenMintTransaction,
    TokenAssociateTransaction,
    TransferTransaction,
} from "@hashgraph/sdk";

const MOCK_MODE = process.env.MOCK_MODE === "true";
const operatorIdStr = process.env.HEDERA_OPERATOR_ID;
const operatorKeyStr = process.env.HEDERA_OPERATOR_KEY;

let client: Client | null = null;
let operatorId: AccountId | null = null;
let operatorKey: PrivateKey | null = null;

if (!MOCK_MODE) {
    if (!operatorIdStr || !operatorKeyStr) {
        throw new Error("Hedera operator keys missing in .env");
    }
    operatorId = AccountId.fromString(operatorIdStr);
    operatorKey = PrivateKey.fromString(operatorKeyStr);
    client = Client.forTestnet();
    client.setOperator(operatorId, operatorKey);
}

// Keep tokenId in memory for demo. In prod persist to DB.
let TOKEN_ID: string | null = null;

export async function createTokenIfNotExists() {
    if (TOKEN_ID) return TOKEN_ID;
    if (MOCK_MODE) {
        TOKEN_ID = `MOCK-TOKEN-${Math.floor(Math.random() * 100000)}`;
        console.log("MOCK token created:", TOKEN_ID);
        return TOKEN_ID;
    }
    const decimals = 0;
    const tokenCreateTx = await new TokenCreateTransaction()
        .setTokenName("SolarShare eKWh")
        .setTokenSymbol("eKWH")
        .setTokenType(TokenType.FungibleCommon)
        .setDecimals(decimals)
        .setInitialSupply(0)
        .setTreasuryAccountId(operatorId!)
        .setSupplyType(TokenSupplyType.Infinite)
        .freezeWith(client!);

    const signed = await tokenCreateTx.sign(operatorKey!);
    const txResponse = await signed.execute(client!);
    const receipt = await txResponse.getReceipt(client!);
    TOKEN_ID = receipt.tokenId!.toString();
    console.log("Token created:", TOKEN_ID);
    return TOKEN_ID;
}

export async function mint(tokenId: string, amount: number) {
    if (MOCK_MODE) {
        console.log(`MOCK: mint ${amount} of ${tokenId}`);
        return { txHash: `MOCK-MINT-${Date.now()}` };
    }
    const mintTx = await new TokenMintTransaction()
        .setTokenId(tokenId)
        .setAmount(amount)
        .freezeWith(client!);
    const signed = await mintTx.sign(operatorKey!);
    const resp = await signed.execute(client!);
    const rcpt = await resp.getReceipt(client!);
    return { txHash: resp.transactionId.toString(), receipt: rcpt };
}

export async function associateIfNeeded(
    tokenId: string,
    accountIdStr: string,
    accountPrivateKey?: string
) {
    if (MOCK_MODE) {
        console.log(`MOCK: associated ${accountIdStr} with ${tokenId}`);
        return true;
    }
    // consumer must sign association with their key
    const assocTx = new TokenAssociateTransaction()
        .setAccountId(accountIdStr)
        .setTokenIds([tokenId])
        .freezeWith(client!);
    if (!accountPrivateKey)
        throw new Error("account private key required to associate");
    const signKey = PrivateKey.fromString(accountPrivateKey);
    const signed = await assocTx.sign(signKey);
    const resp = await signed.execute(client!);
    const rcpt = await resp.getReceipt(client!);
    return rcpt.status.toString();
}

export async function transferToken(
    tokenId: string,
    fromAccount: string,
    toAccount: string,
    amount: number,
    fromKey?: string
) {
    if (MOCK_MODE) {
        const txHash = `MOCK-TRANSFER-${Date.now()}-${Math.floor(
            Math.random() * 1000
        )}`;
        console.log(
            `MOCK transfer ${amount} ${tokenId} from ${fromAccount} to ${toAccount} -> ${txHash}`
        );
        return { txHash };
    }

    // For demo simplicity: operator signs as treasury if transferring from operator
    const transferTx = new TransferTransaction()
        .addTokenTransfer(tokenId, fromAccount, -amount)
        .addTokenTransfer(tokenId, toAccount, amount);

    // Decide who should sign: if fromAccount is operator, operatorKey signs; otherwise fromKey required.
    let tx = transferTx.freezeWith(client!);
    if (fromAccount === operatorId!.toString()) {
        tx = await tx.sign(operatorKey!);
    } else {
        if (!fromKey)
            throw new Error("fromKey required for non-operator token transfer");
        tx = await tx.sign(PrivateKey.fromString(fromKey));
    }
    const resp = await tx.execute(client!);
    const rcpt = await resp.getReceipt(client!);
    return { txHash: resp.transactionId.toString(), receipt: rcpt };
}
