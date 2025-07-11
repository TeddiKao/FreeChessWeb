import { useState } from "react";
import useEmail from "../../../hooks/useEmail";
import useUsername from "../../../hooks/useUsername";
import "@sharedStyles/DashboardNavbar/account-info.scss";
import AccountOptions from "@sharedComponents/DashboardNavbar/components/AccountOptions";

interface AccountInfoProps {
	dashboardNavbarExpanded: boolean;
}

function AccountInfo({ dashboardNavbarExpanded }: AccountInfoProps) {
	const username = useUsername();
	const email = useEmail();

	const [shouldDisplayAccountOptions, setShouldDisplayAccountOptions] =
		useState(false);

	function toggleAccountOptions() {
		setShouldDisplayAccountOptions(
			(prevShouldDisplay) => !prevShouldDisplay
		);
	}

	return (
		<div onClick={toggleAccountOptions} className="account-info-container">
			<div className="main-account-content">
				<img
					className="profile-picture"
					alt="profile picture"
					src="/icons/dashboard/navbar/accountLinks/user.svg"
				/>

				{dashboardNavbarExpanded && (
					<div className="account-info">
						<p className="account-info-name">{username}</p>
						<p className="account-info-email">{email}</p>
					</div>
				)}
			</div>

			{shouldDisplayAccountOptions && <AccountOptions />}
		</div>
	);
}

export default AccountInfo;
