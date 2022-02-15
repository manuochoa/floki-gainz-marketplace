import bg1 from "../images/token/bg1.svg";
import bg2 from "../images/token/bg2.svg";

export default function Tokenomics({ refProp }) {

    return (
        <div className="token" ref={refProp}>
            <img src={bg1} className="token__background token__background--1" alt="bg1" />
            <div className="token__wrapper container">
                <h1 className="title token__title">Tokenomics</h1>
                <ul className="token__list">
                    <li className="token__item">
                        <h3 className="token__item-title">Token tax</h3>
                        <p className="token__item-text">
                            10% will be used as a token tax, of which 6% will be used for marketing and partnerships, and 4% used for the various lotteries we will be running.
                        </p>
                    </li>
                    <li className="token__item">
                        <h3 className="token__item-title">Marketing & Development</h3>
                        <p className="token__item-text">
                            Since we aim to push marketing hard, we have applied the majority of the transaction tax into this. This will ensure the project and the investors benefit from continued price action. Funds will also be used to develop the various use cases of the token.
                        </p>
                    </li>
                    <li className="token__item">
                        <h3 className="token__item-title">LOTTERY</h3>
                        <p className="token__item-text">
                            4% of the transactional tax will be applied for the lotteries we will be running, such as the smaller monthly holder lottery, and the larger fitness challenges.
                        </p>
                    </li>
                </ul>
                <div className="token__desc-wrapper">
                    <p className="token__desc">500 million total supply. 10% transactional tax: 6% marketing, 4% lotteries. Market cap on Launch: approx. $400.000 - $500.000</p>
                </div>
            </div>
            <img src={bg2} className="token__background token__background--2" alt="bg2" />
        </div>
    )
}
