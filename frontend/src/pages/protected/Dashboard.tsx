import DashboardNavbar from "../../components/page/dashboard/DashboardNavbar.tsx";
import UserGreeting from "../../components/page/dashboard/UserGreeting.tsx";

import "../../styles/pages/dashboard.scss";

function Dashboard() {
	return (
		<>
			<DashboardNavbar />
			<div className="dashboard-interface-container">
				<UserGreeting />
				<p className="dashboard-suggestion-text">Here are some suggestions for you</p>
			</div>
		</>
	);
}

export default Dashboard;
