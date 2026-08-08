const ARC_INVESTORS = [
  "a16z", "BlackRock", "Apollo", "ICE", "ARK Invest", "Bullish",
  "Haun Ventures", "Standard Chartered Ventures", "SBI Group",
  "Janus Henderson", "General Catalyst", "Marshall Wace", "IDG Capital",
];

const ARC_PARTNERS = [
  "BlackRock", "DTCC", "Galaxy", "Global Payments", "ICE", "Mastercard",
  "MoneyGram", "SBI Group", "Standard Chartered", "Sumitomo Corporation", "Visa",
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="backers">
          <div className="footer-label">Built on Arc · backed by</div>
          <div className="backers-track">
            {ARC_INVESTORS.map((name) => (
              <span className="backer-chip" key={name}>{name}</span>
            ))}
          </div>
        </div>

        <div className="backers">
          <div className="footer-label">Arc founding partners &amp; validators</div>
          <div className="backers-track">
            {ARC_PARTNERS.map((name) => (
              <span className="backer-chip backer-chip--partner" key={name}>{name}</span>
            ))}
          </div>
        </div>

        <div className="contact-box">
          <div className="footer-label">Official</div>
          <div className="contact-links">
            <a
              href="https://github.com/Mky67/shieldfi"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-link"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 .5C5.73.5.5 5.74.5 12.02c0 5.02 3.26 9.28 7.78 10.78.57.1.78-.25.78-.55 0-.27-.01-1.16-.01-2.11-3.17.69-3.84-1.36-3.84-1.36-.52-1.33-1.27-1.69-1.27-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.75 2.68 1.24 3.33.95.1-.74.4-1.24.72-1.53-2.53-.29-5.19-1.27-5.19-5.63 0-1.24.44-2.26 1.17-3.06-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.17a10.9 10.9 0 0 1 5.73 0c2.19-1.48 3.15-1.17 3.15-1.17.62 1.58.23 2.75.11 3.04.73.8 1.17 1.82 1.17 3.06 0 4.37-2.66 5.34-5.2 5.62.41.36.77 1.06.77 2.14 0 1.55-.01 2.79-.01 3.17 0 .3.2.66.79.55A10.53 10.53 0 0 0 23.5 12c0-6.27-5.23-11.5-11.5-11.5Z"/>
              </svg>
              github.com/Mky67/shieldfi
            </a>
            <a
              href="https://shieldfi-liard.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-link"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9.3" stroke="currentColor" strokeWidth="1.5" />
                <path d="M2.7 12h18.6M12 2.7c2.3 2.5 3.6 5.8 3.6 9.3s-1.3 6.8-3.6 9.3c-2.3-2.5-3.6-5.8-3.6-9.3s1.3-6.8 3.6-9.3Z" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              shieldfi-liard.vercel.app
            </a>
            <a
              href="mailto:mkylmz67@gmail.com"
              className="contact-link"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <rect x="2.5" y="4.5" width="19" height="15" rx="2" stroke="currentColor" strokeWidth="1.5" />
                <path d="M3.5 6l8.5 7 8.5-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              mkylmz67@gmail.com
            </a>
          </div>
        </div>
      </div>

      <div className="footer-meta">
        ShieldFi — Confidential Ledger · Arc Testnet, Chain ID 5042002
      </div>
    </footer>
  );
}
