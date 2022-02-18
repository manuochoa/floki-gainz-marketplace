import { Link } from "react-router-dom";
import { getDate } from "../../common/GetDate";
import Badge from "./../../common/Badge";
import { useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

export default function TokenCard({ item }) {
  const location = useLocation();
  //
  useEffect(() => {
    // let path = location.pathname;
    // console.log(typeOf);
  }, []);

  return (
    <Link
      to={
        location.pathname === "/collection"
          ? `/collection/${item.token_id}`
          : `/marketplace/${item.token_id}`
      }
      className="card card--token"
    >
      <div className="card__image-wrapper">
        {/* <Badge item={item} className="card__badge" /> */}
        <img
          src={item.metadata.image}
          alt={item.metadata.name}
          className="card__image"
        />
      </div>
      <div className="card__row card__row--top">
        <h2 className="card__title">Floki {item.metadata.name}</h2>
        {item.itemInfo && (
          <div className="price card__price">
            {Number(item.itemInfo.price / 10 ** 18).toFixed(2)} BNB
          </div>
        )}
      </div>
      <div className="card__text">
        <span>Token id:</span>
        &nbsp;
        <strong>{item.token_id}</strong>
      </div>
      <div className="card__row card__row--footer">
        <span className="card__text">
          {item.itemInfo && `Listed ${getDate(item.itemInfo.createdAt)}`}
        </span>
        {/* <span className="card__text">Rank {item.rank}</span> */}
      </div>
    </Link>
  );
}
