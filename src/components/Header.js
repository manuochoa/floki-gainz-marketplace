import { useEffect, useState } from "react";
import logo from "../images/logo.png";
import Social from './common/Social';
import Menu from './common/Menu';

export default function Header({ sections }) {
    const [mobileScreen, setMobileScreen] = useState();
    const [menuOpened, setMenuOpened] = useState();

    const handleMobileScreen = () => {
        setMobileScreen(window.innerWidth < 990);
    }

    function menuCallback() {
        setMenuOpened(false);
    }

    useEffect(() => {
        handleMobileScreen();

        window.addEventListener('resize', handleMobileScreen);

        return () => {
            window.removeEventListener('resize', handleMobileScreen);
        }
    }, []);

    return (
        <header className="header">
            <div className="header__wrapper container">
                <a href="/" className="logo header__logo">
                    <img src={logo} className="logo__icon" alt="logo" />
                </a>
                {!mobileScreen && <Menu className="menu--header" sections={sections} />}
                <div className="header__column">
                    <Social className="social--header" />
                    <a href="/" className="button button--header header__button">Connect wallet</a>
                    <button className={"header__mobile-button" + (menuOpened ? " opened" : "")} onClick={() => setMenuOpened(!menuOpened)}><span></span></button>
                </div>
            </div>
            {mobileScreen && <Menu className="menu--header" sections={sections} opened={menuOpened ? " opened" : ""} menuCallback={menuCallback} />}
        </header>
    )
}