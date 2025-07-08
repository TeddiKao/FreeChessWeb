import useUsername from "../../../hooks/useUsername";
import "../../../styles/DashboardNavbar/account-info.scss";

interface AccountInfoProps {
	dashboardNavbarExpanded: boolean;
}

function AccountInfo({ dashboardNavbarExpanded }: AccountInfoProps) {
	const username = useUsername();

	return (
		<div className="account-info-container">
			<img
				className="profile-picture"
				alt="profile picture"
				src="/icons/dashboard/navbar/accountLinks/user.svg"
			/>

			{dashboardNavbarExpanded && (
				<div className="account-info">
					<p className="account-info-name">{username}</p>
					<p className="account-info-email">Email</p>
				</div>
			)}
		</div>
	);
}

export default AccountInfo;
