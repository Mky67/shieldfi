import { ThirdwebProvider } from "thirdweb/react";
import "../styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <ThirdwebProvider>
      <Component {...pageProps} />
    </ThirdwebProvider>
  );
}
