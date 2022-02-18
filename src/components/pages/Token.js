import { useParams } from "react-router";
import { getDate } from "../common/GetDate";
import Badge from "./../common/Badge";
import store from "store2";
import cake from "../../images/svg/cake.svg";
import Quantity from "./../common/Quantity";
import { useEffect, useRef, useState } from "react";
import truncate from "./../../services/truncate";
import { useLocation, useNavigate } from "react-router-dom";
import { checkForScrollbar } from "../../services/scrollbarService";
import Input from "../common/Input";
import {
  createOrder,
  cancelOrder,
  updateOrder,
  executeOrder,
} from "../../blockchain/functions";

export default function Token({
  getItems,
  type,
  userAddress,
  connectWallet,
  NFTs,
  walletType,
  ERC721Approved,
  approve,
  getUserDetails,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const [item, setItem] = useState(NFTs.find((item) => item.token_id === id));
  const [tabs, setTabs] = useState([true, false, false, false]);
  const scrollwrapper = useRef(null);
  const [scrollVisible, setScrollVisible] = useState(false);
  const [price, setPrice] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function changeTab(index) {
    setTabs(tabs.map((item, itemIndex) => itemIndex === index));
  }

  const handleBuy = async () => {
    setIsLoading(true);
    let receipt;
    if (type === "market") {
      receipt = await executeOrder(
        item.token_id,
        item.itemInfo.price,
        walletType
      );
      getItems();
      getUserDetails();
      navigate("/collection");
    } else {
      receipt = await createOrder(item.token_id, price, walletType);
      getUserDetails();
      getItems();
      navigate("/marketplace");
    }

    if (receipt) {
      console.log(receipt);
    }
    setIsLoading(false);
  };

  const handleApproval = async () => {
    setIsLoading(true);
    await approve();
    setIsLoading(false);
  };

  useEffect(() => {
    if (!scrollwrapper.current) return;

    setScrollVisible(checkForScrollbar(scrollwrapper.current));
  }, [tabs]);

  useEffect(async () => {
    if (NFTs.length === 0) {
      let items;
      if (location.pathname.split("/")[1] === "collection") {
        items = store.get("userNFTs");
      } else {
        items = store.get("marketNFTs");
        if (!items) {
          await getItems();
        }
      }
      if (items) {
        console.log(items);
        setItem(items.find((item) => item.token_id === id));
      }
    }
    console.log();
  }, []);

  useEffect(() => {
    setItem(NFTs.find((item) => item.token_id === id));
  }, [NFTs]);

  return (
    <div className="token container">
      <div className="token__image-wrapper">
        <img
          src={item?.metadata.image}
          alt={item?.metadata.name}
          className="token__image"
        />
      </div>
      <div className="token__column">
        <h1 className="token__title">Floki {item?.metadata.name}</h1>
        <div className="token__row">
          {item?.itemInfo && (
            <div className="price token__price">
              {" "}
              {Number(item?.itemInfo.price / 10 ** 18).toFixed(2)} BNB
            </div>
          )}

          {/* <Badge className="token__badge" item={item} /> */}
          {/* <a href="/" className="token__link">
            <img src={cake} alt="cake token" className="token__link-icon" />
            <span>On Pancake Swap</span>
          </a> */}
        </div>
        <p className="token__text">{item?.metadata.description}</p>

        <div className="token__row token__row--2">
          {type === "collection" ? (
            <>
              <div className="token__price-input">
                <Input
                  className="input-wrapper--bridge bridge__input-wrapper"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Price"
                  type="number"
                  displayType="input"
                />
                <h1 className="token__price-tag">BNB</h1>
              </div>
              <button
                disabled={isLoading}
                onClick={
                  userAddress
                    ? ERC721Approved
                      ? handleBuy
                      : handleApproval
                    : connectWallet
                }
                className="button token__button"
              >
                {!userAddress
                  ? "Connect Wallet to buy"
                  : ERC721Approved
                  ? "Sell"
                  : "Approve"}
              </button>
            </>
          ) : (
            <button
              disabled={isLoading}
              onClick={userAddress ? handleBuy : connectWallet}
              className="button token__button"
            >
              {!userAddress ? "Connect Wallet to buy" : "Buy"}
            </button>
          )}
        </div>
        <div className="token__tabs">
          <div className="token__tabs-buttons">
            <button
              className={"token__tabs-button" + (tabs[0] ? " active" : "")}
              onClick={() => changeTab(0)}
            >
              Info
            </button>
            <button
              className={"token__tabs-button" + (tabs[1] ? " active" : "")}
              onClick={() => changeTab(1)}
            >
              Attributes
            </button>
            {type === "market" && (
              <button
                className={"token__tabs-button" + (tabs[2] ? " active" : "")}
                onClick={() => changeTab(2)}
              >
                Owner
              </button>
            )}
            {/* <button
              className={"token__tabs-button" + (tabs[3] ? " active" : "")}
              onClick={() => changeTab(3)}
            >
              History
            </button> */}
          </div>
          <div className="token__tabs-wrapper">
            {tabs[0] && (
              <ul className="token__tabs-list">
                <li className="token__tabs-item">
                  <h6 className="token__tabs-name">Token id:</h6>
                  <p className="token__tabs-value">{item?.token_id}</p>
                </li>
                {/* <li className="token__tabs-item">
                                    <h6 className="token__tabs-name">Rank:</h6>
                                    <p className="token__tabs-value">{item.rank}</p>
                                </li> */}
                {item?.itemInfo && (
                  <li className="token__tabs-item">
                    <h6 className="token__tabs-name">Listed:</h6>
                    <p className="token__tabs-value">
                      {getDate(item?.itemInfo.createdAt)}
                    </p>
                  </li>
                )}
              </ul>
            )}
            {tabs[1] && (
              <ul className="token__tabs-list">
                {item?.metadata?.attributes?.map((el, index) => {
                  return (
                    <li key={index} className="token__tabs-item?">
                      <h6 className="token__tabs-name">{el.trait_type}</h6>
                      <p className="token__tabs-value">{el.value}</p>
                      <p className="token__tabs-name">
                        {el.rarity}% has this trait
                      </p>
                    </li>
                  );
                })}
              </ul>
            )}
            {tabs[2] && (
              <ul className="token__tabs-list">
                {item?.itemInfo && (
                  <li className="token__tabs-item">
                    <h6 className="token__tabs-name">Owner :</h6>
                    <p className="token__tabs-value">
                      {truncate(item?.itemInfo.seller, 20)}
                    </p>
                  </li>
                )}
              </ul>
            )}
            {tabs[3] && (
              <div className="table">
                <div className="table__header">
                  <div className="table__row">
                    {Object.entries(item?.history[0]).map(([key], index) => {
                      return (
                        key !== "id" && (
                          <div
                            className={
                              "table__text table__text--header table__column table__column--" +
                              (index + 1)
                            }
                            key={index}
                          >
                            {key}
                          </div>
                        )
                      );
                    })}
                  </div>
                </div>
                <div
                  className={
                    "scrollwrapper table__scrollwrapper" +
                    (scrollVisible ? " scroll-visible" : "")
                  }
                  ref={scrollwrapper}
                >
                  <div className="table__body">
                    {item?.history.map((item) => {
                      return (
                        <div className="table__row" key={item.id}>
                          {Object.entries(item).map(([key, value], index) => {
                            if (index === 3 || index === 4) {
                              return (
                                <div
                                  className={
                                    "table__column table__column--" +
                                    (index + 1)
                                  }
                                  key={index}
                                >
                                  <span className="table__text">
                                    {truncate(value, 20)}
                                  </span>
                                </div>
                              );
                            } else if (key !== "id") {
                              return (
                                <div
                                  className={
                                    "table__column table__column--" +
                                    (index + 1)
                                  }
                                  key={index}
                                >
                                  <span className="table__text">{value}</span>
                                </div>
                              );
                            } else {
                              return null;
                            }
                          })}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
