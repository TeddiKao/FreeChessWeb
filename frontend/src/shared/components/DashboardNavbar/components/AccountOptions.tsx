import FlyoutMenu from "../../layout/FlyoutMenu";

function AccountOptions() {
	return (
		<FlyoutMenu>
			<div className="account-options-container">
				<div className="logout-container">
					<img className="logout-icon" alt="Logout icon" />
					<p className="logout-text">Logout</p>
				</div>
			</div>
		</FlyoutMenu>
	);
}

export default AccountOptions;
