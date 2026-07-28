import { useState } from "react";
import ConnectBar from "../components/ConnectBar";
import LendPanel from "../components/LendPanel";
import BorrowPanel from "../components/BorrowPanel";
import StakePanel from "../components/StakePanel";
import BridgePanel from "../components/BridgePanel";
import GatewayPanel from "../components/GatewayPanel";

const TABS = [
  { key: "lend", label: "Lend" },
  { key: "borrow", label: "Borrow" },
  { key: "stake", label: "Stake" },
  { key: "bridge", label: "Bridge" },
  { key: "gateway", label: "Gateway" },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState("lend");

  return (
    <div className="app-shell">
      <ConnectBar />

      <div className="ledger-wrap">
        <div className="tab-bar">
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
          {activeTab === "lend" && <LendPanel />}
          {activeTab === "borrow" && <BorrowPanel />}
          {activeTab === "stake" && <StakePanel />}
          {activeTab === "bridge" && <BridgePanel />}
          {activeTab === "gateway" && <GatewayPanel />}
        </div>
      </div>
    </div>
  );
}
