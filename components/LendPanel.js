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
import StatRow from "./StatRow";
import Seal from "./Seal";

export default function LendPanel() {
  const account = useActiveAccount();
  const usdc = getUsdcContract();
  const lending = getLendingContract();
  const { mutate: sendTx, isPending } = useSendTransaction();

  const [amount, setAmount] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [ok, setOk] = useState(false);

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

  function runTx(tx, successMsg) {
    setBusy(true);
    setMessage("");
    sendTx(tx, {
      onSuccess: () => { setOk(true); setMessage(successMsg); setAmount(""); refreshAll(); setBusy(false); },
      onError: (e) => { setOk(false); setMessage(e.message); setBusy(false); },
    });
  }

  const handleApprove = () => runTx(
    prepareContractCall({ contract: usdc, method: "approve", params: [ADDRESSES.shieldLending, amountUnits] }),
    "Approved — you can now supply."
  );
  const handleSupply = () => runTx(
    prepareContractCall({ contract: lending, method: "supply", params: [amountUnits] }),
    "Supplied to the ledger."
  );
  const handleWithdraw = () => runTx(
    prepareContractCall({ contract: lending, method: "withdraw", params: [amountUnits] }),
    "Withdrawal complete."
  );
  const handleClaim = () => runTx(
    prepareContractCall({ contract: lending, method: "claimInterest", params: [] }),
    "Interest claimed."
  );

  if (!account) {
    return <p className="empty-state">Connect your wallet to view the ledger.</p>;
  }

  const apr = borrowRateBps !== undefined ? (Number(borrowRateBps) / 100).toFixed(2) : "—";

  return (
    <div>
      <StatRow
        items={[
          { label: "Supplied", value: fromUnits(suppliedBalance) },
          { label: "Earned Interest", value: fromUnits(earnedInterest), tone: "vault" },
          { label: "Current APR", value: apr + "%" },
        ]}
      />

      <input
        type="number"
        placeholder="0.00"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="field-input"
      />

      <div className="btn-row">
        {needsApproval ? (
          <button onClick={handleApprove} disabled={busy || isPending} className="btn btn--seal">
            {busy ? "…" : "1. Approve"}
          </button>
        ) : (
          <button onClick={handleSupply} disabled={busy || isPending || amountUnits <= 0n} className="btn btn--vault">
            {busy ? "…" : "Supply"}
          </button>
        )}
        <button onClick={handleWithdraw} disabled={busy || isPending || amountUnits <= 0n} className="btn btn--ghost">
          {busy ? "…" : "Withdraw"}
        </button>
      </div>

      <button onClick={handleClaim} disabled={busy || isPending} className="btn btn--ink btn--full">
        Claim Interest
      </button>

      {message && (
        <div className={`notice ${ok ? "notice--ok" : "notice--err"}`}>
          {ok && <Seal tone="vault" />}
          <span>{message}</span>
        </div>
      )}
    </div>
  );
}
