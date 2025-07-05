import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AccountLinks() {
	const [accountLinksExpanded, setAccountLinksExpanded] =
		useState<boolean>(false);
	const navigate = useNavigate();

	function expandAccountLinks() {
		setAccountLinksExpanded(true);
	}

	function collapseAccountLinks() {
		setAccountLinksExpanded(false);
	}

	function handleLogout() {
		navigate("/logout");
	}

	return (
		<div
			onMouseEnter={expandAccountLinks}
			onMouseLeave={collapseAccountLinks}
			className="dashboard-navbar-account-links-container"
		>
			<div className="dashboard-navbar-account-link">
				<img
					className="dashboard-navbar-account-icon"
					src="/icons/dashboard/navbar/accountLinks/account-icon.svg"
					alt="Account menu"
					role="button"
					tabIndex={0}
				/>

				{accountLinksExpanded && (
					<div className="dashboard-navbar-account-options">
						<div
							onClick={handleLogout}
							className="logout-option-container"
						>
							<img
								className="logout-icon"
								src="/icons/dashboard/navbar/accountLinks/logout-icon.svg"
							/>
							<p className="logout-text">Logout</p>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

export default AccountLinks;
