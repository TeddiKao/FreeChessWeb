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
		<nav className="dashboard-navbar-container">
			<AccountInfo />
			<DashboardNavbarToggle
				dashboardNavbarExpanded={dashboardNavbarExpanded}
				toggle={toggleDashboardNavbar}
			/>
			<SiteLinks />
		</nav>
	);
}

export default DashboardNavbar;
