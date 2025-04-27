import { BotInfo } from "../../constants/botsConfig";

import "../../styles/features/playBot/bot-card.scss";

type BotCardProps = {
	botInfo: BotInfo;
};

function BotCard({ botInfo }: BotCardProps) {
	function getBotImage() {
		if (botInfo?.botImage) {
			return <img className="bot-image" src={botInfo.botImage} />;
		} else {
			// TODO: Add default placeholder image
			return null;
		}
	}

	return (
		<div className="bot-card-container">
			<div className="bot-image-container">{getBotImage()}</div>
			<p className="bot-name">{botInfo.botDisplayName}</p>
		</div>
	);
}

export default BotCard;
