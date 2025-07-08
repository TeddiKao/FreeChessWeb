import AccountInfo from "./components/AccountInfo";
import "../../styles/DashboardNavbar/dashboard-navbar.scss";
import SiteLinks from "./components/SiteLinks/SiteLinks";
import { useState } from "react";
import DashboardNavbarToggle from "./components/DashboardNavbarToggle";

function DashboardNavbar() {
	const [dashboardNavbarExpanded, setDashboardNavbarExpanded] =
		useState(false);

	function toggleDashboardNavbar() {
		setDashboardNavbarExpanded((prevExpanded) => !prevExpanded);
	}

	return (
		<nav
			className={`dashboard-navbar-container ${
				dashboardNavbarExpanded ? "expanded" : ""
			}`}
		>
			<nav className="main-navbar-content">
				<AccountInfo />
				<SiteLinks dashboardNavbarExpanded={dashboardNavbarExpanded} />
			</nav>

			<DashboardNavbarToggle toggle={toggleDashboardNavbar} dashboardNavbarExpanded={dashboardNavbarExpanded} />
		</nav>
	);
}

export default DashboardNavbar;
