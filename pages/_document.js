import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="tr">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <style>{`
          :root {
            --ink: #10192E;
            --panel: #16223B;
            --panel-raised: #1C2A44;
            --parchment: #F1ECDF;
            --ink-text: #E9E6DC;
            --muted: #8B93A7;
            --teal: #2FBF9F;
            --gold: #C9A227;
            --coral: #E2574C;
            --hairline: rgba(233,230,220,0.14);
            --hairline-dark: rgba(16,25,46,0.15);
          }
          * { box-sizing: border-box; }
          html, body { margin: 0; padding: 0; background: var(--ink); }
          body { font-family: 'IBM Plex Sans', sans-serif; color: var(--ink-text); }
          button:focus-visible, input:focus-visible, a:focus-visible {
            outline: 2px solid var(--teal);
            outline-offset: 2px;
          }
          @media (prefers-reduced-motion: reduce) {
            *, *::before, *::after {
              animation-duration: 0.001ms !important;
              transition-duration: 0.001ms !important;
            }
          }
          @keyframes sealIn {
            from { opacity: 0; transform: scale(0.85) rotate(-6deg); }
            to { opacity: 1; transform: scale(1) rotate(0deg); }
          }
        `}</style>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
