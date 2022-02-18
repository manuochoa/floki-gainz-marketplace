import { useEffect, useState } from "react";
import Header from "./components/Header";
import { Route, Routes } from "react-router";
import Marketplace from "./components/pages/marketplace/Marketplace";
import Token from "./components/pages/Token";
import Bridge from "./components/pages/Bridge";
import Collections from "./components/pages/Collection";
import WalletConnectProvider from "@walletconnect/web3-provider";
import {
  getMarketNFTs,
  getUserNFTs,
  checkERC721Allowance,
  approveERC721,
} from "./blockchain/functions";
import store from "store2";

export default function App() {
  const [userAddress, setUserAddress] = useState("");
  const [walletType, setWalletType] = useState("");
  const [marketNFTs, setMarketNFTs] = useState([]);
  const [filteredNFTs, setFilteredNFTs] = useState([]);
  const [userNFTs, setUserNFTs] = useState([]);
  const [userOrders, setUserOrders] = useState([]);
  const [stats, setStats] = useState([
    {
      title: "FLOORPRICE",
      value: 0,
    },
    { title: "VOLUME", value: 0 },
    { title: "MINTED", value: 0 },
  ]);
  const [ERC721Approved, setERC721Approved] = useState(false);

  const connectWallet = async () => {
    console.log("hola");
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setUserAddress(accounts[0]);

      window.localStorage.setItem("userAddress", accounts[0]);

      const chainId = await window.ethereum.request({
        method: "eth_chainId",
      });

      if (chainId !== "0x61") {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x61" }],
        });
      }

      window.ethereum.on("accountsChanged", function (accounts) {
        setUserAddress(accounts[0]);
      });

      window.ethereum.on("chainChanged", (_chainId) =>
        window.location.reload()
      );
    } catch (error) {
      console.log(error);
    }
  };

  const connectWalletConnect = async () => {
    try {
      console.log("hola");
      const provider = new WalletConnectProvider({
        rpc: {
          //   56: "https://bsc-dataseed.binance.org/",

          97: "https://speedy-nodes-nyc.moralis.io/1d19a6082204e3ecd8dcf0b9/bsc/testnet",
        },
        network: "binance testnet",
        chainId: 97,
        infuraId: null,
      });

      await provider.enable();

      const accounts = await provider.listAccounts();

      setUserAddress(accounts[0]);
      setWalletType("WALLET_CONNECT");
    } catch (error) {
      console.log(error);
    }
  };

  const disconnectWallet = async () => {
    if (walletType === "WALLET_CONNECT") {
      const provider = new WalletConnectProvider({
        rpc: {
          //   56: "https://bsc-dataseed.binance.org/",

          97: "https://speedy-nodes-nyc.moralis.io/1d19a6082204e3ecd8dcf0b9/bsc/testnet",
        },
        network: "binance testnet",
        chainId: 97,
        infuraId: null,
      });
      await provider.disconnect();
    } else {
      window.localStorage.removeItem("userAddress");
      store.remove("userNFTs");
    }

    setUserAddress("");
  };

  const getItems = async () => {
    let result = await getMarketNFTs();
    if (result) {
      console.log("market", result.tokens, result.floorPrice);
      store.set("marketNFTs", result.tokens);
      setMarketNFTs(result.tokens);
      setStats([
        {
          title: "FLOORPRICE",
          value: `${Number(result.floorPrice / 10 ** 18).toFixed(2)} BNB`,
        },
        {
          title: "VOLUME",
          value: `${Number(result.volume / 10 ** 18).toFixed(2)} BNB`,
        },
        { title: "MINTED", value: Number(result.minted) },
      ]);
    }
  };

  const getUserDetails = async () => {
    if (userAddress) {
      let NFTs = await getUserNFTs(userAddress);
      let allowance = await checkERC721Allowance(userAddress);

      if (marketNFTs.length > 0) {
        let orders = marketNFTs.filter(
          (el) => el.itemInfo.seller.toLowerCase() === userAddress.toLowerCase()
        );
        if (orders) {
          setUserOrders(orders);
        }
      }

      if (NFTs || allowance) {
        store.set("userNFTs", NFTs);
        setUserNFTs(NFTs);
        setERC721Approved(allowance);
      }
    }
  };

  const handleApproval = async () => {
    let receipt = await approveERC721();
    if (receipt) {
      console.log(receipt);
      getUserDetails();
    }
  };

  useEffect(() => {
    const checkConnection = () => {
      let user = window.localStorage.getItem("userAddress");
      let marketStore = store.get("marketNFTs");
      if (marketStore) {
        setMarketNFTs(marketStore);
      }
      if (user) {
        let userStore = store.get("userNFTs");
        if (userStore) {
          setUserNFTs(userStore);
        }
        connectWallet();
      }
    };

    checkConnection();
    getItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getUserDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userAddress]);

  return (
    <>
      <Header
        userAddress={userAddress}
        connectWallet={connectWallet}
        connectWalletConnect={connectWalletConnect}
        disconnectWallet={disconnectWallet}
      />
      <main className="main">
        <Routes>
          <Route path="/" element={<Bridge />} />
          <Route
            path="/marketplace"
            element={
              <Marketplace
                userAddress={userAddress}
                marketNFTs={marketNFTs}
                stats={stats}
              />
            }
          />
          <Route
            path="/marketplace/:id"
            element={
              <Token
                walletType={walletType}
                getItems={getItems}
                type="market"
                userAddress={userAddress}
                connectWallet={connectWallet}
                NFTs={marketNFTs}
                getUserDetails={getUserDetails}
              />
            }
          />
          <Route
            path="/collection"
            element={
              <Collections userNFTs={userNFTs} userOrders={userOrders} />
            }
          />
          <Route
            path="/collection/:id"
            element={
              <Token
                type="collection"
                NFTs={userNFTs}
                userAddress={userAddress}
                connectWallet={connectWallet}
                ERC721Approved={ERC721Approved}
                approve={handleApproval}
                getItems={getItems}
                getUserDetails={getUserDetails}
              />
            }
          />
        </Routes>
      </main>
    </>
  );
}
