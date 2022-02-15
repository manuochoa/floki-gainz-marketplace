import "../../scss/components/swiper.scss";
import Arrow from '../../Icons/Arrow';

export default function CustomSwiper({ gallery, className }) {


    return (
        <div className={"swiper swiper--token " + (className ? className : "")}>
            <button className="swiper-button swiper-button--left">
                <Arrow className="swiper-button__arrow swiper-button__arrow--left" />
            </button>
            <div className="swiper-container">
                <ul className="swiper-wrapper">
                    {gallery.map(item => {
                        return (
                            <li className="swiper-slide" key={item.id}>
                                <img src={item.image} className="swiper-image" alt="token" />
                            </li>
                        );
                    })}
                </ul>
            </div>
            <button className="swiper-button swiper-button--right">
                <Arrow className="swiper-button__arrow swiper-button__arrow--right" />
            </button>
        </div>
    )
}