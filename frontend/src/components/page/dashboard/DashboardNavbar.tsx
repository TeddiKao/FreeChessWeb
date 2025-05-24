import { useState } from "react";
import "../../../styles/components/dashboard/dashboard-navbar.scss";
import { dashboardNavLinks } from "../../../constants/navLinksConfig";
import ParentLink from "./navbar/ParentLink";

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
			onMouseEnter={expandDashboardNavbar}
			onMouseLeave={collapseDashboardNavbar}
			onClick={expandDashboardNavbar}
			className="dashboard-navbar-container"
		>
			<div className="dashboard-navbar-main-links-container">
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

			<div className="dashboard-navbar-account-links-container">
				<div className="dashboard-navbar-account-link">
					<img className="dashboard-navbar-account-icon" src="/account-icon.svg" />
					<div className="dashboard-navbar-account-options"></div>
				</div>
			</div>
		</nav>
	);
}

export default DashboardNavbar;
