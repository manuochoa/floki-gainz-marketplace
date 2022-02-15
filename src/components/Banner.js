import bannerImage from "../images/banner/banner.png";

export default function Banner({ refProp }) {
    return (
        <div className="banner container" ref={refProp}>
            <div className="banner__column banner__column--1">
                <h1 className="title banner__title">Welcome to floki gainz! $GAINZ <span className="title__red">stands to be the</span> biggest, buffest <span className="title__red">token launch</span> in <span className="title__number">2022</span>!</h1>
                <div className="banner__buttons">
                    <a href="/" className="button button--beige banner__button">GET Started</a>
                    <a href="/" className="button banner__button">MINTING</a>
                </div>
            </div>
            <div className="banner__column banner__column--2">
                <img src={bannerImage} alt="logo" className="banner__image" />
            </div>
        </div>
    )
}
