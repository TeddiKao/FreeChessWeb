import { BotCategoryInfo } from "../botsConfig";
import BotCard from "./BotCard";

import "@gameplay/bot/styles/bot-category.scss";

type BotCategoryProps = {
	categoryInfo: BotCategoryInfo;
};

function BotCategory({ categoryInfo }: BotCategoryProps) {
	const categoryName = categoryInfo["categoryName"];
	const bots = categoryInfo["bots"];

	return (
		<div className="bot-category-container">
			<h3 className="bot-category-name">{categoryName}</h3>
			<div className="bot-cards-container">
				{bots.map((botInfo, _) => (
					<BotCard key={botInfo.botId} botInfo={botInfo} />
				))}
			</div>
		</div>
	);
}

export default BotCategory;
