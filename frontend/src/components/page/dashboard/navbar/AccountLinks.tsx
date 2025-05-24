import { useState } from "react";

function AccountLinks() {
	const [accountLinksExpanded, setAccountLinksExpanded] =
		useState<boolean>(false);

	function expandAccountLinks() {
		setAccountLinksExpanded(true);
	}

	function collapseAccountLinks() {
		setAccountLinksExpanded(false);
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
					src="/account-icon.svg"
				/>

				{accountLinksExpanded && (
					<div className="dashboard-navbar-account-options">
						<div className="logout-option-container">
							<img
								className="logout-icon"
								src="/logout-icon.svg"
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
