import "../../styles/dashboard/dashboard-navbar.css"

function DashboardNavbar() {
	return (
		<div className="dashboard-navbar">
            <div className="navigation-links">
                <a href="/play" className="play-link">Play</a>
            </div>

            <div className="account-links">
                <a href="/logout" className="logout-link">Logout</a>
            </div>
        </div>
	)
}

export default DashboardNavbar