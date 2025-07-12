import DashboardNavbar from "@sharedComponents/DashboardNavbar/DashboardNavbar";
import DashboardSuggestions from "./components/DashboardSuggestions";
import UserGreeting from "./components/UserGreeting";

import "./styles/dashboard.scss";

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
