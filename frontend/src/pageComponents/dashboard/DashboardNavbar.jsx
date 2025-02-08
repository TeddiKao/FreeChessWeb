import "../../styles/dashboard/dashboard-navbar.css";

function DashboardNavbar() {
    const playLinks = [
        {
            linkName: "Pass and play",
            linkPath: "/pass-and-play",
        },
    ];

    return (
        <div className="dashboard-navbar">
            <div className="navigation-links">
                <div className="play-links-container">
                    <a href="/play" className="play-link">
                        Play
                    </a>

                    <NavigationDropdown navigationLinks={playLinks} className="play-navigation-dropdown"/>
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
