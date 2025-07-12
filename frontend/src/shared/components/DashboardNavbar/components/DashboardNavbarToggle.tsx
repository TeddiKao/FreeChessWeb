import "@sharedStyles/DashboardNavbar/dashboard-navbar-toggle.scss";

interface DashboardNavbarToggleProps {
	dashboardNavbarExpanded: boolean;
	toggle: () => void;
}

function DashboardNavbarToggle({
	dashboardNavbarExpanded,
	toggle,
}: DashboardNavbarToggleProps) {
	function getToggleIcon() {
		if (dashboardNavbarExpanded) {
			return "/icons/dashboard/navbar/toggle/navbar-expanded.svg";
		} else {
			return "/icons/dashboard/navbar/toggle/navbar-collapsed.svg";
		}
	}

	return (
		<div onClick={toggle} className="dashboard-navbar-toggle-container">
			<div className="dashboard-navbar-toggle-icon-container">
				<img
					className="dashboard-navbar-toggle-icon"
					src={getToggleIcon()}
				/>
			</div>
		</div>
	);
}

export default DashboardNavbarToggle;
