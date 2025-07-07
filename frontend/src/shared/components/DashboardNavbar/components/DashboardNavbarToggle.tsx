import "../../../styles/DashboardNavbar/dashboard-navbar-toggle.scss";

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
			<img className="dashboard-navbar-toggle-icon" alt="Toggle icon" src="/icons/dashboard/navbar/menu.svg"/>
		</div>
	);
}

export default DashboardNavbarToggle;
