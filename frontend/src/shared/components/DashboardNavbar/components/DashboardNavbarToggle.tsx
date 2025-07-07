interface DashboardNavbarToggleProps {
	dashboardNavbarExpanded: boolean;
    toggle: () => void;
}

function DashboardNavbarToggle({
	dashboardNavbarExpanded,
    toggle
}: DashboardNavbarToggleProps) {
	return (
		<div onClick={toggle} className="dashboard-navbar-toggle-container">
			{dashboardNavbarExpanded ? "<" : ">"}
		</div>
	);
}

export default DashboardNavbarToggle;
