import { ethers } from "ethers";
import { NFTabi, marketAbi } from "./abis";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Metadata from "./newMeta.json";
import axios from "axios";

let provider = new ethers.providers.JsonRpcProvider(
  "https://bsc-dataseed1.ninicoin.io/"
);
let marketAddress = "0xF1e945eF6B918eA3741C2309Ac9475edC1e03Af5";
let NFTAddress = "0x5F5C8AbD50051e4F8d8325368c79A754F9E9bbC8";
let marketContract = new ethers.Contract(marketAddress, marketAbi, provider);
let NFTcontract = new ethers.Contract(NFTAddress, NFTabi, provider);

// NFT VIEW FUNCTIONS

export const getMintedNFTs = async () => {
  const totalSupply = await NFTcontract.totalSupply();

  return totalSupply;
};

// MARKETPLACE VIEW FUNCTIONS

export const getMarketNFTs = async () => {
  const marketNFTs = await NFTcontract.walletOfOwner(marketAddress);
  let floorPrice = "";
  let volume = await marketContract.totalVolumen();
  let minted = await NFTcontract.totalSupply();

  let tokens = await Promise.all(
    await marketNFTs.map(async (el) => {
      let metadata;
      let itemInfo = await marketContract.orderByTokenId(el);
      let bids = await marketContract.bidByTokenId(el);
      // let token_uri = await NFTcontract.tokenURI(el);
      //   itemInfo.price = Number(itemInfo[3]);
      //   itemInfo.createdAt = Number(itemInfo[2]);

      if (floorPrice === "") {
        floorPrice = Number(itemInfo.price);
      } else if (Number(floorPrice) > Number(itemInfo.price)) {
        floorPrice = Number(itemInfo.price);
      }

      try {
        // let info = await axios.get(token_uri);

        metadata = Metadata[Number(el) - 1];
        // metadata = info.data;
      } catch (error) {
        console.log(error, "axios getMarketNFTs");
      }

      return {
        token_id: el.toString(),
        metadata,
        itemInfo: {
          seller: itemInfo[0],
          id: Number(itemInfo[1]),
          createdAt: Number(itemInfo[2]),
          price: Number(itemInfo[3]),
        },
        bids,
      };
    })
  );

  return { tokens, floorPrice, volume, minted };
};

export const getUserNFTs = async (userAddress) => {
  const userNFTs = await NFTcontract.walletOfOwner(userAddress);

  let tokens = await Promise.all(
    await userNFTs.map(async (el) => {
      let metadata;
      let token_uri = await NFTcontract.tokenURI(el);

      try {
        // let info = await axios.get(token_uri);
        // metadata = info.data;
        metadata = Metadata[Number(el) - 1];
      } catch (error) {
        console.log(error, "axios getUserNFTs");
      }

      return {
        token_id: el.toString(),
        metadata,
      };
    })
  );

  return tokens;
};

export const checkERC721Allowance = async (userAddress) => {
  let marketApproval = await NFTcontract.isApprovedForAll(
    userAddress,
    marketAddress
  );

  return marketApproval;
};

// MARKETPLACE WRITE FUNCTIONS

export const createOrder = async (_tokenId, _price, walletType) => {
  try {
    let newMarketContract = await marketContractInstance(walletType);

    let price = ethers.utils.parseUnits(_price);

    let tx = await newMarketContract.createOrder(_tokenId, price);

    let receipt = await tx.wait();

    return receipt;
  } catch (error) {
    console.log(error);
    if (error.data) {
      window.alert(error.data.message);
    }
  }
};

export const cancelOrder = async (_tokenId, walletType) => {
  try {
    let newMarketContract = await marketContractInstance(walletType);

    let tx = await newMarketContract.cancelOrder(_tokenId);

    let receipt = await tx.wait();

    return receipt;
  } catch (error) {
    console.log(error, "cancelOrder");
    if (error.data) {
      window.alert(error.data.message);
    }
  }
};

export const updateOrder = async (_tokenId, _price, walletType) => {
  try {
    let newMarketContract = await marketContractInstance(walletType);

    let price = ethers.utils.parseUnits(_price);

    let tx = await newMarketContract.updateOrder(_tokenId, price);

    let receipt = await tx.wait();

    return receipt;
  } catch (error) {
    console.log(error, "updateOrder");
    if (error.data) {
      window.alert(error.data.message);
    }
  }
};

export const executeOrder = async (_tokenId, value, walletType) => {
  try {
    let newMarketContract = await marketContractInstance(walletType);

    let tx = await newMarketContract.executeOrder(_tokenId, {
      value: value.toString(),
    });

    let receipt = await tx.wait();

    return receipt;
  } catch (error) {
    console.log(error, "executeOrder");
    if (error.data) {
      window.alert(error.data.message);
    }
  }
};

export const placeBid = async (_tokenId, price, walletType) => {
  try {
    let newMarketContract = await marketContractInstance(walletType);

    let value = ethers.utils.parseUnits(price);

    let tx = await newMarketContract.placeBid(_tokenId, { value });

    let receipt = await tx.wait();

    return receipt;
  } catch (error) {
    console.log(error, "placeBid");
    if (error.data) {
      window.alert(error.data.message);
    }
  }
};

export const cancelBid = async (_tokenId, walletType) => {
  try {
    let newMarketContract = await marketContractInstance(walletType);

    let tx = await newMarketContract.cancelBid(_tokenId);

    let receipt = await tx.wait();

    return receipt;
  } catch (error) {
    console.log(error, "cancelBid");
    if (error.data) {
      window.alert(error.data.message);
    }
  }
};

export const acceptBid = async (_tokenId, walletType) => {
  try {
    let newMarketContract = await marketContractInstance(walletType);

    let tx = await newMarketContract.acceptBid(_tokenId);

    let receipt = await tx.wait();

    return receipt;
  } catch (error) {
    console.log(error, "acceptBid");
    if (error.data) {
      window.alert(error.data.message);
    }
  }
};

const marketContractInstance = async (walletType) => {
  if (walletType === "WALLET_CONNECT") {
    let newProvider = new WalletConnectProvider({
      rpc: {
        56: "https://bsc-dataseed1.ninicoin.io/",
      },
    });

    await newProvider.enable();
    let signer = newProvider.getSigner(0);

    return new ethers.Contract(marketAddress, marketAbi, signer);
  } else {
    let newProvider = new ethers.providers.Web3Provider(window.ethereum);
    let signer = newProvider.getSigner(0);

    return new ethers.Contract(marketAddress, marketAbi, signer);
  }
};

// NFT WRITE FUNCTIONS
export const approveERC721 = async (walletType) => {
  try {
    let newNFTcontract = await nftContractInstance(walletType);

    let tx = await newNFTcontract.setApprovalForAll(marketAddress, "true");

    const receipt = await tx.wait();
    if (receipt) {
      return true;
    }
  } catch (error) {
    console.log(error, "approveERC721");
    throw error;
  }
};

const nftContractInstance = async (walletType) => {
  if (walletType === "WALLET_CONNECT") {
    let newProvider = new WalletConnectProvider({
      rpc: {
        56: "https://bsc-dataseed1.ninicoin.io/",
      },
    });

    await newProvider.enable();
    let signer = newProvider.getSigner(0);

    return new ethers.Contract(NFTAddress, NFTabi, signer);
  } else {
    let newProvider = new ethers.providers.Web3Provider(window.ethereum);
    let signer = newProvider.getSigner(0);

    return new ethers.Contract(NFTAddress, NFTabi, signer);
  }
};
