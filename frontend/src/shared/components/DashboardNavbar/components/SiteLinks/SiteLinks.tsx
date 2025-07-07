import { dashboardNavLinks } from "../../../../constants/navLinksConfig";
import MainLink from "./components/MainLink";

interface SiteLinkProps {
	dashboardNavbarExpanded: boolean;
}

function SiteLinks({ dashboardNavbarExpanded }: SiteLinkProps) {
	return (
		<div className="site-links-container">
			{dashboardNavLinks.map(({ name, icon, path }, index) => {
				return (
					<MainLink
						key={index}
						linkName={name}
						linkPath={path}
						linkIcon={icon}
						dashboardNavbarExpanded={dashboardNavbarExpanded}
					/>
				);
			})}
		</div>
	);
}

export default SiteLinks;
