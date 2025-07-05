import { useState } from "react";
import "../../../styles/components/dashboard/dashboard-navbar.scss";
import { dashboardNavLinks } from "../../../constants/navLinksConfig";
import ParentLink from "./components/ParentLink";
import AccountLinks from "./components/AccountLinks";

function DashboardNavbar() {
	const [dashboardNavbarExpanded, setDashboardNavbarExpanded] =
		useState(false);

	function expandDashboardNavbar() {
		setDashboardNavbarExpanded(true);
	}

	function collapseDashboardNavbar() {
		setDashboardNavbarExpanded(false);
	}

	return (
		<nav
			aria-label="Dashboard navigation bar"
			className="dashboard-navbar-container"
		>
			<div
				onMouseEnter={expandDashboardNavbar}
				onMouseLeave={collapseDashboardNavbar}
				onClick={expandDashboardNavbar}
				className="dashboard-navbar-main-links-container"
			>
				{dashboardNavLinks.map(
					({ name, icon, subLinks, path }, index) => (
						<ParentLink
							key={index}
							name={name}
							icon={icon}
							subLinks={subLinks}
							path={path}
							dashboardNavbarExpanded={dashboardNavbarExpanded}
						/>
					)
				)}
			</div>

			<AccountLinks />
		</nav>
	);
}

export default DashboardNavbar;
