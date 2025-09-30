/* import React, { useState } from "react";
import { topup, listUsers } from "../api";

export default function TopUp({ refreshUsers }) {
    const [userId, setUserId] = useState("");
    const [amount, setAmount] = useState(5);

    const handleTopUp = async () => {
        if (!userId) return alert("select user id");
        const res = await topup({ userId, amount });
        alert(JSON.stringify(res.data));
        refreshUsers && refreshUsers();
    };

    return (
        <div>
            <div>
                <label>User ID</label>
                <input
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="user-id"
                />
            </div>
            <div>
                <label>Amount (eKWh)</label>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                />
            </div>
            <button onClick={handleTopUp}>Buy Credits</button>
            <p>
                Tip: Use the register endpoint from backend to create
                consumer/provider first.
            </p>
        </div>
    );
}
 */

import { useState } from "react";
import { api } from "../api";

export default function TopUp() {
    const [id, setId] = useState("");
    const [amount, setAmount] = useState(10);
    const [msg, setMsg] = useState("");

    async function submit() {
        try {
            const res = await api.post("/topup", { id, amount });
            setMsg(`Balance is now ${res.data.balance}`);
        } catch (e) {
            setMsg("Error: " + e.response?.data?.error);
        }
    }

    return (
        <div>
            <h2>Top Up eKWh</h2>
            <input
                placeholder="User ID"
                value={id}
                onChange={(e) => setId(e.target.value)}
            />
            <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(+e.target.value)}
            />
            <button onClick={submit}>Top Up</button>
            <div>{msg}</div>
        </div>
    );
}
