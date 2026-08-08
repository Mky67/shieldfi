const MODULES = [
  {
    name: "Lend",
    desc: "Supply USDC to the ledger and earn interest, paid continuously from the pool's borrow rate.",
    meta: ["Asset: USDC", "Contract: ShieldLending"],
  },
  {
    name: "Borrow",
    desc: "Deposit EURC as collateral and borrow USDC against it — two distinct Circle stablecoins, so the collateral relationship is real rather than circular.",
    meta: ["LTV: 90%", "Liquidation threshold: 95%"],
  },
  {
    name: "Stake",
    desc: "Stake USDC and earn EURC rewards, using a Synthetix-style reward-per-token accrual model with a 1-hour minimum stake to prevent flash-stake extraction.",
    meta: ["Contract: ShieldStakingV2", "Min. stake: 1 hour"],
  },
  {
    name: "Bridge",
    desc: "Move USDC between Arc Testnet and Ethereum Sepolia using Circle's Cross-Chain Transfer Protocol (CCTP) — native burn-and-mint, no wrapped assets.",
    meta: ["Rail: CCTP", "Chains: Arc Testnet ↔ Ethereum Sepolia"],
  },
  {
    name: "Gateway",
    desc: "Deposit once and spend the same USDC balance across any Gateway-supported chain in under 500ms, via Circle's Unified Balance Kit — no repeated burn/attestation/mint round trips.",
    meta: ["SDK: @circle-fin/unified-balance-kit"],
  },
];

const CONTRACTS = [
  { label: "USDC", value: "0x3600000000000000000000000000000000000000" },
  { label: "EURC", value: "0x89B50855Aa3bE2F677cD6303Cec089B5F319D72a" },
  { label: "ShieldLending", value: "0x11A7B5360e6F92C59ed06BF17E95717f0ae873BE" },
  { label: "ShieldStakingV2", value: "0x84F89ce4984E0F0C8ab32d8cf23602D307b8715e" },
];

export default function DocsPanel() {
  return (
    <div className="docs">
      <p className="about-body" style={{ marginTop: 0 }}>
        A short reference for every module on ShieldFi and the contracts
        behind them, verified and live on Arc Testnet.
      </p>

      {MODULES.map((m) => (
        <div className="doc-module" key={m.name}>
          <div className="doc-module-name">{m.name}</div>
          <div className="doc-module-desc">{m.desc}</div>
          <div className="doc-module-meta">
            {m.meta.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
      ))}

      <div className="section-title" style={{ marginTop: 28 }}>Contract addresses — Arc Testnet</div>
      <div className="addr-table">
        {CONTRACTS.map((c) => (
          <div className="addr-row" key={c.label}>
            <span className="addr-row-label">{c.label}</span>
            <span className="addr-row-value">{c.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
