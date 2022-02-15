import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

export default function Menu({ className, opened, menuCallback }) {

    const menu = useRef(null);

    useEffect(() => {
        function closeMenu(e) {
            if (opened && (e.target.closest('.menu--header') !== menu.current)) {
                menuCallback();
            }
        }

        document.addEventListener('click', closeMenu);

        return () => {
            document.removeEventListener('click', closeMenu);
        }
    }, [menuCallback, opened]);

    return (
        <ul className={"menu " + (className ? className : "") + (opened || "")} ref={menu}>
            <li className="menu__item">
                <Link to="/" className="menu__link">Home</Link>
            </li>
            <li className="menu__item">
                <Link to="/marketplace" className="menu__link">Marketplace</Link>
            </li>
            <li className="menu__item">
                <Link to="/collection" className="menu__link">Collection</Link>
            </li>
        </ul>
    );
}