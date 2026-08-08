import { useState } from "react";
import { depositToGateway, getGatewayBalance, spendFromGateway } from "../lib/gateway";

const CHAINS = [
  { id: "Arc_Testnet", label: "Arc Testnet" },
  { id: "Ethereum_Sepolia", label: "Ethereum Sepolia" },
];

export default function GatewayPanel() {
  const [depositChain, setDepositChain] = useState("Arc_Testnet");
  const [depositAmount, setDepositAmount] = useState("");
  const [spendFromChain, setSpendFromChain] = useState("Arc_Testnet");
  const [spendToChain, setSpendToChain] = useState("Ethereum_Sepolia");
  const [spendAmount, setSpendAmount] = useState("");

  const [balance, setBalance] = useState(null);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [ok, setOk] = useState(false);

  async function refreshBalance() {
    setBalanceLoading(true);
    try {
      const result = await getGatewayBalance();
      setBalance(result);
    } catch (e) {
      setOk(false);
      setMessage(e && e.message ? e.message : String(e));
    }
    setBalanceLoading(false);
  }

  async function handleDeposit() {
    if (!depositAmount || parseFloat(depositAmount) <= 0) return;
    setBusy(true);
    setMessage("");
    try {
      await depositToGateway({ chain: depositChain, amount: depositAmount });
      setOk(true);
      setMessage("Deposited into your unified Gateway balance.");
      setDepositAmount("");
      await refreshBalance();
    } catch (e) {
      setOk(false);
      setMessage(e && e.message ? e.message : String(e));
    }
    setBusy(false);
  }

  async function handleSpend() {
    if (!spendAmount || parseFloat(spendAmount) <= 0 || spendFromChain === spendToChain) return;
    setBusy(true);
    setMessage("");
    try {
      await spendFromGateway({ fromChain: spendFromChain, toChain: spendToChain, amount: spendAmount });
      setOk(true);
      setMessage("Instant transfer complete — USDC available on the destination chain.");
      setSpendAmount("");
      await refreshBalance();
    } catch (e) {
      setOk(false);
      setMessage(e && e.message ? e.message : String(e));
    }
    setBusy(false);
  }

  return (
    <div>
      <h3 className="section-title">Unified Balance — Circle Gateway</h3>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <div className="stat-label">Unified USDC Balance</div>
          <div className="stat-value stat-value--vault" style={{ fontSize: 24 }}>
            {balance ? Number(balance.totalConfirmedBalance || 0).toFixed(4) : "—"}
          </div>
        </div>
        <button onClick={refreshBalance} disabled={balanceLoading} className="btn btn--ghost" style={{ flex: "0 0 auto" }}>
          {balanceLoading ? "…" : "Refresh"}
        </button>
      </div>

      <h3 className="section-title">1 · Fund your unified balance</h3>
      <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
        <select value={depositChain} onChange={(e) => setDepositChain(e.target.value)} className="field-input" style={{ marginBottom: 0 }}>
          {CHAINS.map((c) => (
            <option key={c.id} value={c.id}>{c.label}</option>
          ))}
        </select>
        <input
          type="number"
          placeholder="0.00"
          value={depositAmount}
          onChange={(e) => setDepositAmount(e.target.value)}
          className="field-input"
          style={{ marginBottom: 0 }}
        />
      </div>
      <button onClick={handleDeposit} disabled={busy || !depositAmount} className="btn btn--vault btn--full" style={{ marginBottom: 24 }}>
        Deposit to Gateway
      </button>

      <h3 className="section-title">2 · Access it instantly on any chain</h3>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <select value={spendFromChain} onChange={(e) => setSpendFromChain(e.target.value)} className="field-input" style={{ marginBottom: 0 }}>
          {CHAINS.map((c) => (
            <option key={c.id} value={c.id}>{c.label}</option>
          ))}
        </select>
        <span style={{ color: "#999" }}>→</span>
        <select value={spendToChain} onChange={(e) => setSpendToChain(e.target.value)} className="field-input" style={{ marginBottom: 0 }}>
          {CHAINS.map((c) => (
            <option key={c.id} value={c.id}>{c.label}</option>
          ))}
        </select>
      </div>
      <input
        type="number"
        placeholder="0.00"
        value={spendAmount}
        onChange={(e) => setSpendAmount(e.target.value)}
        className="field-input"
      />
      <button onClick={handleSpend} disabled={busy || spendFromChain === spendToChain || !spendAmount} className="btn btn--ink btn--full">
        {busy ? "Working…" : "Spend Instantly (<500ms)"}
      </button>

      {message && (
        <div className={`notice ${ok ? "notice--ok" : "notice--err"}`}>
          <span>{message}</span>
        </div>
      )}

      <p className="hint">
        Deposit once, access your USDC instantly on any Gateway-supported chain —
        no repeated bridging. Non-custodial: only you can move your funds.
      </p>
    </div>
  );
}
