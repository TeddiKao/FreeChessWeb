import AccountInfo from "./components/AccountInfo";
import "../../styles/DashboardNavbar/dashboard-navbar.scss";
import SiteLinks from "./components/SiteLinks/SiteLinks";
import { createContext, useState } from "react";
import DashboardNavbarToggle from "./components/DashboardNavbarToggle";

type ExpandNavbarContextType = (() => void) | undefined

export const ExpandNavbarContext = createContext<ExpandNavbarContextType>(undefined);

function DashboardNavbar() {
	const [dashboardNavbarExpanded, setDashboardNavbarExpanded] =
		useState(false);
	const [expandedLink, setExpandedLink] = useState<string | null>(null);

	function toggleDashboardNavbar() {
		setDashboardNavbarExpanded((prevExpanded) => !prevExpanded);
	}

	function expandDashboardNavbar() {
		setDashboardNavbarExpanded(true);
	}

	return (
		<ExpandNavbarContext.Provider value={expandDashboardNavbar}>
			<nav className="dashboard-navbar-container">
				<nav
					className={`main-navbar-content ${
						dashboardNavbarExpanded ? "expanded" : ""
					}`}
				>
					<AccountInfo dashboardNavbarExpanded={dashboardNavbarExpanded} />
					<SiteLinks
						dashboardNavbarExpanded={dashboardNavbarExpanded}
						expandedLink={expandedLink}
						setExpandedLink={setExpandedLink}
					/>
				</nav>

				<DashboardNavbarToggle
					toggle={toggleDashboardNavbar}
					dashboardNavbarExpanded={dashboardNavbarExpanded}
				/>
			</nav>
		</ExpandNavbarContext.Provider>
	);
}

export default DashboardNavbar;
