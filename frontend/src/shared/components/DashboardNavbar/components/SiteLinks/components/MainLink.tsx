import { useNavigate } from "react-router-dom";
import "../../../../../styles/DashboardNavbar/links/main-link.scss";
import { useContext } from "react";
import { ExpandNavbarContext } from "../../../DashboardNavbar";
import SubLink from "./SubLink";

interface MainLinkProps {
	linkName: string;
	linkPath?: string;
	linkIcon: string;
	subLinks?: Array<{ name: string; path: string; icon: string }>;

	dashboardNavbarExpanded: boolean;
	linkExpanded: boolean;
}

function MainLink({
	linkName,
	linkPath,
	linkIcon,
	subLinks,
	dashboardNavbarExpanded,
	linkExpanded,
}: MainLinkProps) {
	const navigate = useNavigate();
	const expandDashboardNavbar = useContext(ExpandNavbarContext);

	function handleRedirect() {
		if (!expandDashboardNavbar) return;

		if (!linkPath) {
			expandDashboardNavbar();
			return;
		}

		navigate(linkPath);
	}

	return (
		<div onClick={handleRedirect} className="main-link-container">
			<img className="main-link-icon" alt="Link icon" src={linkIcon} />
			{dashboardNavbarExpanded && (
				<p className="main-link-name">{linkName}</p>
			)}

			{linkExpanded && subLinks && (
				<div className="sub-links-container">
					{subLinks?.map(({ name, path, icon }, index) => {
						return (
							<SubLink
								linkName={name}
								linkIcon={icon}
								linkPath={path}
								key={index}
							/>
						);
					})}
				</div>
			)}
		</div>
	);
}

export default MainLink;
