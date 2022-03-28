import React, { useState, useEffect } from "react";
import Select from "../common/Select";
import bsc from "../../images/svg/bsc.svg";
import eth from "../../images/svg/eth.svg";

import gainz from "../../images/svg/gainz.svg";
import Input from "../common/Input";
import Swap from "./../../Icons/Swap";
import Arrow2 from "./../../Icons/Arrow2";

import {
  getUserInfo,
  receiveTokensFromSource,
  fundSendToDestinationGas,
  approve,
} from "../../blockchain/bridgeFunctions";
import { ethers } from "ethers";

const assetsInitialState = [
  { title: "$GAINZ", icon: gainz, selected: true, id: 0 },
  //   { title: "$GAINZ 2", icon: gainz, selected: false, id: 1 },
  //   { title: "$GAINZ 3", icon: gainz, selected: false, id: 3 },
  //   { title: "$GAINZ 4", icon: gainz, selected: false, id: 4 },
];

export default function Bridge({ connectWallet, userAddress, selectedChain }) {
  const [isLoading, setIsLoading] = useState(false);
  const [bridgeState, setBridgeState] = useState({
    assets: assetsInitialState,
    quantity: "",
  });
  const [userData, setUserData] = useState({
    balance: "0",
    allowance: false,
  });

  function selectAssets({ index }) {
    setBridgeState({
      ...bridgeState,
      assets: bridgeState.assets.map((item, itemIndex) => ({
        ...item,
        selected: itemIndex === index,
      })),
    });
  }

  const [chains, setChains] = useState({
    tokenOut: {
      icon: bsc,
      code: "BEP20",
      title: "Binance Smart Chain",
    },
    tokenIn: {
      icon: eth,
      code: "ERC20",
      title: "Ethereum Chain Network",
    },
  });

  async function swapChains() {
    const tokenOut = chains.tokenIn;
    const tokenIn = chains.tokenOut;
    console.log(chains.tokenIn);
    const chainId = await window.ethereum.request({
      method: "eth_chainId",
    });
    if (chains.tokenIn.code === "BEP20") {
      if (chainId !== "0x38") {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x38" }],
        });
      }
    } else {
      if (chainId !== "0x1") {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x1" }],
        });
      }
    }

    setChains({ tokenIn, tokenOut });
  }

  const initSwap = async () => {
    setIsLoading(true);
    let receipt = await receiveTokensFromSource(bridgeState.quantity);
    if (receipt) {
      console.log(receipt);
      fetchInfo();
    }
    setIsLoading(false);
  };

  const initClaim = async () => {
    setIsLoading(true);
    let { id, origTimestamp, amount } = userData.swap;
    let receipt = await fundSendToDestinationGas(id, origTimestamp, amount);
    if (receipt) {
      console.log(receipt);
      fetchInfo();
    }
    setIsLoading(false);
  };

  const fetchInfo = async () => {
    if (userAddress) {
      let result = await getUserInfo(userAddress);
      if (selectedChain === 1 || selectedChain === 56) {
        setUserData(result[selectedChain]);
        console.log(result[selectedChain]);
      }
    }
  };

  const handleApproval = async () => {
    setIsLoading(true);
    let receipt = await approve(selectedChain);
    if (receipt) {
      console.log(receipt);
      fetchInfo();
    }
    setIsLoading(false);
  };

  const getPerc = (perc) => {
    let balance = userData.balance;
    let result = (balance * perc) / 100;
    console.log(result / 10 ** 6);

    return truncateByDecimalPlace(result / 10 ** 6, 4);
  };

  const truncateByDecimalPlace = (value, numDecimalPlaces) =>
    Math.trunc(value * Math.pow(10, numDecimalPlaces)) /
    Math.pow(10, numDecimalPlaces);

  useEffect(() => {
    fetchInfo();

    if (selectedChain === 1) {
      setChains({
        tokenIn: {
          icon: bsc,
          code: "BEP20",
          title: "Binance Smart Chain",
        },
        tokenOut: {
          icon: eth,
          code: "ERC20",
          title: "Ethereum Chain Network",
        },
      });
    } else if (selectedChain === 56) {
      setChains({
        tokenOut: {
          icon: bsc,
          code: "BEP20",
          title: "Binance Smart Chain",
        },
        tokenIn: {
          icon: eth,
          code: "ERC20",
          title: "Ethereum Chain Network",
        },
      });
    }
  }, [userAddress, selectedChain]);

  return (
    <div className="section section--orange">
      <div className="container">
        <h1 className="title">
          Floki <span>bridge</span>
        </h1>
        <div className="bridge">
          <div className="bridge__wrapper">
            <div className="bridge__item">
              <label className="bridge__label">Asset</label>
              <Select
                list={bridgeState.assets}
                setList={selectAssets}
                className="select--asset"
                CustomArrow={Arrow2}
              />
            </div>
            <div className="bridge__item">
              <div className="bridge__row">
                <label className="bridge__label">Qty</label>
                <label className="bridge__label">
                  Balance: {userData.balance / 10 ** 6}{" "}
                </label>
              </div>
              <div className="bridge__row bridge__row--action">
                <Input
                  className="input-wrapper--bridge bridge__input-wrapper"
                  value={bridgeState.quantity}
                  onChange={(e) =>
                    setBridgeState({ ...bridgeState, quantity: e.target.value })
                  }
                  placeholder="Quantity"
                  type="number"
                  displayType="input"
                />
                <div className="bridge__amounts">
                  <button
                    onClick={(e) =>
                      setBridgeState({
                        ...bridgeState,
                        quantity: getPerc(25),
                      })
                    }
                    className="bridge__amount"
                  >
                    25%
                  </button>
                  <button
                    onClick={(e) =>
                      setBridgeState({
                        ...bridgeState,
                        quantity: getPerc(50),
                      })
                    }
                    className="bridge__amount"
                  >
                    50%
                  </button>
                  <button
                    onClick={(e) =>
                      setBridgeState({
                        ...bridgeState,
                        quantity: getPerc(75),
                      })
                    }
                    className="bridge__amount"
                  >
                    75%
                  </button>
                  <button
                    onClick={(e) =>
                      setBridgeState({
                        ...bridgeState,
                        quantity: getPerc(100),
                      })
                    }
                    className="bridge__amount"
                  >
                    MAX
                  </button>
                </div>
              </div>
            </div>
            <div className="bridge__item bridge__item--50">
              <label className="bridge__label">From</label>
              <div className="bridge__chain">
                <button className="bridge__chain-button">
                  <img
                    src={chains.tokenOut.icon}
                    alt={chains.tokenOut.title}
                    className="bridge__chain-icon"
                  />
                  <div className="bridge__chain-code">
                    {chains.tokenOut.code}
                  </div>
                  <h2 className="bridge__chain-title">
                    {chains.tokenOut.title}
                  </h2>
                </button>
                <button className="bridge__swap" onClick={swapChains}>
                  <Swap className="bridge__swap-icon" />
                </button>
              </div>
            </div>
            <div className="bridge__item bridge__item--50">
              <label className="bridge__label">To</label>
              <div className="bridge__chain">
                <button className="bridge__chain-button">
                  <img
                    src={chains.tokenIn.icon}
                    alt={chains.tokenIn.title}
                    className="bridge__chain-icon"
                  />
                  <div className="bridge__chain-code">
                    {chains.tokenIn.code}
                  </div>
                  <h2 className="bridge__chain-title">
                    {chains.tokenIn.title}
                  </h2>
                </button>
              </div>
            </div>
            <button
              disabled={isLoading}
              onClick={
                !userAddress
                  ? connectWallet
                  : userData.allowance
                  ? initSwap
                  : handleApproval
              }
              className="bridge__button button button--beige"
            >
              {userData.allowance ? "Init Swap" : "Approve Token"}
            </button>
            <button
              // disabled={
              //   isLoading ||
              //   !userData.swap ||
              //   Number(userData.swap.amount) === 0 ||
              //   userData.cross.isRefunded
              // }
              onClick={initClaim}
              className="bridge__button button button--orange"
            >
              Claim Tokens
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
