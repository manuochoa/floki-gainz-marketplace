import { useEffect, useRef, useState } from "react";
import logo from "../images/logo.png";
import Social from "./common/Social";
import Menu from "./common/Menu";

export default function Header({
  userAddress,
  connectWallet,
  connectWalletConnect,
  disconnectWallet,
}) {
  const menu = useRef(null);
  const [menuOpened, setMenuOpened] = useState();

  useEffect(() => {
    function closeMenu(e) {
      if (menuOpened && e.target.closest(".menu--header") !== menu.current) {
        setMenuOpened(false);
      }
    }

    document.addEventListener("click", closeMenu);

    return () => {
      document.removeEventListener("click", closeMenu);
    };
  }, [menuOpened]);

  return (
    <header className="header">
      <div className="header__wrapper container">
        <a href="/" className="logo header__logo">
          <img src={logo} className="logo__icon" alt="logo" />
        </a>
        <div
          className={"header__columns" + (menuOpened ? " opened" : "")}
          ref={menu}
        >
          <Menu className="menu--header" />
          <div className="header__column">
            <Social className="social--header" />
            <button
              onClick={userAddress ? disconnectWallet : connectWallet}
              className="button button--header header__button"
            >
              {userAddress
                ? `${userAddress.slice(0, 6)}...${userAddress.slice(-8)}`
                : "Connect Wallet"}
            </button>
          </div>
        </div>
        <button
          className={"header__mobile-button" + (menuOpened ? " opened" : "")}
          onClick={() => setMenuOpened(!menuOpened)}
        >
          <span></span>
        </button>
      </div>
    </header>
  );
}
