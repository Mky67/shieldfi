import { useState } from "react";
import { useActiveAccount, useReadContract, useSendTransaction } from "thirdweb/react";
import { prepareContractCall } from "thirdweb";
import {
  getUsdcContract,
  getLendingContract,
  ADDRESSES,
  toUnits,
  fromUnits,
} from "../lib/contracts";

const btnStyle = {
  padding: "12px 20px",
  borderRadius: 8,
  border: "none",
  fontSize: 15,
  cursor: "pointer",
  fontWeight: 600,
};

export default function LendPanel() {
  const account = useActiveAccount();
  const usdc = getUsdcContract();
  const lending = getLendingContract();
  const { mutate: sendTx, isPending } = useSendTransaction();

  const [amount, setAmount] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const zero = "0x0000000000000000000000000000000000000000";
  const addr = account?.address || zero;

  const { data: suppliedBalance, refetch: refetchSupplied } = useReadContract({
    contract: lending, method: "suppliedBalance", params: [addr], queryOptions: { enabled: !!account },
  });
  const { data: earnedInterest, refetch: refetchEarned } = useReadContract({
    contract: lending, method: "earnedInterest", params: [addr], queryOptions: { enabled: !!account },
  });
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    contract: usdc, method: "allowance", params: [addr, ADDRESSES.shieldLending], queryOptions: { enabled: !!account },
  });
  const { data: borrowRateBps } = useReadContract({
    contract: lending, method: "borrowRateBps", params: [],
  });

  function refreshAll() {
    refetchSupplied();
    refetchEarned();
    refetchAllowance();
  }

  const amountUnits = toUnits(amount);
  const needsApproval = allowance !== undefined && amountUnits > 0n && allowance < amountUnits;

  async function handleApprove() {
    setBusy(true);
    setMessage("");
    try {
      const tx = prepareContractCall({
        contract: usdc,
        method: "approve",
        params: [ADDRESSES.shieldLending, amountUnits],
      });
      sendTx(tx, {
        onSuccess: () => { setMessage("Onay verildi, şimdi 'Yatır' butonuna basabilirsiniz."); refetchAllowance(); setBusy(false); },
        onError: (e) => { setMessage("Hata: " + e.message); setBusy(false); },
      });
    } catch (e) {
      setMessage("Hata: " + e.message);
      setBusy(false);
    }
  }

  async function handleSupply() {
    if (amountUnits <= 0n) return;
    setBusy(true);
    setMessage("");
    const tx = prepareContractCall({ contract: lending, method: "supply", params: [amountUnits] });
    sendTx(tx, {
      onSuccess: () => { setMessage("Yatırım başarılı! ✅"); setAmount(""); refreshAll(); setBusy(false); },
      onError: (e) => { setMessage("Hata: " + e.message); setBusy(false); },
    });
  }

  async function handleWithdraw() {
    if (amountUnits <= 0n) return;
    setBusy(true);
    setMessage("");
    const tx = prepareContractCall({ contract: lending, method: "withdraw", params: [amountUnits] });
    sendTx(tx, {
      onSuccess: () => { setMessage("Çekim başarılı! ✅"); setAmount(""); refreshAll(); setBusy(false); },
      onError: (e) => { setMessage("Hata: " + e.message); setBusy(false); },
    });
  }

  async function handleClaim() {
    setBusy(true);
    setMessage("");
    const tx = prepareContractCall({ contract: lending, method: "claimInterest", params: [] });
    sendTx(tx, {
      onSuccess: () => { setMessage("Faiz talep edildi! ✅"); refreshAll(); setBusy(false); },
      onError: (e) => { setMessage("Hata: " + e.message); setBusy(false); },
    });
  }

  if (!account) {
    return <p style={{ color: "#888", textAlign: "center", padding: 40 }}>Devam etmek için cüzdanınızı bağlayın.</p>;
  }

  const apr = borrowRateBps !== undefined ? (Number(borrowRateBps) / 100).toFixed(2) : "-";

  return (
    <div style={{ maxWidth: 480, margin: "0 auto" }}>
      <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
        <Stat label="Yatırdığınız USDC" value={fromUnits(suppliedBalance)} />
        <Stat label="Kazanılan Faiz" value={fromUnits(earnedInterest)} highlight />
        <Stat label="Güncel APR" value={apr + "%"} />
      </div>

      <input
        type="number"
        placeholder="USDC miktarı"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{ width: "100%", padding: 14, borderRadius: 8, border: "1px solid #ddd", fontSize: 16, marginBottom: 12, boxSizing: "border-box" }}
      />

      <div style={{ display: "flex", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
        {needsApproval ? (
          <button onClick={handleApprove} disabled={busy || isPending} style={{ ...btnStyle, background: "#f0a020", color: "#fff", flex: 1 }}>
            {busy ? "..." : "1. Onayla (Approve)"}
          </button>
        ) : (
          <button onClick={handleSupply} disabled={busy || isPending || amountUnits <= 0n} style={{ ...btnStyle, background: "#0066ff", color: "#fff", flex: 1 }}>
            {busy ? "..." : "Yatır (Supply)"}
          </button>
        )}
        <button onClick={handleWithdraw} disabled={busy || isPending || amountUnits <= 0n} style={{ ...btnStyle, background: "#eee", color: "#333", flex: 1 }}>
          {busy ? "..." : "Çek (Withdraw)"}
        </button>
      </div>

      <button onClick={handleClaim} disabled={busy || isPending} style={{ ...btnStyle, background: "#00b37e", color: "#fff", width: "100%" }}>
        Faizi Talep Et (Claim Interest)
      </button>

      {message && <p style={{ textAlign: "center", marginTop: 16, color: message.includes("Hata") ? "#d33" : "#0a0" }}>{message}</p>}
    </div>
  );
}

function Stat({ label, value, highlight }) {
  return (
    <div style={{ flex: 1, minWidth: 120, background: highlight ? "#e6fff5" : "#f5f5f5", padding: 14, borderRadius: 10, textAlign: "center" }}>
      <div style={{ fontSize: 12, color: "#888" }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 700 }}>{value}</div>
    </div>
  );
}
