import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchMoveList, fetchPositionList } from "../../utils/apiUtils";
import { ParsedFENString } from "../../types/gameLogic";
import GameReplayChessboard from "../../components/global/chessboards/GameReplayChessboard";

import "../../styles/pages/view-game.scss";

function ViewGame() {
	const { gameId } = useParams();

	const [boardOrientation, setBoardOrientation] = useState("White");

	const [positionList, setPositionList] = useState([]);
	const [positionIndex, setPositionIndex] = useState(0);
	const [moveList, setMoveList] = useState([]);

	const parsedFEN: ParsedFENString =
		positionList[positionIndex]?.["position"];
	const lastDraggedSquare =
		positionList[positionIndex]?.["last_dragged_square"];
	const lastDroppedSquare =
		positionList[positionIndex]?.["last_dropped_square"];

	useEffect(() => {
		updatePositionList();
		updateMoveList();
	}, []);

	async function updatePositionList() {
		const fetchedPositionList = await fetchPositionList(Number(gameId));
        setPositionList(fetchedPositionList);
	}

	async function updateMoveList() {
		const fetchedMoveList = await fetchMoveList(Number(gameId));
		setMoveList(fetchedMoveList);
	}

	function toggleBoardOrientation() {
		const isWhite = boardOrientation.toLowerCase() === "white";
		const newOrientation = isWhite ? "Black" : "White";

		setBoardOrientation(newOrientation);
	}

	return (
		<div className="view-game-interface-container">
			<div className="view-game-chessboard-wrapper">
				<GameReplayChessboard
					orientation={boardOrientation}
					parsed_fen_string={parsedFEN}
					lastDraggedSquare={lastDraggedSquare}
					lastDroppedSquare={lastDroppedSquare}
				/>
			</div>

			<div className="board-actions">
				<img
					onClick={toggleBoardOrientation}
					className="flip-board-icon"
					src="/flip-board-icon.png"
				/>
			</div>
		</div>
	);
}

export default ViewGame;
