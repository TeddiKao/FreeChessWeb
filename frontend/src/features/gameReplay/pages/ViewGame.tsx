import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import DashboardNavbar from "../../../shared/components/DashboardNavbar/DashboardNavbar";

import "../styles/view-game.scss";
import { playAudio } from "../../../utils/audioUtils";
import { isNullOrUndefined } from "../../../utils/generalUtils";
import { OptionalValue } from "../../../types/general";
import { convertToMilliseconds } from "../../../utils/timeUtils";
import { pieceAnimationTime } from "../../../constants/pieceAnimation";
import usePieceAnimation from "../../../shared/hooks/usePieceAnimation";
import GameReplayChessboard from "../components/GameReplayChessboard";
import MoveListPanel from "../../gameplay/common/components/gameplaySidePanel/MoveListPanel";
import MoveNavigationButtons from "../../gameplay/common/components/gameplaySidePanel/MoveNavigationButtons";
import { ParsedFEN } from "../../gameplay/common/types/gameState.types";
import {
	fetchPositionList,
	fetchMoveList,
} from "../../gameplay/common/utils/gameStateFetchApi";
import { fetchGameWinner } from "../../gameplay/common/utils/gameResultFetchApi";

function ViewGame() {
	const { gameId } = useParams();

	const [boardOrientation, setBoardOrientation] = useState("White");

	const [positionList, setPositionList] = useState([]);

	const previousPositionIndexRef = useRef<OptionalValue<number>>(null);
	const [positionIndex, setPositionIndex] = useState(0);

	const [moveList, setMoveList] = useState([]);

	const [gameWinner, setGameWinner] = useState("");

	const [parsedFEN, setParsedFEN] = useState<ParsedFEN>(
		positionList[positionIndex]?.["position"]
	);

	const [lastDraggedSquare, setLastDraggedSquare] = useState(
		positionList[positionIndex]?.["last_dragged_square"]
	);
	const [lastDroppedSquare, setLastDroppedSquare] = useState(
		positionList[positionIndex]?.["last_dropped_square"]
	);
	const moveType = positionList[positionIndex]?.["move_type"];

	const [
		pieceAnimationSquare,
		pieceAnimationStyles,
		animatePiece,
		animateMoveReplay,
	] = usePieceAnimation();

	useEffect(() => {
		updatePositionList();
		updateMoveList();
		updateGameWinner();
	}, []);

	useEffect(() => {
		if (previousPositionIndexRef.current) {
			if (previousPositionIndexRef.current + 1 === positionIndex) {
				handleFastForwardMoveAnimation();
			} else if (previousPositionIndexRef.current - 1 === positionIndex) {
				handleReplayMoveAnimation();
			} else {
				setParsedFEN(positionList[positionIndex]?.["position"]);
				setLastDraggedSquare(
					positionList[positionIndex]?.["last_dragged_square"]
				);
				setLastDroppedSquare(
					positionList[positionIndex]?.["last_dropped_square"]
				);
			}
		} else {
			setParsedFEN(positionList[positionIndex]?.["position"]);
			setLastDraggedSquare(
				positionList[positionIndex]?.["last_dragged_square"]
			);
			setLastDroppedSquare(
				positionList[positionIndex]?.["last_dropped_square"]
			);
		}

		if (!isNullOrUndefined(moveType)) {
			playAudio(moveType);
		}
	}, [positionIndex]);

	useEffect(() => {
		setParsedFEN(positionList[positionIndex]?.["position"]);
		setLastDraggedSquare(
			positionList[positionIndex]?.["last_dragged_square"]
		);
		setLastDroppedSquare(
			positionList[positionIndex]?.["last_dropped_square"]
		);
	}, [positionList]);

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

	function handleFastForwardMoveAnimation() {
		const moveInfo = positionList[positionIndex]["move_info"];

		const startingSquare = moveInfo["starting_square"];
		const destinationSquare = moveInfo["destination_square"];

		// @ts-ignore
		animatePiece(
			startingSquare,
			destinationSquare,
			boardOrientation.toLowerCase()
		);

		setTimeout(() => {
			setParsedFEN(positionList[positionIndex]?.["position"]);
			setLastDraggedSquare(
				positionList[positionIndex]?.["last_dragged_square"]
			);
			setLastDroppedSquare(
				positionList[positionIndex]?.["last_dropped_square"]
			);
		}, convertToMilliseconds(pieceAnimationTime));
	}

	function handleReplayMoveAnimation() {
		const moveInfo = positionList[positionIndex + 1]["move_info"];

		const startingSquare = moveInfo["starting_square"];
		const destinationSquare = moveInfo["destination_square"];

		// @ts-ignore
		animateMoveReplay(
			startingSquare,
			destinationSquare,
			boardOrientation.toLowerCase()
		);

		setTimeout(() => {
			setParsedFEN(positionList[positionIndex]?.["position"]);
			setLastDraggedSquare(
				positionList[positionIndex]?.["last_dragged_square"]
			);
			setLastDroppedSquare(
				positionList[positionIndex]?.["last_dropped_square"]
			);
		}, convertToMilliseconds(pieceAnimationTime));
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
						// @ts-ignore
						animationSquare={pieceAnimationSquare}
						// @ts-ignore
						animationStyles={pieceAnimationStyles}
					/>
				</div>

				<div className="board-actions">
					<img
						onClick={toggleBoardOrientation}
						className="flip-board-icon"
						src="/icons/gameplay/boardActions/flip-board-icon.png"
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
						previousPositionIndexRef={previousPositionIndexRef}
						positionListLength={positionList.length}
					/>
				</div>
			</div>
		</>
	);
}

export default ViewGame;
