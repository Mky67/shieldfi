import { ConnectButton, useActiveAccount, useReadContract } from "thirdweb/react";
import { client, arcTestnet, getUsdcContract, getEurcContract, fromUnits } from "../lib/contracts";

export default function ConnectBar() {
  const account = useActiveAccount();
  const usdcContract = getUsdcContract();
  const eurcContract = getEurcContract();

  const { data: usdcBalance } = useReadContract({
    contract: usdcContract,
    method: "balanceOf",
    params: [account?.address || "0x0000000000000000000000000000000000000000"],
    queryOptions: { enabled: !!account },
  });

  const { data: eurcBalance } = useReadContract({
    contract: eurcContract,
    method: "balanceOf",
    params: [account?.address || "0x0000000000000000000000000000000000000000"],
    queryOptions: { enabled: !!account },
  });

  return (
    <header className="app-header">
      <div className="wordmark">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 2L4 5V11C4 16 7.4 20.4 12 22C16.6 20.4 20 16 20 11V5L12 2Z"
            stroke="#ECEEE6"
            strokeWidth="1.5"
          />
        </svg>
        <div>
          <div className="wordmark-title">ShieldFi</div>
          <div className="wordmark-sub">Confidential Lend · Borrow · Stake</div>
        </div>
      </div>

      <div className="header-actions">
        {account && (
          <div className="balances">
            <div className="balance-item">
              <span className="label">USDC</span>
              <span className="value">{fromUnits(usdcBalance)}</span>
            </div>
            <div className="balance-item">
              <span className="label">EURC</span>
              <span className="value">{fromUnits(eurcBalance)}</span>
            </div>
          </div>
        )}
        <ConnectButton client={client} chain={arcTestnet} />
      </div>
    </header>
  );
}
