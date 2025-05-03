import "../../styles/components/dashboard/dashboard-navbar.scss";

import NavigationDropdown from "../../global/NavigationDropdown";
import React, { useEffect, useRef, useState } from "react";

function DashboardNavbar() {
    const playLinkRef = useRef<HTMLAnchorElement | null>(null);
    const navDropdownRef = useRef<HTMLDivElement | null>(null);

    const [playNavigationDropdownVisible, setPlayNavigationDropdownVisible] =
        useState<boolean>(false);

    const playLinks = [
        {
            linkName: "Pass and play",
            linkPath: "/pass-and-play",
        },

        {
            linkName: "Play vs human",
            linkPath: "/game-setup",
        },

        {
            linkName: "Play vs bot",
            linkPath: "/play-bot",
        }
    ];

    function handleMouseHover(event: MouseEvent) {
        const hoveringOverPlayLink =
            playLinkRef.current &&
            playLinkRef.current.contains(event.target as Node | null);
        const hoveringOverPlayDropdown =
            navDropdownRef.current &&
            navDropdownRef.current.contains(event.target as Node | null);

        const shouldDisplayDropdown =
            hoveringOverPlayLink || hoveringOverPlayDropdown;

        setPlayNavigationDropdownVisible(!!shouldDisplayDropdown);
    }

    useEffect(() => {
        document.addEventListener("mouseover", handleMouseHover);

        return () => {
            document.removeEventListener("mouseover", handleMouseHover);
        };
    }, []);

    return (
        <div className="dashboard-navbar">
            <div className="navigation-links">
                <div className="play-links-container">
                    <a
                        ref={playLinkRef}
                        href="/play"
                        className="play-link main-link"
                    >
                        Play
                    </a>

                    <NavigationDropdown
                        dropdownRef={navDropdownRef}
                        isVisible={playNavigationDropdownVisible}
                        navigationLinks={playLinks}
                    />
                </div>
            </div>

            <div className="account-links">
                <a href="/logout" className="logout-link">
                    Logout
                </a>
            </div>
        </div>
    );
}

export default DashboardNavbar;
