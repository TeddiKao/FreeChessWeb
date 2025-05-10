import DashboardNavbar from "../../components/page/dashboard/DashboardNavbar.tsx";
import UserGreeting from "../../components/page/dashboard/UserGreeting.tsx";

import "../../styles/pages/dashboard.scss";

function Dashboard() {
	return (
		<>
			<DashboardNavbar />
			<div className="dashboard-interface-container">
				<UserGreeting />
			</div>
		</>
	);
}

export default Dashboard;
