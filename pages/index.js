import { useState } from "react";
import ConnectBar from "../components/ConnectBar";
import LendPanel from "../components/LendPanel";
import BorrowPanel from "../components/BorrowPanel";
import StakePanel from "../components/StakePanel";
import BridgePanel from "../components/BridgePanel";
import GatewayPanel from "../components/GatewayPanel";
import AboutPanel from "../components/AboutPanel";
import DocsPanel from "../components/DocsPanel";
import Footer from "../components/Footer";

const TABS = [
  { key: "about", label: "Vision" },
  { key: "lend", label: "Lend" },
  { key: "borrow", label: "Borrow" },
  { key: "stake", label: "Stake" },
  { key: "bridge", label: "Bridge" },
  { key: "gateway", label: "Gateway" },
  { key: "docs", label: "Docs" },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState("lend");

  return (
    <div className="app-shell">
      <ConnectBar />

      <div className="ledger-wrap">
        <div className="index-rail">
          <div className="index-rail-label">Case File</div>
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`tab${activeTab === tab.key ? " tab--active" : ""}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="ledger-sheet" key={activeTab}>
          {activeTab === "about" && <AboutPanel />}
          {activeTab === "lend" && <LendPanel />}
          {activeTab === "borrow" && <BorrowPanel />}
          {activeTab === "stake" && <StakePanel />}
          {activeTab === "bridge" && <BridgePanel />}
          {activeTab === "gateway" && <GatewayPanel />}
          {activeTab === "docs" && <DocsPanel />}
        </div>
      </div>

      <Footer />
    </div>
  );
}
