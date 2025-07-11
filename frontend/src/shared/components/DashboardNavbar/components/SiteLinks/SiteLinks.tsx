import { dashboardNavLinks } from "../../../../constants/navLinksConfig";
import MainLink from "./components/MainLink";

import "../../../../styles/DashboardNavbar/site-links.scss";
import { useState } from "react";
import { StateSetterFunction } from "../../../../types/utility.types";

interface SiteLinkProps {
	dashboardNavbarExpanded: boolean;
	expandedLink: string | null;
	setExpandedLink: StateSetterFunction<string | null>;
}

function SiteLinks({
	dashboardNavbarExpanded,
	expandedLink,
	setExpandedLink,
}: SiteLinkProps) {
	return (
		<div
			className={`site-links-container ${
				dashboardNavbarExpanded ? "expanded" : ""
			}`}
		>
			{dashboardNavLinks.map(({ name, icon, path, subLinks }, index) => {
				return (
					<MainLink
						key={index}
						linkName={name}
						linkPath={path}
						linkIcon={icon}
						dashboardNavbarExpanded={dashboardNavbarExpanded}
						linkExpanded={expandedLink === name}
						setExpandedLink={setExpandedLink}
						subLinks={subLinks}
					/>
				);
			})}
		</div>
	);
}

export default SiteLinks;
