/* import React, { useEffect, useState } from "react";
import { getBalance, listUsage } from "../api";

export default function ProviderDash({ users }) {
    const [selected, setSelected] = useState("");
    const [balanceInfo, setBalanceInfo] = useState(null);
    const [usage, setUsage] = useState([]);

    useEffect(() => {
        async function loadUsage() {
            const res = await listUsage();
            if (res.data.ok) setUsage(res.data.usage);
        }
        loadUsage();
    }, []);

    const fetchBalance = async () => {
        if (!selected) return;
        const res = await getBalance(selected);
        if (res.data.ok) setBalanceInfo(res.data);
    };

    return (
        <div>
            <select onChange={(e) => setSelected(e.target.value)}>
                <option value="">--Select provider--</option>
                {users
                    .filter((u) => u.role === "provider")
                    .map((u) => (
                        <option key={u.id} value={u.id}>
                            {u.id} ({u.name || "no-name"})
                        </option>
                    ))}
            </select>
            <button onClick={fetchBalance}>Get Balance</button>
            <div>
                <h4>Balance</h4>
                <pre>{JSON.stringify(balanceInfo, null, 2)}</pre>
            </div>
            <div>
                <h4>Usage Events</h4>
                <pre>{JSON.stringify(usage, null, 2)}</pre>
            </div>
        </div>
    );
}
 */

import { useEffect, useState } from "react";
import { api } from "../api";

export default function ProviderDash() {
    const [users, setUsers] = useState([]);
    const [usage, setUsage] = useState([]);

    useEffect(() => {
        api.get("/users").then((r) => setUsers(r.data));
        api.get("/usage").then((r) => setUsage(r.data));
    }, []);

    return (
        <div>
            <h2>Provider Dashboard</h2>
            <h3>Users</h3>
            <ul>
                {users.map((u) => (
                    <li key={u.id}>
                        {u.id} ({u.role}) - balance: {u.balance}
                    </li>
                ))}
            </ul>
            <h3>Usage Events</h3>
            <ul>
                {usage.map((ev) => (
                    <li key={ev.id}>
                        {ev.consumerId}→{ev.providerId}: {ev.kwh}kWh (
                        {ev.txHash})
                    </li>
                ))}
            </ul>
        </div>
    );
}
