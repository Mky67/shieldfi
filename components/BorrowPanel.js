import { useState } from "react";
import { useActiveAccount, useReadContract, useSendTransaction } from "thirdweb/react";
import { prepareContractCall } from "thirdweb";
import {
  getEurcContract,
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

export default function BorrowPanel() {
  const account = useActiveAccount();
  const eurc = getEurcContract();
  const usdc = getUsdcContract();
  const lending = getLendingContract();
  const { mutate: sendTx } = useSendTransaction();

  const [collateralAmount, setCollateralAmount] = useState("");
  const [borrowAmount, setBorrowAmount] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const zero = "0x0000000000000000000000000000000000000000";
  const addr = account?.address || zero;

  const { data: collateralBalance, refetch: refetchCollateral } = useReadContract({
    contract: lending, method: "collateralBalance", params: [addr], queryOptions: { enabled: !!account },
  });
  const { data: borrowedBalance, refetch: refetchBorrowed } = useReadContract({
    contract: lending, method: "borrowedBalance", params: [addr], queryOptions: { enabled: !!account },
  });
  const { data: maxBorrowable, refetch: refetchMax } = useReadContract({
    contract: lending, method: "maxBorrowable", params: [addr], queryOptions: { enabled: !!account },
  });
  const { data: eurcAllowance, refetch: refetchEurcAllowance } = useReadContract({
    contract: eurc, method: "allowance", params: [addr, ADDRESSES.shieldLending], queryOptions: { enabled: !!account },
  });
  const { data: usdcAllowance, refetch: refetchUsdcAllowance } = useReadContract({
    contract: usdc, method: "allowance", params: [addr, ADDRESSES.shieldLending], queryOptions: { enabled: !!account },
  });

  function refreshAll() {
    refetchCollateral();
    refetchBorrowed();
    refetchMax();
    refetchEurcAllowance();
    refetchUsdcAllowance();
  }

  const collateralUnits = toUnits(collateralAmount);
  const borrowUnits = toUnits(borrowAmount);
  const needsCollateralApproval = eurcAllowance !== undefined && collateralUnits > 0n && eurcAllowance < collateralUnits;
  const needsRepayApproval = usdcAllowance !== undefined && borrowUnits > 0n && usdcAllowance < borrowUnits;

  function runTx(tx, successMsg) {
    setBusy(true);
    setMessage("");
    sendTx(tx, {
      onSuccess: () => { setMessage(successMsg); refreshAll(); setBusy(false); },
      onError: (e) => { setMessage("Hata: " + e.message); setBusy(false); },
    });
  }

  const approveCollateral = () => runTx(
    prepareContractCall({ contract: eurc, method: "approve", params: [ADDRESSES.shieldLending, collateralUnits] }),
    "Onay verildi, şimdi teminat yatırabilirsiniz."
  );
  const depositCollateral = () => runTx(
    prepareContractCall({ contract: lending, method: "depositCollateral", params: [collateralUnits] }),
    "Teminat yatırıldı! ✅"
  );
  const withdrawCollateral = () => runTx(
    prepareContractCall({ contract: lending, method: "withdrawCollateral", params: [collateralUnits] }),
    "Teminat çekildi! ✅"
  );
  const borrow = () => runTx(
    prepareContractCall({ contract: lending, method: "borrow", params: [borrowUnits] }),
    "USDC borcu alındı! ✅"
  );
  const approveRepay = () => runTx(
    prepareContractCall({ contract: usdc, method: "approve", params: [ADDRESSES.shieldLending, borrowUnits] }),
    "Onay verildi, şimdi geri ödeyebilirsiniz."
  );
  const repay = () => runTx(
    prepareContractCall({ contract: lending, method: "repay", params: [borrowUnits] }),
    "Geri ödeme yapıldı! ✅"
  );

  if (!account) {
    return <p style={{ color: "#888", textAlign: "center", padding: 40 }}>Devam etmek için cüzdanınızı bağlayın.</p>;
  }

  return (
    <div style={{ maxWidth: 480, margin: "0 auto" }}>
      <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
        <Stat label="Teminat (EURC)" value={fromUnits(collateralBalance)} />
        <Stat label="Borcunuz (USDC)" value={fromUnits(borrowedBalance)} highlight />
        <Stat label="Maks. Borç" value={fromUnits(maxBorrowable)} />
      </div>

      <SectionTitle>1. Teminat Yatır (EURC)</SectionTitle>
      <input
        type="number"
        placeholder="EURC miktarı"
        value={collateralAmount}
        onChange={(e) => setCollateralAmount(e.target.value)}
        style={inputStyle}
      />
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        {needsCollateralApproval ? (
          <button onClick={approveCollateral} disabled={busy} style={{ ...btnStyle, background: "#f0a020", color: "#fff", flex: 1 }}>Onayla</button>
        ) : (
          <button onClick={depositCollateral} disabled={busy || collateralUnits <= 0n} style={{ ...btnStyle, background: "#0066ff", color: "#fff", flex: 1 }}>Teminat Yatır</button>
        )}
        <button onClick={withdrawCollateral} disabled={busy || collateralUnits <= 0n} style={{ ...btnStyle, background: "#eee", color: "#333", flex: 1 }}>Teminat Çek</button>
      </div>

      <SectionTitle>2. Borç Al / Öde (USDC)</SectionTitle>
      <input
        type="number"
        placeholder="USDC miktarı"
        value={borrowAmount}
        onChange={(e) => setBorrowAmount(e.target.value)}
        style={inputStyle}
      />
      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={borrow} disabled={busy || borrowUnits <= 0n} style={{ ...btnStyle, background: "#0066ff", color: "#fff", flex: 1 }}>Borç Al</button>
        {needsRepayApproval ? (
          <button onClick={approveRepay} disabled={busy} style={{ ...btnStyle, background: "#f0a020", color: "#fff", flex: 1 }}>Onayla</button>
        ) : (
          <button onClick={repay} disabled={busy || borrowUnits <= 0n} style={{ ...btnStyle, background: "#eee", color: "#333", flex: 1 }}>Geri Öde</button>
        )}
      </div>

      {message && <p style={{ textAlign: "center", marginTop: 16, color: message.includes("Hata") ? "#d33" : "#0a0" }}>{message}</p>}

      <p style={{ fontSize: 12, color: "#999", marginTop: 20, textAlign: "center" }}>
        LTV %90 · Likidasyon eşiği %95 (USDC/EURC stablecoin çifti olduğu için yüksek LTV)
      </p>
    </div>
  );
}

const inputStyle = { width: "100%", padding: 14, borderRadius: 8, border: "1px solid #ddd", fontSize: 16, marginBottom: 12, boxSizing: "border-box" };

function SectionTitle({ children }) {
  return <h3 style={{ fontSize: 14, color: "#666", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>{children}</h3>;
}

function Stat({ label, value, highlight }) {
  return (
    <div style={{ flex: 1, minWidth: 120, background: highlight ? "#fff0e6" : "#f5f5f5", padding: 14, borderRadius: 10, textAlign: "center" }}>
      <div style={{ fontSize: 12, color: "#888" }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 700 }}>{value}</div>
    </div>
  );
}
