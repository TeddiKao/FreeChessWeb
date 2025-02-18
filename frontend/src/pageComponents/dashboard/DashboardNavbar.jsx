import "../../styles/dashboard/dashboard-navbar.css";

import NavigationDropdown from "../../globalComponents/NavigationDropdown.jsx";
import { useEffect, useRef, useState } from "react";

function DashboardNavbar() {
    const playLinkRef = useRef(null);
    const navDropdownRef = useRef(null);

    const [playNavigationDropdownVisible, setPlayNavigationDropdownVisible] = useState(false);

    const playLinks = [
        {
            linkName: "Pass and play",
            linkPath: "/pass-and-play",
        },

        {
            linkName: "Play vs human",
            linkPath: "/select-time-control"
        }
    ];

    function handleMouseHover(event) {
        const hoveringOverPlayLink = (playLinkRef.current) && (playLinkRef.current.contains(event.target));
        const hoveringOverPlayDropdown = (navDropdownRef.current) && (navDropdownRef.current.contains(event.target))

        setPlayNavigationDropdownVisible(hoveringOverPlayLink || hoveringOverPlayDropdown);
    }

    useEffect(() => {
        document.addEventListener("mouseover", handleMouseHover);

        return () => {
            document.removeEventListener("mouseover", handleMouseHover);
        }
    }, []);

    return (
        <div className="dashboard-navbar">
            <div className="navigation-links">
                <div className="play-links-container">
                    <a ref={playLinkRef} href="/play" className="play-link main-link">
                        Play
                    </a>

                    <NavigationDropdown dropdownRef={navDropdownRef} isVisible={playNavigationDropdownVisible} navigationLinks={playLinks} className="play-navigation-dropdown"/>
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
