import { useState } from "react";
import SubLink from "./SubLink";

type ParentLinkProps = {
	icon: string;
	name: string;
	subLinks?: Array<{ name: string; path: string; icon: string }>;
	dashboardNavbarExpanded: boolean;
};

import "../../../../styles/components/dashboard/navbar/parent-link.scss";

function ParentLink({
	icon,
	name,
	subLinks,
	dashboardNavbarExpanded,
}: ParentLinkProps) {
	const [parentLinkExpanded, setParentLinkExpanded] = useState(false);

	function toggleParentLinkExpandedState() {
		setParentLinkExpanded((prevExpanded) => !prevExpanded);
	}

	return (
		<div className="dashboard-navbar-parent-link-container">
			<div className="dashboard-navbar-parent-link-info">
				<img
					className="dashboard-navbar-parent-link-icon"
					src={icon}
					alt=""
				/>

				{dashboardNavbarExpanded && (
					<p
						onClick={toggleParentLinkExpandedState}
						className="dashboard-navbar-parent-link-name"
					>
						{name}
					</p>
				)}
			</div>

			{parentLinkExpanded && dashboardNavbarExpanded && subLinks && (
				<div className="dashboard-navbar-sublinks-container">
					{subLinks.map(({ name, path, icon }, index) => (
						<SubLink
							key={index}
							name={name}
							path={path}
							icon={icon}
						/>
					))}
				</div>
			)}
		</div>
	);
}

export default ParentLink;
