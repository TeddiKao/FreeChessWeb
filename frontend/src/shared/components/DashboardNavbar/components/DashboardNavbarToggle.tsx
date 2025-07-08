interface DashboardNavbarToggleProps {
	dashboardNavbarExpanded: boolean;
}

function DashboardNavbarToggle({
	dashboardNavbarExpanded,
}: DashboardNavbarToggleProps) {
	function getToggleIcon() {
		if (dashboardNavbarExpanded) {
			return "/icons/dashboard/navbar/toggle/collapse.svg";
		} else {
			return "/icons/dashboard/navbar/toggle/expand.svg";
		}
	}

	return (
		<div className="dashboard-navbar-toggle-container">
			<img
				className="dashboard-navbar-toggle-icon"
				src={getToggleIcon()}
			/>
		</div>
	);
}

export default DashboardNavbarToggle;
