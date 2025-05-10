import { useState } from "react";

type ParentLinkProps = {
    icon: string,
    name: string,
    subLinks?: Array<{ name: string, path: string, icon: string }>
    dashboardNavbarExpanded: boolean,
}

function ParentLink({ icon, name, subLinks, dashboardNavbarExpanded }: ParentLinkProps) {
    const [parentLinkExpanded, setParentLinkExpanded] = useState(false);

    function toggleParentLinkExpandedState() {
        setParentLinkExpanded((prevExpanded) => !prevExpanded);
    }

    return (
        <div className="dashboard-navbar-parent-link-container">
            <img className="dashboard-navbar-parent-link-icon" src={icon} alt="" />
            {dashboardNavbarExpanded && (
                <p onClick={toggleParentLinkExpandedState} className="dashboard-navbar-parent-link-name"></p>
            )}
        </div>
    )
}

export default ParentLink;