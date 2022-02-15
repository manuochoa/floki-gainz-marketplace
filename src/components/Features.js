import image from "../images/features/image.png";

const featuresArray = [
    {
        title: "Fitness Competitions",
        text: "Our token gives you BIG incentive to shed those unwanted pounds, gain muscle and vastly improve your overall health! Join our regular community competitions to win real $BUSD!",
        image
    },
    {
        title: "Weekly Lottery",
        text: "Hold onto your $GAINZ, don't sell ANY and you'll be eligible to win money in our HUGE lotteries!",
        image
    },
    {
        title: "Highly Experienced Dev",
        text: "Our dev Stefan has years of experience and is highly trusted in the crypto world. He has several ongoing, long-standing projects and is NOT going anywhere!",
        image
    },
    {
        title: "Dedicated, Full Marketing Wallet",
        text: "Lack of Marketing KILLS projects. That's why we apply a small tax to all transactions to assure we get the BEST influencers, the BEST ads and the BIGGEST pumps! Prepare to moon with us!",
        image
    }
];

export default function Features({ refProp }) {
    return (
        <ul className="features" ref={refProp}>
            {featuresArray.map((item, index) => {
                return (
                    <li className="features__item" key={index}>
                        <div className="features__item-wrapper container">
                            <div className="features__item-column">
                                <h2 className="features__item-title title">{item.title}</h2>
                                <p className="features__item-text">{item.text}</p>
                            </div>
                            <img src={item.image} className="features__item-image" alt={item.title} />
                        </div>
                    </li>
                );
            })}
        </ul>
    )
}
