import FlyoutMenu from "../../layout/FlyoutMenu";
import "../../../styles/DashboardNavbar/account-options.scss";
import { useNavigate } from "react-router-dom";

function AccountOptions() {
	const navigate = useNavigate();

	function handleLogoutButtonClick() {
		navigate("/logout");
	}

	return (
		<FlyoutMenu gap={8}>
			<div className="account-options-container">
				<div onClick={handleLogoutButtonClick} className="logout-container">
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
