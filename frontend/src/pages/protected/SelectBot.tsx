import { bots as botsTable } from "../../constants/botsConfig";
import BotCategory from "../../pageComponents/playBot/BotCategory";

function SelectBot() {
	return (
		<div className="select-bot-interface-container">
			{botsTable.map((categoryInfo, _) => (
				<BotCategory categoryInfo={categoryInfo} />
			))}
		</div>
	);
}

export default SelectBot;
