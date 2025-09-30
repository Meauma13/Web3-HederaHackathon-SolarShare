// Creates Hedera accounts (only used when MOCK_MODE=false and you have operator keys).

import { Client, PrivateKey, AccountCreateTransaction, AccountId } from "@hashgraph/sdk";
import dotenv from "dotenv";
dotenv.config();

const operatorIdStr = process.env.HEDERA_OPERATOR_ID;
const operatorKeyStr = process.env.HEDERA_OPERATOR_KEY;
const MOCK_MODE = process.env.MOCK_MODE === "true";

export async function createHederaAccount(): Promise<{ accountId?: string; privateKey?: string }> {
  if (MOCK_MODE) {
    // Simulated account id
    const fakeId = `0.0.${Math.floor(10000 + Math.random() * 90000)}`;
    const fakeKey = `MOCK-KEY-${Math.random().toString(36).slice(2, 10)}`;
    return { accountId: fakeId, privateKey: fakeKey };
  }

  if (!operatorIdStr || !operatorKeyStr) {
    throw new Error("Hedera operator not configured in env");
  }

  const client = Client.forTestnet();
  client.setOperator(AccountId.fromString(operatorIdStr), PrivateKey.fromString(operatorKeyStr));

  const newKey = PrivateKey.generateED25519();
  const newAccount = await new AccountCreateTransaction()
    .setKey(newKey.publicKey)
    .setInitialBalance(1) // tiny HBAR for account
    .execute(client);

  const receipt = await newAccount.getReceipt(client);
  return { accountId: receipt.accountId?.toString(), privateKey: newKey.toStringRaw() };
}