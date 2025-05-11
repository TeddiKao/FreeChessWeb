import "../../../styles/components/dashboard/dashboard-suggestions.scss";

function DashboardSuggestions() {
	return (
		<div className="dashboard-suggestions-container">
			<div className="dashboard-suggestion-container">
				<img
					src="/pass-and-play-dashboard-suggestion.svg"
					className="dashboard-suggestion-icon"
				/>

                <h4 className="dashboard-suggestion-name">Pass and Play</h4>
                <p className="dashboard-suggestion-description">Play a game of chess on a single device</p>
			</div>
		</div>
	);
}

export default DashboardSuggestions;
