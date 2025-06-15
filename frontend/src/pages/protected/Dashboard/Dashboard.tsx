import DashboardNavbar from "../../../components/common/DashboardNavbar/DashboardNavbar.tsx";
import DashboardSuggestions from "./components/DashboardSuggestions.tsx";
import UserGreeting from "./components/UserGreeting.tsx";

import "../../../styles/pages/dashboard.scss";

function Dashboard() {
	return (
		<>
			<DashboardNavbar />
			<div className="dashboard-interface-container">
				<UserGreeting />
				<p className="dashboard-suggestion-text">
					Here are some suggestions for you
				</p>

				<DashboardSuggestions />
			</div>
		</>
	);
}

export default Dashboard;
