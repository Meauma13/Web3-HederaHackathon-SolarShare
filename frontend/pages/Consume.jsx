/* import React, { useState } from "react";
import { consume } from "../api";

export default function Consume({ users }) {
    const [consumerId, setConsumerId] = useState("");
    const [providerId, setProviderId] = useState("");
    const [kwh, setKwh] = useState(1);

    const handleConsume = async () => {
        if (!consumerId || !providerId)
            return alert("select consumer and provider");
        const res = await consume({ consumerId, providerId, kwh });
        alert(JSON.stringify(res.data));
    };

    return (
        <div>
            <div>
                <select onChange={(e) => setConsumerId(e.target.value)}>
                    <option value="">--Select consumer--</option>
                    {users
                        .filter((u) => u.role === "consumer")
                        .map((u) => (
                            <option key={u.id} value={u.id}>
                                {u.id} ({u.name || "no-name"})
                            </option>
                        ))}
                </select>
            </div>
            <div>
                <select onChange={(e) => setProviderId(e.target.value)}>
                    <option value="">--Select provider--</option>
                    {users
                        .filter((u) => u.role === "provider")
                        .map((u) => (
                            <option key={u.id} value={u.id}>
                                {u.id} ({u.name || "no-name"})
                            </option>
                        ))}
                </select>
            </div>
            <div>
                <label>kWh</label>
                <input
                    type="number"
                    value={kwh}
                    onChange={(e) => setKwh(Number(e.target.value))}
                />
            </div>
            <button onClick={handleConsume}>Simulate Consumption</button>
        </div>
    );
}
 */

import { useState } from "react";
import { api } from "../api";

export default function Consume() {
    const [consumerId, setConsumerId] = useState("");
    const [providerId, setProviderId] = useState("");
    const [kwh, setKwh] = useState(1);
    const [msg, setMsg] = useState("");

    async function submit() {
        try {
            const res = await api.post("/consume", {
                consumerId,
                providerId,
                kwh,
            });
            setMsg(`Done: ${res.data.event.txHash}`);
        } catch (e) {
            setMsg("Error: " + e.response?.data?.error);
        }
    }

    return (
        <div>
            <h2>Consume Energy</h2>
            <input
                placeholder="Consumer ID"
                value={consumerId}
                onChange={(e) => setConsumerId(e.target.value)}
            />
            <input
                placeholder="Provider ID"
                value={providerId}
                onChange={(e) => setProviderId(e.target.value)}
            />
            <input
                type="number"
                value={kwh}
                onChange={(e) => setKwh(+e.target.value)}
            />
            <button onClick={submit}>Consume</button>
            <div>{msg}</div>
        </div>
    );
}
