import { useState } from "react";
import "../../../styles/components/dashboard/dashboard-navbar.scss"
import { dashboardNavLinks } from "../../../constants/navLinksConfig";

function DashboardNavbar() {
    const [dashboardNavbarExpanded, setDashboardNavbarExpanded] = useState(false);
    
    return (
        <div className="dashboard-navbar-container">
            {dashboardNavLinks.map(({ name, icon, subLinks }) => (
                <div className="dashboard-navbar-parent-link-container">
                    <img className="dashboard-navbar-parent-link-icon" src={icon} alt="" />
                    {dashboardNavbarExpanded && (
                        <p className="dashboard-navbar-parent-link-name">{name}</p>
                    )}
                </div>
            ))}
        </div>
    )
}

export default DashboardNavbar;
