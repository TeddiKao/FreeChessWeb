import { useState } from "react";
import "../../../styles/components/dashboard/dashboard-navbar.scss";
import { dashboardNavLinks } from "../../../constants/navLinksConfig";
import ParentLink from "./navbar/ParentLink";

function DashboardNavbar() {
	const [dashboardNavbarExpanded, setDashboardNavbarExpanded] =
		useState(false);

	return (
		<div className="dashboard-navbar-container">
			{dashboardNavLinks.map(({ name, icon, subLinks }, index) => (
				<ParentLink
					key={index}
					name={name}
					icon={icon}
					subLinks={subLinks}
                    dashboardNavbarExpanded={dashboardNavbarExpanded}
				/>
			))}
		</div>
	);
}

export default DashboardNavbar;
