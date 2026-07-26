import { useState } from "react";
import ConnectBar from "../components/ConnectBar";
import LendPanel from "../components/LendPanel";
import BorrowPanel from "../components/BorrowPanel";
import StakePanel from "../components/StakePanel";

const TABS = [
  { key: "lend", label: "Lend" },
  { key: "borrow", label: "Borrow" },
  { key: "stake", label: "Stake" },
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
        </div>
      </div>
    </div>
  );
}
