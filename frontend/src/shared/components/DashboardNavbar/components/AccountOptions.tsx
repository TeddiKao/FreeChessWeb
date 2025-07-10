import FlyoutMenu from "../../layout/FlyoutMenu";
import "../../../styles/DashboardNavbar/account-options.scss";

function AccountOptions() {
	return (
		<FlyoutMenu>
			<div className="account-options-container">
				<div className="logout-container">
					<img
						className="logout-icon"
						alt="Logout icon"
						src="/icons/dashboard/navbar/accountLinks/logout.svg"
					/>
					<p className="logout-text">Logout</p>
				</div>
			</div>
		</FlyoutMenu>
	);
}

export default AccountOptions;
