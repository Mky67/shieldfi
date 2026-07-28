import { useState } from "react";
import { bridgeUSDC } from "../lib/bridge";

const CHAINS = [
  { id: "Arc_Testnet", label: "Arc Testnet" },
  { id: "Ethereum_Sepolia", label: "Ethereum Sepolia" },
];

export default function BridgePanel() {
  const [fromChain, setFromChain] = useState("Arc_Testnet");
  const [toChain, setToChain] = useState("Ethereum_Sepolia");
  const [amount, setAmount] = useState("");
  const [busy, setBusy] = useState(false);
  const [step, setStep] = useState("");
  const [message, setMessage] = useState("");
  const [ok, setOk] = useState(false);

  function swapDirection() {
    setFromChain(toChain);
    setToChain(fromChain);
  }

  async function handleBridge() {
    if (!amount || parseFloat(amount) <= 0 || fromChain === toChain) return;
    setBusy(true);
    setMessage("");
    setStep("");
    try {
      const result = await bridgeUSDC({
        fromChain,
        toChain,
        amount,
        onEvent: (payload) => {
          const name = payload && payload.values && payload.values.name;
          if (name) setStep(name);
        },
      });
      if (result.state === "error") {
        setOk(false);
        setMessage("Bridge failed: " + (result.error && result.error.message ? result.error.message : "unknown error"));
      } else {
        setOk(true);
        setMessage("Bridge complete — native USDC minted on the destination chain.");
      }
    } catch (e) {
      setOk(false);
      setMessage(e && e.message ? e.message : String(e));
    }
    setBusy(false);
  }

  const fromLabel = CHAINS.find((c) => c.id === fromChain)?.label;
  const toLabel = CHAINS.find((c) => c.id === toChain)?.label;

  return (
    <div>
      <h3 className="section-title">Bridge USDC — Circle CCTP</h3>

      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <select
          value={fromChain}
          onChange={(e) => setFromChain(e.target.value)}
          className="field-input"
          style={{ marginBottom: 0 }}
        >
          {CHAINS.map((c) => (
            <option key={c.id} value={c.id}>{c.label}</option>
          ))}
        </select>
        <button
          type="button"
          onClick={swapDirection}
          className="btn btn--ghost"
          style={{ flex: "0 0 auto", padding: "13px 14px" }}
        >
          ⇄
        </button>
        <select
          value={toChain}
          onChange={(e) => setToChain(e.target.value)}
          className="field-input"
          style={{ marginBottom: 0 }}
        >
          {CHAINS.map((c) => (
            <option key={c.id} value={c.id}>{c.label}</option>
          ))}
        </select>
      </div>

      <input
        type="number"
        placeholder="0.00"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="field-input"
      />

      <button
        onClick={handleBridge}
        disabled={busy || fromChain === toChain || !amount}
        className="btn btn--vault btn--full"
      >
        {busy ? (step || "Bridging…") : "Bridge"}
      </button>

      {message && (
        <div className={`notice ${ok ? "notice--ok" : "notice--err"}`}>
          <span>{message}</span>
        </div>
      )}

      <p className="hint">
        Native burn-and-mint via Circle's CCTP — no wrapped tokens. Your wallet
        needs native gas on both {fromLabel} and {toLabel}.
      </p>
    </div>
  );
}
