import { useNavigate } from "react-router-dom";
import { BotInfo } from "../../constants/botsConfig";

import "../../styles/features/playBot/bot-card.scss";
import { createBotGame } from "../../utils/apiUtils";

type BotCardProps = {
	botInfo: BotInfo;
};

function BotCard({ botInfo }: BotCardProps) {
	const navigate = useNavigate();

	async function handleBotCardClick() {
		const botGameId = await createBotGame(botInfo.botId);

		navigate("/play-bot", {
			state: {
				gameId: botGameId,
				bot: botInfo.botId
			}
		})
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
