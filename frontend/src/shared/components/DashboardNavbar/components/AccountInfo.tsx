import "../../../styles/DashboardNavbar/account-info.scss";

interface AccountInfoProps {
	dashboardNavbarExpanded: boolean;
}

function AccountInfo({ dashboardNavbarExpanded }: AccountInfoProps) {
	return (
		<div className="account-info-container">
			<img
				className="profile-picture"
				alt="profile picture"
				src="/icons/dashboard/navbar/accountLinks/user.svg"
			/>
		</div>
	);
}

export default AccountInfo;
