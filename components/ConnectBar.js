import { ConnectButton, useActiveAccount, useReadContract } from "thirdweb/react";
import { client, arcTestnet, getUsdcContract, getEurcContract, fromUnits } from "../lib/contracts";

export default function ConnectBar() {
  const account = useActiveAccount();
  const usdcContract = getUsdcContract();
  const eurcContract = getEurcContract();

  const { data: usdcBalance, refetch: refetchUsdc } = useReadContract({
    contract: usdcContract,
    method: "balanceOf",
    params: [account?.address || "0x0000000000000000000000000000000000000000"],
    queryOptions: { enabled: !!account },
  });

  const { data: eurcBalance, refetch: refetchEurc } = useReadContract({
    contract: eurcContract,
    method: "balanceOf",
    params: [account?.address || "0x0000000000000000000000000000000000000000"],
    queryOptions: { enabled: !!account },
  });

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 16,
        padding: "16px 24px",
        borderBottom: "1px solid #eee",
        marginBottom: 24,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 26 }}>🛡️</span>
        <div>
          <div style={{ fontWeight: 700, fontSize: 20 }}>ShieldFi</div>
          <div style={{ fontSize: 12, color: "#888" }}>Privacy-first Lend · Borrow · Stake</div>
        </div>
      </div>

      {account && (
        <div style={{ display: "flex", gap: 16, fontSize: 14 }}>
          <div style={{ background: "#f5f5f5", padding: "8px 14px", borderRadius: 8 }}>
            <span style={{ color: "#888" }}>USDC: </span>
            <strong>{fromUnits(usdcBalance)}</strong>
          </div>
          <div style={{ background: "#f5f5f5", padding: "8px 14px", borderRadius: 8 }}>
            <span style={{ color: "#888" }}>EURC: </span>
            <strong>{fromUnits(eurcBalance)}</strong>
          </div>
        </div>
      )}

      <ConnectButton client={client} chain={arcTestnet} />
    </div>
  );
}

// Allow parent pages to trigger a wallet-balance refresh after a transaction
export function useWalletBalanceRefetch() {
  const account = useActiveAccount();
  const usdcContract = getUsdcContract();
  const eurcContract = getEurcContract();
  const { refetch: refetchUsdc } = useReadContract({
    contract: usdcContract,
    method: "balanceOf",
    params: [account?.address || "0x0000000000000000000000000000000000000000"],
    queryOptions: { enabled: !!account },
  });
  const { refetch: refetchEurc } = useReadContract({
    contract: eurcContract,
    method: "balanceOf",
    params: [account?.address || "0x0000000000000000000000000000000000000000"],
    queryOptions: { enabled: !!account },
  });
  return () => {
    refetchUsdc();
    refetchEurc();
  };
}
