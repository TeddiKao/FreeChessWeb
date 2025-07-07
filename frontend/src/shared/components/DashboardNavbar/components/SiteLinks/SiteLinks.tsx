import { dashboardNavLinks } from "../../../../constants/navLinksConfig";
import MainLink from "./components/MainLink";

function SiteLinks() {
	return (
		<div className="site-links-container">
			{dashboardNavLinks.map(({ name, icon, path }, index) => {
				return (
					<MainLink
						key={index}
						linkName={name}
						linkPath={path}
						linkIcon={icon}
					/>
				);
			})}
		</div>
	);
}

export default SiteLinks;
