import { createThirdwebClient, getContract } from "thirdweb";
import { defineChain } from "thirdweb/chains";

export const client = createThirdwebClient({
  clientId: "a27dd7d0078c0ec1f061ebafe47cf8c9",
});

export const arcTestnet = defineChain(5042002);

export const ADDRESSES = {
  usdc: "0x3600000000000000000000000000000000000000",
  eurc: "0x89B50855Aa3bE2F677cD6303Cec089B5F319D72a",
  shieldLending: "0x11A7B5360e6F92C59ed06BF17E95717f0ae873BE",
  shieldStaking: "0x84F89ce4984E0F0C8ab32d8cf23602D307b8715e",
};

export const ERC20_ABI = [
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "approve",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    name: "allowance",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
];

export const LENDING_ABI = [
  { name: "supply", type: "function", stateMutability: "nonpayable", inputs: [{ name: "amount", type: "uint256" }], outputs: [] },
  { name: "withdraw", type: "function", stateMutability: "nonpayable", inputs: [{ name: "amount", type: "uint256" }], outputs: [] },
  { name: "depositCollateral", type: "function", stateMutability: "nonpayable", inputs: [{ name: "amount", type: "uint256" }], outputs: [] },
  { name: "withdrawCollateral", type: "function", stateMutability: "nonpayable", inputs: [{ name: "amount", type: "uint256" }], outputs: [] },
  { name: "borrow", type: "function", stateMutability: "nonpayable", inputs: [{ name: "amount", type: "uint256" }], outputs: [] },
  { name: "repay", type: "function", stateMutability: "nonpayable", inputs: [{ name: "amount", type: "uint256" }], outputs: [] },
  { name: "claimInterest", type: "function", stateMutability: "nonpayable", inputs: [], outputs: [] },
  { name: "suppliedBalance", type: "function", stateMutability: "view", inputs: [{ name: "", type: "address" }], outputs: [{ name: "", type: "uint256" }] },
  { name: "collateralBalance", type: "function", stateMutability: "view", inputs: [{ name: "", type: "address" }], outputs: [{ name: "", type: "uint256" }] },
  { name: "borrowedBalance", type: "function", stateMutability: "view", inputs: [{ name: "", type: "address" }], outputs: [{ name: "", type: "uint256" }] },
  { name: "maxBorrowable", type: "function", stateMutability: "view", inputs: [{ name: "user", type: "address" }], outputs: [{ name: "", type: "uint256" }] },
  { name: "earnedInterest", type: "function", stateMutability: "view", inputs: [{ name: "lender", type: "address" }], outputs: [{ name: "", type: "uint256" }] },
  { name: "borrowRateBps", type: "function", stateMutability: "view", inputs: [], outputs: [{ name: "", type: "uint256" }] },
  { name: "utilizationBps", type: "function", stateMutability: "view", inputs: [], outputs: [{ name: "", type: "uint256" }] },
];

export const STAKING_ABI = [
  { name: "stake", type: "function", stateMutability: "nonpayable", inputs: [{ name: "amount", type: "uint256" }], outputs: [] },
  { name: "withdraw", type: "function", stateMutability: "nonpayable", inputs: [{ name: "amount", type: "uint256" }], outputs: [] },
  { name: "claimReward", type: "function", stateMutability: "nonpayable", inputs: [], outputs: [] },
  { name: "exit", type: "function", stateMutability: "nonpayable", inputs: [], outputs: [] },
  { name: "stakedBalance", type: "function", stateMutability: "view", inputs: [{ name: "", type: "address" }], outputs: [{ name: "", type: "uint256" }] },
  { name: "earned", type: "function", stateMutability: "view", inputs: [{ name: "account", type: "address" }], outputs: [{ name: "", type: "uint256" }] },
  { name: "totalStaked", type: "function", stateMutability: "view", inputs: [], outputs: [{ name: "", type: "uint256" }] },
  { name: "estimatedAprBps", type: "function", stateMutability: "view", inputs: [], outputs: [{ name: "", type: "uint256" }] },
];

export function getUsdcContract() {
  return getContract({ client, chain: arcTestnet, address: ADDRESSES.usdc, abi: ERC20_ABI });
}
export function getEurcContract() {
  return getContract({ client, chain: arcTestnet, address: ADDRESSES.eurc, abi: ERC20_ABI });
}
export function getLendingContract() {
  return getContract({ client, chain: arcTestnet, address: ADDRESSES.shieldLending, abi: LENDING_ABI });
}
export function getStakingContract() {
  return getContract({ client, chain: arcTestnet, address: ADDRESSES.shieldStaking, abi: STAKING_ABI });
}

// 6 decimals for both USDC and EURC on Arc
export function toUnits(amountStr) {
  const val = parseFloat(amountStr || "0");
  if (isNaN(val) || val <= 0) return 0n;
  return BigInt(Math.round(val * 1e6));
}
export function fromUnits(value) {
  if (value === undefined || value === null) return "0.00";
  return (Number(value) / 1e6).toFixed(4);
}
