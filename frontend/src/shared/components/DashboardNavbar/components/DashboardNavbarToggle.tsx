import "../../../styles/DashboardNavbar/dashboard-navbar-toggle.scss";

interface DashboardNavbarToggleProps {
	dashboardNavbarExpanded: boolean;
    toggle: () => void;
}

function DashboardNavbarToggle({
	dashboardNavbarExpanded,
    toggle
}: DashboardNavbarToggleProps) {
	function getToggleIcon() {
		if (dashboardNavbarExpanded) {
			return "/icons/dashboard/navbar/dashboard-navbar-expanded-toggle.svg";
		} else {
			return "/icons/dashboard/navbar/dashboard-navbar-collapsed-toggle.svg";
		}
	}

	return (
		<div onClick={toggle} className="dashboard-navbar-toggle-container">
			<img className="dashboard-navbar-toggle-icon" alt="Toggle icon" src="/icons/dashboard/navbar/menu.svg"/>
		</div>
	);
}

export default DashboardNavbarToggle;
