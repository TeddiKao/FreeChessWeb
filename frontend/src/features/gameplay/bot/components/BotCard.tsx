import { useNavigate } from "react-router-dom";
import { BotInfo } from "../botsConfig";

import "../styles/bot-card.scss";
import { createBotGame } from "../botGameApiService";

type BotCardProps = {
	botInfo: BotInfo;
};

function BotCard({ botInfo }: BotCardProps) {
	const navigate = useNavigate();

	async function handleBotCardClick() {
		const [botGameId, assignedColor] = await createBotGame(botInfo.botId);

		navigate("/play-bot", {
			state: {
				gameId: botGameId,
				bot: botInfo.botId,
				assignedColor: assignedColor,
			},
		});
	}

	function getBotImage() {
		if (botInfo?.botImage) {
			return <img className="bot-image" src={botInfo.botImage} />;
		} else {
			// TODO: Add default placeholder image
			return null;
		}
	}

	return (
		<div onClick={handleBotCardClick} className="bot-card-container">
			<div className="bot-image-container">{getBotImage()}</div>
			<p className="bot-name">{botInfo.botDisplayName}</p>
		</div>
	);
}

export default BotCard;
