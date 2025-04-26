import { bots as botsTable } from "../../constants/botsConfig";
import DashboardNavbar from "../../pageComponents/dashboard/DashboardNavbar";
import BotCategory from "../../pageComponents/playBot/BotCategory";

import "../../styles/pages/select-bot.scss";

function SelectBot() {
	return (
		<div className="select-bot-interface-container">
            <DashboardNavbar />
            <h2 className="select-bot-page-heading">Play vs bot</h2>
			<div className="bots-container">
				{botsTable.map((categoryInfo, _) => (
					<BotCategory categoryInfo={categoryInfo} />
				))}
			</div>
		</div>
	);
}

export default SelectBot;
