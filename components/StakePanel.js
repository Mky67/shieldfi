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

const btnStyle = {
  padding: "12px 20px",
  borderRadius: 8,
  border: "none",
  fontSize: 15,
  cursor: "pointer",
  fontWeight: 600,
};

export default function StakePanel() {
  const account = useActiveAccount();
  const usdc = getUsdcContract();
  const staking = getStakingContract();
  const { mutate: sendTx } = useSendTransaction();

  const [amount, setAmount] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

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
      onSuccess: () => { setMessage(successMsg); refreshAll(); setBusy(false); },
      onError: (e) => { setMessage("Hata: " + e.message); setBusy(false); },
    });
  }

  const approve = () => runTx(
    prepareContractCall({ contract: usdc, method: "approve", params: [ADDRESSES.shieldStaking, amountUnits] }),
    "Onay verildi, şimdi stake edebilirsiniz."
  );
  const stake = () => runTx(
    prepareContractCall({ contract: staking, method: "stake", params: [amountUnits] }),
    "Stake edildi! ✅"
  );
  const withdraw = () => runTx(
    prepareContractCall({ contract: staking, method: "withdraw", params: [amountUnits] }),
    "Çekim başarılı! ✅ (Not: minimum 1 saat stake süresi şartı var)"
  );
  const claim = () => runTx(
    prepareContractCall({ contract: staking, method: "claimReward", params: [] }),
    "Ödül talep edildi! ✅"
  );
  const exit = () => runTx(
    prepareContractCall({ contract: staking, method: "exit", params: [] }),
    "Tüm stake ve ödül çekildi! ✅"
  );

  if (!account) {
    return <p style={{ color: "#888", textAlign: "center", padding: 40 }}>Devam etmek için cüzdanınızı bağlayın.</p>;
  }

  const apr = aprBps !== undefined ? (Number(aprBps) / 100).toFixed(2) : "-";

  return (
    <div style={{ maxWidth: 480, margin: "0 auto" }}>
      <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
        <Stat label="Stake Edilen (USDC)" value={fromUnits(stakedBalance)} />
        <Stat label="Kazanılan (EURC)" value={fromUnits(earned)} highlight />
        <Stat label="Tahmini APR" value={apr + "%"}
