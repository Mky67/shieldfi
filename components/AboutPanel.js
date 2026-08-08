export default function AboutPanel() {
  return (
    <div className="about">
      <div className="about-lede">
        Aave and Compound made lending permissionless.
        <br />
        They never made it private.
      </div>

      <p className="about-body">
        Every position on today&rsquo;s major lending markets is public — anyone
        can see exactly who supplied what, who borrowed against it, and how
        close a wallet sits to liquidation. ShieldFi exists to close that gap:
        a lend / borrow / stake platform built on Arc, Circle&rsquo;s
        stablecoin-native L1, where balances stay confidential by default and
        only the counterparties involved can see the full picture.
      </p>

      <div className="section-title" style={{ marginTop: 28 }}>Why Arc</div>
      <p className="about-body">
        Arc settles in USDC as its native gas asset and is built for
        regulated, institutional-grade stablecoin finance — which makes it
        the natural home for a confidential lending primitive. As Arc
        Privacy Sector (APS) becomes available on testnet, ShieldFi&rsquo;s
        contracts are designed to migrate onto it with minimal changes,
        moving position privacy from the application layer to the protocol
        layer.
      </p>

      <div className="section-title" style={{ marginTop: 28 }}>Roadmap</div>
      <ul className="about-list">
        <li><span className="about-list-tag">Shipped</span> Lending, staking, CCTP bridge and Gateway unified balances live on Arc Testnet.</li>
        <li><span className="about-list-tag">In progress</span> ShieldVault — a Yearn-style adapter vault for auto-compounding yield strategies.</li>
        <li><span className="about-list-tag">Planned</span> Native integration with Arc Privacy Sector (APS) — Arc's own confidential-execution toolkit — the moment it activates on testnet, moving position privacy from ShieldFi's application layer to Arc's protocol layer.</li>
      </ul>

      <div className="notice" style={{ marginTop: 24 }}>
        <span>Built for the Arc Build Hackathon (Encode Club) and the Ignyte × Circle × Arc Stablecoin Commerce Stack Challenge.</span>
      </div>
    </div>
  );
}
