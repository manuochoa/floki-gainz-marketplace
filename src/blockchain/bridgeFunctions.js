import { ethers } from "ethers";
import { bridgeAbi } from "./abis";
import WalletConnectProvider from "@walletconnect/web3-provider";

let tokenAbi = [
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function balanceOf(address owner) external view returns (uint256)",
  "function approve(address spender, uint256 amount) external returns (bool)",
];

let bscProvider = new ethers.providers.JsonRpcProvider(
  "https://bsc-dataseed1.ninicoin.io/"
);

let ethProvider = new ethers.providers.JsonRpcProvider(
  "https://mainnet.infura.io/v3/0267a87b8abb49379bf3a5b7c8e2f4d7"
);

const flokiBSC = "0xB6a41C1fAcC08aADe9257b068041c9B3420693f3";
const flokiETH = "0x9f216B10dEC75A64877eb825f0999756fD761A5d";
const bridgeBSC = "0xcA2A654D7D76235E8f9200B9ff8930DBd889675d";
const bridgeETH = "0xF67a2886d92FC0E51885B04879D0396E3178cF40";

let networks = {
  1: {
    address: "0xF67a2886d92FC0E51885B04879D0396E3178cF40",
    token: "0x9f216B10dEC75A64877eb825f0999756fD761A5d",
  },

  56: {
    address: "0xcA2A654D7D76235E8f9200B9ff8930DBd889675d",
    token: "0xB6a41C1fAcC08aADe9257b068041c9B3420693f3",
  },

  4: {
    address: "0x96966D8fB1A9bF27Aa877aA85c837D2c66CE4ccb",
    token: "0x4324FcaC18d712EDB23BE10449797574Ac4fA5c2",
  },
  97: {
    address: "0x5DB795F7D6D3919B00Ce0Fa948B5b9CDB1C8600e",
    token: "0x8460F2ac333C289aD969596B5eD67CA3040bA186",
  },
};

// Bridge contracts
let contractInstanceBsc = new ethers.Contract(
  bridgeBSC,
  bridgeAbi,
  bscProvider
);
let contractInstanceEth = new ethers.Contract(
  bridgeETH,
  bridgeAbi,
  ethProvider
);

// Token Contracts
let flokiInstanceBsc = new ethers.Contract(flokiBSC, tokenAbi, bscProvider);
let flokiInstanceEth = new ethers.Contract(flokiETH, tokenAbi, ethProvider);

//  function receiveTokensFromSource(uint256 _amount)
// function fundSendToDestinationGas(    bytes32 _id,    uint256 _origTimestamp,    uint256 _amount) external payable
//  mapping(bytes32 => Swap) public swaps;
//     mapping(address => Swap) public lastUserSwap;

// 0x0000000000000000000000000000000000000000000000000000000000000000

// NFT VIEW FUNCTIONS

export const getUserInfo = async (userAddress) => {
  try {
    // BSC data
    let bscSwap = await contractInstanceBsc.lastUserSwap(userAddress);
    let bscBalance = await flokiInstanceBsc.balanceOf(userAddress);
    let bscAllowance = await flokiInstanceBsc.allowance(userAddress, bridgeBSC);

    // ETH data
    let ethSwap = await contractInstanceEth.lastUserSwap(userAddress);
    let ethBalance = await flokiInstanceEth.balanceOf(userAddress);
    let ethAllowance = await flokiInstanceEth.allowance(userAddress, bridgeETH);

    let lastBscEth = await contractInstanceEth.swaps(bscSwap.id);
    let lastEthBsc = await contractInstanceBsc.swaps(ethSwap.id);

    console.log({
      56: {
        swap: ethSwap,
        cross: lastEthBsc,
        balance: Number(bscBalance),
        allowance: Number(bscAllowance) > 0,
      },
      1: {
        swap: bscSwap,
        cross: lastBscEth,
        balance: Number(ethBalance),
        allowance: Number(ethAllowance) > 0,
      },
    });

    return {
      56: {
        swap: ethSwap,
        cross: lastEthBsc,
        balance: Number(bscBalance),
        allowance: Number(bscAllowance) > 0,
      },
      1: {
        swap: bscSwap,
        cross: lastBscEth,
        balance: Number(ethBalance),
        allowance: Number(ethAllowance) > 0,
      },
    };
  } catch (error) {
    console.log(error, "getUserInfo");
  }
};

export const receiveTokensFromSource = async (
  _amount,
  walletType,
  walletProvider
) => {
  try {
    let newInstance = await newContractInstance(walletType, walletProvider);

    console.log(_amount);

    let amount = ethers.utils.parseUnits(Number(_amount).toString(), 6);

    console.log(amount.toString());

    let tx = await newInstance.receiveTokensFromSource(amount, {
      gasLimit: 1000000,
      value: ethers.utils.parseUnits("0.002"),
    });

    let receipt = await tx.wait();

    return receipt;
  } catch (error) {
    console.log(error);
    if (error.data) {
      window.alert(error.data.message);
    }
  }
};

export const fundSendToDestinationGas = async (
  _id,
  _origTimestamp,
  _amount,
  walletType,
  walletProvider
) => {
  try {
    let newInstance = await newContractInstance(walletType, walletProvider);

    let tx = await newInstance.fundSendToDestinationGas(
      _id,
      _origTimestamp,
      _amount,
      {
        gasLimit: 1000000,
        value: ethers.utils.parseUnits("0.005"),
      }
    );

    let receipt = await tx.wait();

    return receipt;
  } catch (error) {
    console.log(error);
    if (error.data) {
      window.alert(error.data.message);
    }
  }
};

export const approve = async (chainId, walletType, walletProvider) => {
  try {
    let newInstance = await newTokenInstance(walletType, walletProvider);

    let MAX_INT =
      "115792089237316195423570985008687907853269984665640564039457584007913129639935";

    let tx = await newInstance.approve(networks[chainId].address, MAX_INT);

    let receipt = await tx.wait();

    return receipt;
  } catch (error) {
    console.log(error);
    if (error.data) {
      window.alert(error.data.message);
    }
  }
};

const newContractInstance = async (walletType, walletProvider) => {
  if (walletType === "WALLET_CONNECT") {
    let signer = walletProvider.getSigner(0);
    let id = await walletProvider.getNetwork();

    console.log(id, id.chainId, "network id");

    return new ethers.Contract(bridgeETH, bridgeAbi, signer);
  } else {
    let newProvider = new ethers.providers.Web3Provider(window.ethereum);
    let id = await newProvider.getNetwork();

    console.log(id, id.chainId, "network id");
    let signer = newProvider.getSigner(0);

    return new ethers.Contract(networks[id.chainId].address, bridgeAbi, signer);
  }
};

const newTokenInstance = async (walletType, walletProvider) => {
  if (walletType === "WALLET_CONNECT") {
    let signer = walletProvider.getSigner(0);
    let id = await walletProvider.getNetwork();

    console.log(networks[id.chainId].token, id.chainId, "network id");

    return new ethers.Contract(bridgeETH, tokenAbi, signer);
  } else {
    let newProvider = new ethers.providers.Web3Provider(window.ethereum);
    let id = await newProvider.getNetwork();

    console.log(id, id.chainId, "network id");
    let signer = newProvider.getSigner(0);

    return new ethers.Contract(networks[id.chainId].token, tokenAbi, signer);
  }
};
