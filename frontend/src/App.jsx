import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import TopUp from "./pages/TopUp.jsx";
import Consume from "./pages/Consume.jsx";
import ProviderDash from "./pages/ProviderDash.jsx";

export default function App() {
    return (
        <BrowserRouter>
            <nav style={{ display: "flex", gap: "1rem", padding: "1rem" }}>
                <Link to="/">Top Up</Link>
                <Link to="/consume">Consume</Link>
                <Link to="/provider">Provider Dashboard</Link>
            </nav>
            <Routes>
                <Route path="/" element={<TopUp />} />
                <Route path="/consume" element={<Consume />} />
                <Route path="/provider" element={<ProviderDash />} />
            </Routes>
        </BrowserRouter>
    );
}
