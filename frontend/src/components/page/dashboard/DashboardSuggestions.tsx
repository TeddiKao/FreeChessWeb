import { useNavigate } from "react-router-dom";
import "../../../styles/components/dashboard/dashboard-suggestions.scss";

type DashboardSuggestionProps = {
	suggestionName: string;
	suggestionDescription: string;
	suggestionIcon: string;
	suggestionURL: string;
};

function DashboardSuggestion({
	suggestionName,
	suggestionDescription,
	suggestionIcon,
	suggestionURL,
}: DashboardSuggestionProps) {
	const navigate = useNavigate();

	function handleSuggestionRedirect() {
		navigate(suggestionURL);
	}

	return (
		<div
			onClick={handleSuggestionRedirect}
			className="dashboard-suggestion-container"
		>
			<div className="dashboard-suggestion-icon-container">
				<img
					src={suggestionIcon}
					alt={`${suggestionName} suggestion icon`}
					className="dashboard-suggestion-icon"
				/>
			</div>

			<h3 className="dashboard-suggestion-name">{suggestionName}</h3>
			<p className="dashboard-suggestion-description">
				{suggestionDescription}
			</p>
		</div>
	);
}

function DashboardSuggestions() {
	return (
		<div className="dashboard-suggestions-container">
            <DashboardSuggestion
				suggestionName="Play vs Human"
				suggestionDescription="Play against another player"
				suggestionIcon="/icons/dashboard/suggestions/play-human-dashboard-suggestion.svg"
				suggestionURL="/game-setup"
			/>

			<DashboardSuggestion
				suggestionName="Pass and Play"
				suggestionDescription="Play a game of chess on a single device"
				suggestionIcon="/icons/dashboard/suggestions/pass-and-play-dashboard-suggestion.svg"
				suggestionURL="/pass-and-play"
			/>

			<DashboardSuggestion
				suggestionName="Play vs Bot"
				suggestionDescription="Play against a bot of your choice"
				suggestionIcon="/icons/dashboard/suggestions/play-bot-dashboard-suggestion.svg"
				suggestionURL="/select-bot"
			/>

			<DashboardSuggestion
				suggestionName="View Game History"
				suggestionDescription="View and replay your past games"
				suggestionIcon="/icons/dashboard/suggestions/game-history-dashboard-suggestion.svg"
				suggestionURL="/game-history"
			/>
		</div>
	);
}

export default DashboardSuggestions;
