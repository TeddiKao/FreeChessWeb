import { useNavigate } from "react-router-dom";
import "@sharedStyles/DashboardNavbar/links/main-link.scss";
import { useContext } from "react";
import { ExpandNavbarContext } from "@sharedComponents/DashboardNavbar/DashboardNavbar";
import SubLink from "@sharedComponents/DashboardNavbar/components/SiteLinks/components/SubLink";
import { StateSetterFunction } from "@sharedTypes/utility.types";

interface MainLinkProps {
	linkName: string;
	linkPath?: string;
	linkIcon: string;
	subLinks?: Array<{ name: string; path: string; icon: string }>;

	dashboardNavbarExpanded: boolean;
	linkExpanded: boolean;
	setExpandedLink: StateSetterFunction<string | null>;
}

function MainLink({
	linkName,
	linkPath,
	linkIcon,
	subLinks,
	dashboardNavbarExpanded,
	linkExpanded,
	setExpandedLink,
}: MainLinkProps) {
	const navigate = useNavigate();
	const expandDashboardNavbar = useContext(ExpandNavbarContext);

	function handleRedirect() {
		if (!expandDashboardNavbar) return;

		if (!linkPath) {
			expandDashboardNavbar();
			setExpandedLink(linkName);
			return;
		}

		navigate(linkPath);
	}

	return (
		<div onClick={handleRedirect} className="main-link-container">
			<div
				className={`main-link-content ${
					dashboardNavbarExpanded ? "expanded" : ""
				}`}
			>
				<img
					className="main-link-icon"
					alt="Link icon"
					src={linkIcon}
				/>
				{dashboardNavbarExpanded && (
					<p className="main-link-name">{linkName}</p>
				)}
			</div>

			{linkExpanded && subLinks && dashboardNavbarExpanded && (
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
