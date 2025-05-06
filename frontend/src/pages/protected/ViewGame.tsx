import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchGameWinner, fetchMoveList, fetchPositionList } from "../../utils/apiUtils";
import { ParsedFENString } from "../../types/gameLogic";
import GameReplayChessboard from "../../components/global/chessboards/GameReplayChessboard";

import "../../styles/pages/view-game.scss";
import DashboardNavbar from "../../components/page/dashboard/DashboardNavbar";
import MoveListPanel from "../../components/global/gameplaySidePanel/MoveListPanel";
import MoveNavigationButtons from "../../components/global/gameplaySidePanel/MoveNavigationButtons";
import { playAudio } from "../../utils/audioUtils";
import { isNullOrUndefined } from "../../utils/generalUtils";

function ViewGame() {
	const { gameId } = useParams();

	const [boardOrientation, setBoardOrientation] = useState("White");

	const [positionList, setPositionList] = useState([]);
	const [positionIndex, setPositionIndex] = useState(0);
	const [moveList, setMoveList] = useState([]);

	const [gameWinner, setGameWinner] = useState("");

	const parsedFEN: ParsedFENString =
		positionList[positionIndex]?.["position"];
	const lastDraggedSquare =
		positionList[positionIndex]?.["last_dragged_square"];
	const lastDroppedSquare =
		positionList[positionIndex]?.["last_dropped_square"];
	const moveType = positionList[positionIndex]?.["move_type"];

	useEffect(() => {
		updatePositionList();
		updateMoveList();
		updateGameWinner();
	}, []);

	useEffect(() => {
		if (!isNullOrUndefined(moveType)) {
			playAudio(moveType);
		}
	}, [positionIndex]);

	async function updatePositionList() {
		const fetchedPositionList = await fetchPositionList(Number(gameId));
		setPositionList(fetchedPositionList);
	}

	async function updateMoveList() {
		const fetchedMoveList = await fetchMoveList(Number(gameId));
		setMoveList(fetchedMoveList);
	}

	async function updateGameWinner() {
		const fetchedGameWinner = await fetchGameWinner(Number(gameId));
		setGameWinner(fetchedGameWinner);
	}

	function toggleBoardOrientation() {
		const isWhite = boardOrientation.toLowerCase() === "white";
		const newOrientation = isWhite ? "Black" : "White";

		setBoardOrientation(newOrientation);
	}

	return (
		<>
			<DashboardNavbar />
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

				<div className="gameplay-side-panel">
					<MoveListPanel
						gameEnded={true}
						gameWinner={gameWinner}
						setPositionIndex={setPositionIndex}
						moveList={moveList}
					/>

					<MoveNavigationButtons
						setPositionIndex={setPositionIndex}
						positionListLength={positionList.length}
					/>
				</div>
			</div>
		</>
	);
}

export default ViewGame;
