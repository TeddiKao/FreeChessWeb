import { BotCategoryInfo } from "../../constants/botsConfig";
import BotCard from "./BotCard";

type BotCategoryProps = {
	categoryInfo: BotCategoryInfo;
};

function BotCategory({ categoryInfo }: BotCategoryProps) {
	const categoryName = categoryInfo["categoryName"];
	const bots = categoryInfo["bots"];

	return (
		<div className="bot-category-container">
			<h3 className="bot-category-name">{categoryName}</h3>
			{bots.map((botInfo, _) => (
				<BotCard botInfo={botInfo} />
			))}
		</div>
	);
}

export default BotCategory;
