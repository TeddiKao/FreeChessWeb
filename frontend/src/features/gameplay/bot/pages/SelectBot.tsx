import { bots as botsTable } from "../botsConfig";
import BotCategory from "../components/BotCategory";

import "@gameplay/bot/styles/select-bot.scss";
import DashboardNavbar from "@sharedComponents/DashboardNavbar/DashboardNavbar";

function SelectBot() {
	return (
		<div className="select-bot-interface-container">
			<DashboardNavbar />
			<div className="main-page-content">
				<h1 className="select-bot-page-heading">Play vs bot</h1>
				<p className="select-bot-page-description">
					Play against a bot of your choice
				</p>
				<div className="bots-container">
					{botsTable.map((categoryInfo, _) => (
						<BotCategory
							key={categoryInfo.categoryId}
							categoryInfo={categoryInfo}
						/>
					))}
				</div>
			</div>
		</div>
	);
}

export default SelectBot;
