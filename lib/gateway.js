import { UnifiedBalanceKit } from "@circle-fin/unified-balance-kit";
import { createViemAdapterFromProvider } from "@circle-fin/adapter-viem-v2";
import { getInjectedProvider } from "./bridge";

/// Circle's Unified Balance Kit (built on Circle Gateway) — lets a user
/// deposit USDC once and then instantly (<500ms) access that same balance
/// on any Gateway-supported chain, without a fresh CCTP burn/attestation/mint
/// round trip each time.
async function getAdapter() {
  const provider = await getInjectedProvider();
  await provider.request({ method: "eth_requestAccounts" });
  return createViemAdapterFromProvider({ provider });
}

/// Deposits `amount` USDC (human-readable string, e.g. "10.00") from
/// `chain` into the caller's unified Gateway balance.
export async function depositToGateway({ chain, amount }) {
  const adapter = await getAdapter();
  const kit = new UnifiedBalanceKit();
  return kit.deposit({
    from: { adapter, chain },
    amount: String(amount),
  });
}

/// Reads the caller's unified USDC balance across all Gateway-supported
/// chains (a single aggregated number, plus any pending deposits).
export async function getGatewayBalance() {
  const adapter = await getAdapter();
  const kit = new UnifiedBalanceKit();
  return kit.getBalances({
    token: "USDC",
    sources: { adapter },
    includePending: true,
  });
}

/// Instantly mints `amount` USDC on `toChain` out of the caller's unified
/// Gateway balance (the provider automatically decides which underlying
/// chain balances to burn from).
export async function spendFromGateway({ fromChain, toChain, amount }) {
  const adapter = await getAdapter();
  const kit = new UnifiedBalanceKit();
  return kit.spend({
    from: { adapter, chain: fromChain },
    to: { adapter, chain: toChain },
    token: "USDC",
    amountIn: String(amount),
  });
}
