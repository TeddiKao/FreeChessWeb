import AccountInfo from "./components/AccountInfo";
import "../../styles/DashboardNavbar/dashboard-navbar.scss";

function DashboardNavbar() {
	return (
		<nav className="dashboard-navbar-container">
			<AccountInfo />
		</nav>
	)
}

export default DashboardNavbar;
