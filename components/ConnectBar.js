import { useState } from "react";
import { ConnectButton, useActiveAccount, useReadContract } from "thirdweb/react";
import { client, arcTestnet, getUsdcContract, getEurcContract, fromUnits } from "../lib/contracts";

export default function ConnectBar() {
  const [revealed, setRevealed] = useState(false);
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
        <svg className="wordmark-icon" width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 2L4 5V11C4 16 7.4 20.4 12 22C16.6 20.4 20 16 20 11V5L12 2Z"
            stroke="currentColor"
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
            <button
              className="mask-toggle"
              onClick={() => setRevealed((r) => !r)}
              aria-label={revealed ? "Bakiyeleri gizle" : "Bakiyeleri göster"}
              title={revealed ? "Bakiyeleri gizle" : "Bakiyeleri göster"}
            >
              {revealed ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" stroke="currentColor" strokeWidth="1.6"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6"/></svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M3 3l18 18M10.6 5.2A10.4 10.4 0 0 1 12 5c6.5 0 10 7 10 7a17.6 17.6 0 0 1-3.2 4.2M6.6 6.6C4 8.3 2 12 2 12s3.5 7 10 7a10.4 10.4 0 0 0 4.2-.9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
              )}
            </button>
            <div className="balance-item">
              <span className="label">USDC</span>
              <span className={`balance-value${revealed ? "" : " balance-value--masked"}`}>
                {revealed ? fromUnits(usdcBalance) : "••••••"}
              </span>
            </div>
            <div className="balance-item">
              <span className="label">EURC</span>
              <span className={`balance-value${revealed ? "" : " balance-value--masked"}`}>
                {revealed ? fromUnits(eurcBalance) : "••••••"}
              </span>
            </div>
          </div>
        )}
        <ConnectButton client={client} chain={arcTestnet} />
      </div>
    </header>
  );
}
