import { useEffect, useState } from "react";
import BotChessboard from "../../globalComponents/chessboards/BotChessboard";
import DashboardNavbar from "../../pageComponents/dashboard/DashboardNavbar";
import { fetchFen } from "../../utils/apiUtils";
import { ParsedFENString } from "../../types/gameLogic";

import "../../styles/pages/play-bot.scss";

function PlayBot() {
    const startingFEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
    const [parsedFEN, setParsedFEN] = useState<ParsedFENString | null>(null);

    useEffect(() => {
        updateParsedFEN();
    }, []);

    async function updateParsedFEN() {
        const parsedFEN = await fetchFen(startingFEN);
        setParsedFEN(parsedFEN)
    }

    if (!parsedFEN) {
        return null;
    }

	return (
		<>
            <DashboardNavbar />
			<div className="play-bot-interface-container">
                <div className="bot-chessboard-wrapper">
                    <BotChessboard squareSize={58} parsed_fen_string={parsedFEN} orientation="White" />
                </div>
            </div>
		</>
	);
}

export default PlayBot;