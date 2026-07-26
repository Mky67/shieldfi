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
import StatRow from "./StatRow";
import Seal from "./Seal";

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
  const [ok, setOk] = useState(false);

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
      onSuccess: () => { setOk(true); setMessage(successMsg); refreshAll(); setBusy(false); },
      onError: (e) => { setOk(false); setMessage(e.message); setBusy(false); },
    });
  }

  const approveCollateral = () => runTx(
    prepareContractCall({ contract: eurc, method: "approve", params: [ADDRESSES.shieldLending, collateralUnits] }),
    "Approved — you can now deposit collateral."
  );
  const depositCollateral = () => runTx(
    prepareContractCall({ contract: lending, method: "depositCollateral", params: [collateralUnits] }),
    "Collateral deposited."
  );
  const withdrawCollateral = () => runTx(
    prepareContractCall({ contract: lending, method: "withdrawCollateral", params: [collateralUnits] }),
    "Collateral withdrawn."
  );
  const borrow = () => runTx(
    prepareContractCall({ contract: lending, method: "borrow", params: [borrowUnits] }),
    "USDC borrowed."
  );
  const approveRepay = () => runTx(
    prepareContractCall({ contract: usdc, method: "approve", params: [ADDRESSES.shieldLending, borrowUnits] }),
    "Approved — you can now repay."
  );
  const repay = () => runTx(
    prepareContractCall({ contract: lending, method: "repay", params: [borrowUnits] }),
    "Repayment complete."
  );

  if (!account) {
    return <p className="empty-state">Connect your wallet to view the ledger.</p>;
  }

  return (
    <div>
      <StatRow
        items={[
          { label: "Collateral (EURC)", value: fromUnits(collateralBalance) },
          { label: "Your Debt (USDC)", value: fromUnits(borrowedBalance), tone: "seal" },
          { label: "Max Borrowable", value: fromUnits(maxBorrowable) },
        ]}
      />

      <h3 className="section-title">1 · Deposit Collateral (EURC)</h3>
      <input
        type="number"
        placeholder="0.00"
        value={collateralAmount}
        onChange={(e) => setCollateralAmount(e.target.value)}
        className="field-input"
      />
      <div className="btn-row">
        {needsCollateralApproval ? (
          <button onClick={approveCollateral} disabled={busy} className="btn btn--seal">Approve</button>
        ) : (
          <button onClick={depositCollateral} disabled={busy || collateralUnits <= 0n} className="btn btn--vault">Deposit</button>
        )}
        <button onClick={withdrawCollateral} disabled={busy || collateralUnits <= 0n} className="btn btn--ghost">Withdraw</button>
      </div>

      <h3 className="section-title" style={{ marginTop: 20 }}>2 · Borrow / Repay (USDC)</h3>
      <input
        type="number"
        placeholder="0.00"
        value={borrowAmount}
        onChange={(e) => setBorrowAmount(e.target.value)}
        className="field-input"
      />
      <div className="btn-row">
        <button onClick={borrow} disabled={busy || borrowUnits <= 0n} className="btn btn--vault">Borrow</button>
        {needsRepayApproval ? (
          <button onClick={approveRepay} disabled={busy} className="btn btn--seal">Approve</button>
        ) : (
          <button onClick={repay} disabled={busy || borrowUnits <= 0n} className="btn btn--ghost">Repay</button>
        )}
      </div>

      {message && (
        <div className={`notice ${ok ? "notice--ok" : "notice--err"}`}>
          {ok && <Seal tone="seal" />}
          <span>{message}</span>
        </div>
      )}

      <p className="hint">LTV 90% · Liquidation threshold 95% — stablecoin/stablecoin pair</p>
    </div>
  );
}
