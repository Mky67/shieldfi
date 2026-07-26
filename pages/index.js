import { useState } from "react";
import ConnectBar from "../components/ConnectBar";
import LendPanel from "../components/LendPanel";
import BorrowPanel from "../components/BorrowPanel";
import StakePanel from "../components/StakePanel";

const TABS = [
  { key: "lend", label: "💰 Lend" },
  { key: "borrow", label: "🏦 Borrow" },
  { key: "stake", label: "🔒 Stake" },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState("lend");

  return (
    <div style={{ fontFamily: "sans-serif", minHeight: "100vh", background: "#fafafa" }}>
      <ConnectBar />

      <div style={{ maxWidth: 600, margin: "0 auto", padding: "0 20px 60px" }}>
        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 32,
            background: "#eee",
            borderRadius: 12,
            padding: 6,
          }}
        >
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                flex: 1,
                padding: "12px 0",
                border: "none",
                borderRadius: 8,
                fontSize: 15,
                fontWeight: 600,
                cursor: "pointer",
                background: activeTab === tab.key ? "#fff" : "transparent",
                boxShadow: activeTab === tab.key ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
                color: activeTab === tab.key ? "#000" : "#888",
                transition: "all 0.15s",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "lend" && <LendPanel />}
        {activeTab === "borrow" && <BorrowPanel />}
        {activeTab === "stake" && <StakePanel />}
      </div>
    </div>
  );
}
