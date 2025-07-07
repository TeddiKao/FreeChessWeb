import AccountInfo from "./components/AccountInfo";
import "../../styles/DashboardNavbar/dashboard-navbar.scss";
import SiteLinks from "./components/SiteLinks/SiteLinks";

function DashboardNavbar() {
	return (
		<nav className="dashboard-navbar-container">
			<AccountInfo />
			<SiteLinks />
		</nav>
	)
}

export default DashboardNavbar;
