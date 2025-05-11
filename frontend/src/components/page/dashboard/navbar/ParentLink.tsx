import { useEffect, useState } from "react";
import SubLink from "./SubLink";

type ParentLinkProps = {
	icon: string;
	name: string;
	subLinks?: Array<{ name: string; path: string; icon: string }>;
    path?: string;
	dashboardNavbarExpanded: boolean;
};

import "../../../../styles/components/dashboard/navbar/parent-link.scss";
import { useNavigate } from "react-router-dom";

function ParentLink({
	icon,
	name,
	subLinks,
	dashboardNavbarExpanded,
    path
}: ParentLinkProps) {
	const [parentLinkExpanded, setParentLinkExpanded] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!dashboardNavbarExpanded) {
            setParentLinkExpanded(false);
        }
    }, [dashboardNavbarExpanded]);

	function toggleParentLinkExpandedState() {
		setParentLinkExpanded((prevExpanded) => !prevExpanded);
	}

    function handleParentLinkNavigation() {
        if (path) {
            navigate(path);
        }
    }

	return (
		<div onClick={handleParentLinkNavigation} className="dashboard-navbar-parent-link-container">
			<div onClick={toggleParentLinkExpandedState} className="dashboard-navbar-parent-link-info">
				<img
					className="dashboard-navbar-parent-link-icon"
					src={icon}
					alt={`${name} icon`}
				/>

				{dashboardNavbarExpanded && (
					<p
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
