import React, { useEffect } from "react";

export default function Badge({ item, className }) {
  const getRarity = () => {
    let index = item?.metadata?.rarityIndex;
    let rarity;
    if (Number(index) < 180) {
      rarity = "legend";
    } else if (Number(index) < 230) {
      rarity = "epic";
    } else if (Number(index) < 300) {
      rarity = "rare";
    } else if (Number(index) < 360) {
      rarity = "uncommon";
    } else {
      rarity = "common";
    }
    return rarity;
  };

  useEffect(() => {
    getRarity();
  }, []);

  return (
    <div
      className={
        "badge badge--" + getRarity() + " " + (className ? className : "")
      }
    >
      {getRarity()}
    </div>
  );
}
