import { dashboardNavLinks } from "../../../../constants/navLinksConfig";
import MainLink from "./components/MainLink";

import "../../../../styles/DashboardNavbar/site-links.scss";
import { useState } from "react";

interface SiteLinkProps {
	dashboardNavbarExpanded: boolean;
}

function SiteLinks({ dashboardNavbarExpanded }: SiteLinkProps) {
	const [expandedLink, setExpandedLink] = useState<string | null>(null);

	return (
		<div className="site-links-container">
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
