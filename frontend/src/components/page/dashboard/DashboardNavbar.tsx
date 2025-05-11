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
		<div
			onMouseEnter={expandDashboardNavbar}
			onMouseLeave={collapseDashboardNavbar}
			onClick={expandDashboardNavbar}
			className="dashboard-navbar-container"
		>
			{dashboardNavLinks.map(({ name, icon, subLinks, path }, index) => (
				<ParentLink
					key={index}
					name={name}
					icon={icon}
					subLinks={subLinks}
					path={path}
					dashboardNavbarExpanded={dashboardNavbarExpanded}
				/>
			))}
		</div>
	);
}

export default DashboardNavbar;
