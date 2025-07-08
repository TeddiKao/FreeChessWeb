import { useNavigate } from "react-router-dom";
import "../../../../../styles/DashboardNavbar/links/main-link.scss";
import { useContext } from "react";
import { ExpandNavbarContext } from "../../../DashboardNavbar";

interface MainLinkProps {
	linkName: string;
	linkPath?: string;
	linkIcon: string;
	subLinks?: Array<{ name: string; path: string; icon: string }>;

	dashboardNavbarExpanded: boolean;
}

function MainLink({
	linkName,
	linkPath,
	linkIcon,
	subLinks,
	dashboardNavbarExpanded,
}: MainLinkProps) {
	const navigate = useNavigate();
	const expandDashboardNavbar = useContext(ExpandNavbarContext);

	function handleRedirect() {
		if (!expandDashboardNavbar) return;

		if (!linkPath) {
			expandDashboardNavbar();
			return;
		};

		navigate(linkPath);
	}

	return (
		<div onClick={handleRedirect} className="main-link-container">
			<img className="main-link-icon" alt="Link icon" src={linkIcon} />
            {dashboardNavbarExpanded && (
                <p className="main-link-name">{linkName}</p>
            )}
		</div>
	);
}

export default MainLink;
