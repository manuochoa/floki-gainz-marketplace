import { useState } from 'react';
import CustomSwiper from './CustomSwiper';

import img1 from "../../images/swiper/img1.png";
import img2 from "../../images/swiper/img2.png";
import Quantity from '../common/Quantity';

export default function Minting({ refProp }) {
    const [itemIndex, setItemIndex] = useState(0);
    const [value, setValue] = useState(1);
    const [gallery] = useState([
        {
            price: 2,
            id: 2,
            image: img2
        },
        {
            price: 4,
            id: 1,
            image: img1
        },
    ]);

    return (
        <div className="product container" ref={refProp}>
            <CustomSwiper gallery={gallery} setItemIndex={setItemIndex} className="product__column product__column--1" />
            <div className="product__column product__column--2">
                <h1 className="title product__title">Minting</h1>
                <ul className="product__list">
                    <li className="product__item">
                        <h4 className="product__item-title">Account</h4>
                        <span className="product__item-text product__item-text--address">Please connect wallet</span>
                    </li>
                    <li className="product__item">
                        <h4 className="product__item-title">Amount</h4>
                        <Quantity className="quantity--product" value={value} setValue={setValue} />
                    </li>
                    <li className="product__item">
                        <h4 className="product__item-title">Total price</h4>
                        <span className="product__item-text">{gallery[itemIndex].price * value} ETH</span>
                    </li>
                </ul>
                <button className="product__button button">Buy Now</button>
            </div>
        </div>
    )
}
