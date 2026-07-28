import { AppKit } from "@circle-fin/app-kit";
import { createViemAdapterFromProvider } from "@circle-fin/adapter-viem-v2";

/// Grabs the injected browser wallet (MetaMask) that's already connected
/// via the app's normal wallet-connect flow. CCTP bridging needs its own
/// viem-based adapter, but it reuses the same underlying window.ethereum
/// provider — the user does not need to "connect" a second time.
export async function getInjectedProvider() {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("No injected wallet found. Please install MetaMask.");
  }
  return window.ethereum;
}

/// Bridges `amount` USDC from `fromChain` to `toChain` using Circle's CCTP,
/// via the official App Kit SDK. Both chain identifiers use Circle's naming,
/// e.g. "Arc_Testnet", "Ethereum_Sepolia". The connected wallet signs on
/// both chains, so it needs native gas on each.
export async function bridgeUSDC({ fromChain, toChain, amount, onEvent }) {
  const provider = await getInjectedProvider();
  await provider.request({ method: "eth_requestAccounts" });

  const adapter = await createViemAdapterFromProvider({ provider });

  const kit = new AppKit();
  if (onEvent) {
    kit.on("*", onEvent);
  }

  let result = await kit.bridge({
    from: { adapter, chain: fromChain },
    to: { adapter, chain: toChain },
    amount: String(amount),
  });

  if (result.state === "error") {
    result = await kit.retryBridge(result, { from: adapter, to: adapter });
  }

  return result;
}
