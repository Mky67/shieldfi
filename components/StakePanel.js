import { useState } from "react";
import { useActiveAccount, useReadContract, useSendTransaction } from "thirdweb/react";
import { prepareContractCall } from "thirdweb";
import {
  getUsdcContract,
  getStakingContract,
  ADDRESSES,
  toUnits,
  fromUnits,
} from "../lib/contracts";
import StatRow from "./StatRow";
import Seal from "./Seal";

export default function StakePanel() {
  const account = useActiveAccount();
  const usdc = getUsdcContract();
  const staking = getStakingContract();
  const { mutate: sendTx } = useSendTransaction();

  const [amount, setAmount] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [ok, setOk] = useState(false);

  const zero = "0x0000000000000000000000000000000000000000";
  const addr = account?.address || zero;

  const { data: stakedBalance, refetch: refetchStaked } = useReadContract({
    contract: staking, method: "stakedBalance", params: [addr], queryOptions: { enabled: !!account },
  });
  const { data: earned, refetch: refetchEarned } = useReadContract({
    contract: staking, method: "earned", params: [addr], queryOptions: { enabled: !!account },
  });
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    contract: usdc, method: "allowance", params: [addr, ADDRESSES.shieldStaking], queryOptions: { enabled: !!account },
  });
  const { data: aprBps } = useReadContract({
    contract: staking, method: "estimatedAprBps", params: [],
  });

  function refreshAll() {
    refetchStaked();
    refetchEarned();
    refetchAllowance();
  }

  const amountUnits = toUnits(amount);
  const needsApproval = allowance !== undefined && amountUnits > 0n && allowance < amountUnits;

  function runTx(tx, successMsg) {
    setBusy(true);
    setMessage("");
    sendTx(tx, {
      onSuccess: () => { setOk(true); setMessage(successMsg); refreshAll(); setBusy(false); },
      onError: (e) => { setOk(false); setMessage(e.message); setBusy(false); },
    });
  }

  const approve = () => runTx(
    prepareContractCall({ contract: usdc, method: "approve", params: [ADDRESSES.shieldStaking, amountUnits] }),
    "Approved — you can now stake."
  );
  const stake = () => runTx(
    prepareContractCall({ contract: staking, method: "stake", params: [amountUnits] }),
    "Staked."
  );
  const withdraw = () => runTx(
    prepareContractCall({ contract: staking, method: "withdraw", params: [amountUnits] }),
    "Withdrawal complete. (Minimum 1-hour stake duration applies.)"
  );
  const claim = () => runTx(
    prepareContractCall({ contract: staking, method: "claimReward", params: [] }),
    "Reward claimed."
  );
  const exit = () => runTx(
    prepareContractCall({ contract: staking, method: "exit", params: [] }),
    "Fully withdrawn and claimed."
  );

  if (!account) {
    return <p className="empty-state">Connect your wallet to view the ledger.</p>;
  }

  const apr = aprBps !== undefined ? (Number(aprBps) / 100).toFixed(2) : "—";

  return (
    <div>
      <StatRow
        items={[
          { label: "Staked (USDC)", value: fromUnits(stakedBalance) },
          { label: "Earned (EURC)", value: fromUnits(earned), tone: "vault" },
          { label: "Estimated APR", value: apr + "%" },
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
          <button onClick={approve} disabled={busy} className="btn btn--seal">Approve</button>
        ) : (
          <button onClick={stake} disabled={busy || amountUnits <= 0n} className="btn btn--vault">Stake</button>
        )}
        <button onClick={withdraw} disabled={busy || amountUnits <= 0n} className="btn btn--ghost">Withdraw</button>
      </div>

      <div className="btn-row">
        <button onClick={claim} disabled={busy} className="btn btn--ink">Claim Reward</button>
        <button onClick={exit} disabled={busy} className="btn btn--ghost">Exit (Withdraw + Claim)</button>
      </div>

      {message && (
        <div className={`notice ${ok ? "notice--ok" : "notice--err"}`}>
          {ok && <Seal tone="vault" />}
          <span>{message}</span>
        </div>
      )}
    </div>
  );
}
