import TokenCard from ".//marketplace/TokenCard";
import { tokens } from "../../services/constants";

import { useEffect } from "react";

export default function Collections({ userNFTs, userOrders }) {
  useEffect(() => {}, []);

  return (
    <div className="marketplace">
      <div className="marketplace__wrapper container">
        <div className="marketplace__header">
          <h1 className="token__title">My Items</h1>
        </div>
        <div className="marketplace__columns">
          {userNFTs.length > 0 ? (
            <ul className="marketplace__column marketplace__column--2 cards-list cards-list--marketplace">
              {userNFTs.map((item, index) => {
                return (
                  <li className="cards-list__item" key={index}>
                    <TokenCard item={item} />
                  </li>
                );
              })}
            </ul>
          ) : (
            <h2>No Items</h2>
          )}
        </div>
      </div>
    </div>
  );
}
