function AccountLinks() {
	return (
		<div className="dashboard-navbar-account-links-container">
			<div className="dashboard-navbar-account-link">
				<img
					className="dashboard-navbar-account-icon"
					src="/account-icon.svg"
				/>

				<div className="dashboard-navbar-account-options">
					<div className="logout-option-container">
						{/* <p className="logout-text">Logout</p> */}
					</div>
				</div>
			</div>
		</div>
	);
}

export default AccountLinks;
