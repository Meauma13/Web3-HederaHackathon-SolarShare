// Simple in-memory storage for users and usage events. Simple in-memory store for demo. Replace with Postgres/Prisma for production.
// In a real application, replace with a database.

export type User = {
    id: string;
    name?: string;
    role: "consumer" | "provider";
    hederaAccount?: string; // e.g., 0.0.x
    balance: number; // integer eKWh units
};

export type UsageEvent = {
    id: string;
    providerId: string;
    consumerId: string;
    kwh: number;
    txHash?: string;
    timestamp: string;
};

const users = new Map<string, User>();
const usageEvents: UsageEvent[] = [];

export function createUser(user: User) {
    users.set(user.id, user);
    return user;
}

export function getUser(id: string) {
    return users.get(id);
}

export function updateBalance(id: string, delta: number) {
    const u = users.get(id);
    if (!u) throw new Error("user not found");
    u.balance += delta;
    users.set(id, u);
    return u;
}

export function setBalance(id: string, value: number) {
    const u = users.get(id);
    if (!u) throw new Error("user not found");
    u.balance = value;
    users.set(id, u);
    return u;
}

export function listUsers() {
    return Array.from(users.values());
}

export function addUsageEvent(ev: UsageEvent) {
    usageEvents.push(ev);
    return ev;
}

export function listUsageEvents() {
    return usageEvents;
}
