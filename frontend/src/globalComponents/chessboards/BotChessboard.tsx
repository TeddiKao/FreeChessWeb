import { useState, useEffect, useRef } from "react";

import "../../styles/components/chessboard/chessboard.scss";
import Square from "../Square.js";

import {
	clearSquaresStyling,
	getRank,
	getBoardStartingIndex,
	getBoardEndingIndex,
	isSquareLight,
	getSquareExists,
} from "../../utils/boardUtils";

import { playAudio } from "../../utils/audioUtils";

import { fetchLegalMoves, makeMoveInBotGame } from "../../utils/apiUtils";

import {
	cancelPromotion,
	handlePromotionCaptureStorage,
	preparePawnPromotion,
} from "../../utils/gameLogic/promotion";

import {
	BotGameWebSocketEventTypes,
	MoveMethods,
} from "../../enums/gameLogic.ts";
import { BotChessboardProps } from "../../interfaces/chessboard.js";
import { ChessboardSquareIndex, OptionalValue } from "../../types/general.js";
import {
	BoardPlacement,
	MoveInfo,
	ParsedFENString,
	PieceColor,
	PieceInfo,
	PieceType,
} from "../../types/gameLogic.js";
import { isPawnPromotion } from "../../utils/moveUtils.ts";
import useWebSocket from "../../hooks/useWebsocket.ts";
import { parseWebsocketUrl } from "../../utils/generalUtils.ts";
import useReactiveRef from "../../hooks/useReactiveRef.ts";

function BotChessboard({
	parsed_fen_string,
	orientation,
	gameplaySettings,
	squareSize,
	botId,
	gameId,
	setMoveList,
	setPositionList,
	lastDraggedSquare,
	lastDroppedSquare,
	setGameEnded,
	setGameEndedCause,
	setGameWinner,
}: BotChessboardProps) {
	const [previousClickedSquare, setPreviousClickedSquare] =
		useState<OptionalValue<ChessboardSquareIndex>>(null);
	const [clickedSquare, setClickedSquare] =
		useState<OptionalValue<ChessboardSquareIndex>>(null);
	const [parsedFENString, setParsedFENString] =
		useState<OptionalValue<ParsedFENString>>(parsed_fen_string);

	const [draggedSquare, setDraggedSquare] =
		useState<OptionalValue<ChessboardSquareIndex>>(null);
	const [droppedSquare, setDroppedSquare] =
		useState<OptionalValue<ChessboardSquareIndex>>(null);

	const [previousDraggedSquare, setPreviousDraggedSquare] =
		useState<OptionalValue<ChessboardSquareIndex>>(lastDraggedSquare);
	const [previousDroppedSquare, setPreviousDroppedSquare] =
		useState<OptionalValue<ChessboardSquareIndex>>(lastDroppedSquare);
	const [promotionCapturedPiece, setPromotionCapturedPiece] =
		useState<OptionalValue<PieceInfo>>(null);

	const [lastUsedMoveMethod, setLastUsedMoveMethod] =
		useState<OptionalValue<string>>(null);

	const [sideToMove, setSideToMove] = useState<string>("white");

	const selectingPromotionRef = useRef<boolean>(false);
	const unpromotedBoardPlacementRef =
		useRef<OptionalValue<ParsedFENString>>(null);

	const chessboardStyles = {
		gridTemplateColumns: `repeat(8, ${squareSize}px)`,
	};

	const [botGameWebsocketEnabled, setBotGameWebsocketEnabled] =
		useState(false);
	const botGameWebsocketExists = useRef(false);
	const botGameWebsocketRef = useRef<WebSocket | null>(null);

	const websocketURL = parseWebsocketUrl("bot-game-server", {
		gameId: gameId,
	});
	const socket = useWebSocket(
		websocketURL,
		handleOnMessage,
		undefined,
		botGameWebsocketEnabled
	);

	useEffect(() => {
		setParsedFENString(parsed_fen_string);
	}, [parsed_fen_string]);

	useEffect(() => {
		handleClickToMove();
	}, [previousClickedSquare, clickedSquare]);

	useEffect(() => {
		handleOnDrop();
	}, [draggedSquare, droppedSquare]);

	useEffect(() => {
		setPreviousDraggedSquare(lastDraggedSquare);
		setPreviousDroppedSquare(lastDroppedSquare);
	}, [lastDraggedSquare, lastDroppedSquare]);

	useEffect(() => {
		if (botGameWebsocketExists.current === false) {
			window.addEventListener("beforeunload", handleWindowUnload);

			botGameWebsocketExists.current = true;

			setBotGameWebsocketEnabled(true);
		}

		return () => {
			window.removeEventListener("beforeunload", handleWindowUnload);

			if (botGameWebsocketRef.current?.readyState === WebSocket.OPEN) {
				botGameWebsocketRef.current?.close();
				botGameWebsocketExists.current = false;
			}
		};
	}, []);

	useEffect(() => {
		console.log(socket);
		botGameWebsocketRef.current = socket;
	}, [socket]);

	function handleWindowUnload() {
		if (botGameWebsocketRef.current?.readyState === WebSocket.OPEN) {
			botGameWebsocketRef.current?.close();
			botGameWebsocketExists.current = false;
		}
	}

	async function handleOnDrop() {
		clearSquaresStyling();

		if (!parsedFENString) {
			return null;
		}

		if (!(draggedSquare && droppedSquare)) {
			if (!draggedSquare) {
				return;
			}

			handleLegalMoveDisplay("drag");

			return;
		}

		if (draggedSquare === droppedSquare) {
			setDraggedSquare(null);
			setDroppedSquare(null);

			return;
		}

		const boardPlacement = parsedFENString["board_placement"];
		const squareInfo = boardPlacement[`${draggedSquare}`];

		const pieceColor = squareInfo["piece_color"];
		const pieceType = squareInfo["piece_type"];
		const initialSquare = squareInfo["starting_square"];

		handleMoveMade(pieceColor, pieceType, initialSquare);

		setPreviousDraggedSquare(draggedSquare);
		setPreviousDroppedSquare(droppedSquare);
		setDraggedSquare(null);
		setDroppedSquare(null);
		setLastUsedMoveMethod("drag");
	}

	async function handleMoveMade(
		pieceColor: PieceColor,
		pieceType: PieceType,
		initialSquare?: ChessboardSquareIndex
	) {
		const startingSquare = `${draggedSquare || previousClickedSquare}`;
		const destinationSquare = `${droppedSquare || clickedSquare}`;

		if (pieceType.toLowerCase() === "pawn") {
			handlePromotionCaptureStorage(
				parsedFENString!,
				pieceColor,
				startingSquare,
				destinationSquare,
				setPromotionCapturedPiece,
				selectingPromotionRef,
				unpromotedBoardPlacementRef,
				handlePawnPromotion,
				gameplaySettings,
				droppedSquare ? "drag" : "click"
			);

			if (isPawnPromotion(pieceColor, getRank(destinationSquare))) {
				setParsedFENString((prevFENString) => {
					const moveInfo = {
						starting_square: startingSquare,
						destination_square: destinationSquare,
						piece_color: pieceColor,
						piece_type: pieceType,
						initial_square: initialSquare,
					};

					unpromotedBoardPlacementRef.current = preparePawnPromotion(
						prevFENString!,
						moveInfo
					);

					return preparePawnPromotion(prevFENString!, moveInfo);
				});

				selectingPromotionRef.current = true;
			}
		}

		if (!selectingPromotionRef.current) {
			botGameWebsocketRef.current?.send(
				JSON.stringify({
					type: "move_made",
					move_info: {
						starting_square: `${
							draggedSquare || previousClickedSquare
						}`,
						destination_square: `${droppedSquare || clickedSquare}`,
						piece_color: pieceColor,
						piece_type: pieceType,
						initial_square: initialSquare,

						additional_info: {},
					},
				})
			);
		}
	}

	async function handleClickToMove() {
		if (!parsedFENString) {
			return;
		}

		if (!previousClickedSquare) {
			return;
		}

		const boardPlacement: BoardPlacement =
			parsedFENString["board_placement"];

		clearSquaresStyling();

		if (!getSquareExists(previousClickedSquare, boardPlacement)) {
			return;
		}

		const shouldMove = previousClickedSquare && clickedSquare;
		if (!shouldMove) {
			handleLegalMoveDisplay("click");

			return;
		}

		if (previousClickedSquare === clickedSquare) {
			setPreviousClickedSquare(null);
			setClickedSquare(null);

			return;
		}

		const initialSquare =
			boardPlacement[`${previousClickedSquare}`]["starting_square"];
		const pieceTypeToValidate =
			boardPlacement[`${previousClickedSquare}`]["piece_type"];
		const pieceColorToValidate: PieceColor =
			boardPlacement[`${previousClickedSquare}`]["piece_color"];

		handleMoveMade(
			pieceColorToValidate,
			pieceTypeToValidate,
			initialSquare
		);

		setPreviousDraggedSquare(previousClickedSquare);
		setPreviousDroppedSquare(clickedSquare);
		setPreviousClickedSquare(null);
		setClickedSquare(null);
		setLastUsedMoveMethod("click");
	}

	async function displayLegalMoves(
		pieceType: string,
		pieceColor: string,
		startingSquare: ChessboardSquareIndex
	) {
		if (!parsedFENString) {
			return;
		}

		const legalMoves = await fetchLegalMoves(
			parsedFENString,
			pieceType,
			pieceColor,
			startingSquare
		);

		if (!legalMoves) {
			return;
		}

		for (const legalMove of legalMoves) {
			const square = document.getElementById(legalMove);
			if (square) {
				square.classList.add("legal-square");
			}
		}
	}

	if (!parsedFENString) {
		return null;
	}

	if (!gameplaySettings) {
		return null;
	}

	const autoQueen = gameplaySettings["auto_queen"];
	const showLegalMoves = gameplaySettings["show_legal_moves"];

	const piecePlacements = parsedFENString["board_placement"];

	function handleSquareClick(event: React.MouseEvent<HTMLElement>) {
		if (!previousClickedSquare && !clickedSquare) {
			setPreviousClickedSquare(event.currentTarget.id);
		} else {
			setClickedSquare(event.currentTarget.id);
		}
	}

	function handleLegalMoveDisplay(moveMethod: string) {
		if (!parsedFENString) {
			return;
		}

		moveMethod = moveMethod.toLowerCase();

		const usingDrag = moveMethod === MoveMethods.DRAG;
		const startingSquare = usingDrag
			? draggedSquare
			: previousClickedSquare;

		if (!startingSquare) {
			return;
		}

		const boardPlacement = parsedFENString["board_placement"];
		const squareInfo = boardPlacement[`${startingSquare}`];
		const pieceType = squareInfo["piece_type"];
		const pieceColor = squareInfo["piece_color"];

		if (!showLegalMoves) {
			return;
		}

		displayLegalMoves(pieceType, pieceColor, startingSquare);
	}

	function handlePromotionCancel(color: PieceColor) {
		if (!previousDraggedSquare || !previousDroppedSquare) {
			return;
		}

		setParsedFENString((prevFENString: OptionalValue<ParsedFENString>) => {
			if (!prevFENString) {
				return parsedFENString;
			}

			const updatedBoardPlacement = cancelPromotion(
				prevFENString,
				color,
				previousDraggedSquare,
				previousDroppedSquare,
				promotionCapturedPiece || undefined
			);

			return updatedBoardPlacement;
		});

		setPromotionCapturedPiece(null);
		selectingPromotionRef.current = false;
	}

	function getPromotionStartingSquare(
		autoQueen: boolean,
		moveMethod: string
	) {
		moveMethod = moveMethod.toLowerCase();

		if (moveMethod === MoveMethods.CLICK) {
			return autoQueen ? previousClickedSquare : previousDraggedSquare;
		} else if (moveMethod === MoveMethods.DRAG) {
			return autoQueen ? draggedSquare : previousDraggedSquare;
		}
	}

	function getPromotionEndingSquare(autoQueen: boolean, moveMethod: string) {
		moveMethod = moveMethod.toLowerCase();

		if (moveMethod === MoveMethods.CLICK) {
			return autoQueen ? clickedSquare : previousDroppedSquare;
		} else if (moveMethod === MoveMethods.DRAG) {
			return autoQueen ? droppedSquare : previousDroppedSquare;
		}
	}

	async function sendPromotionMove(
		moveInfo: MoveInfo,
		promotedPiece: PieceType
	) {
		botGameWebsocketRef.current?.send(
			JSON.stringify({
				type: "move_made",
				move_info: {
					...moveInfo,
					additional_info: {
						promoted_piece: promotedPiece,
					},
				},
			})
		);
	}

	function handlePlayerMoveMade({
		new_structured_fen: newStructuredFEN,
		new_position_list: newPositionList,
		new_move_list: newMoveList,
		move_type: moveType,
	}: any) {
		setParsedFENString(newStructuredFEN);
		setPositionList(newPositionList);
		setMoveList(newMoveList);

		playAudio(moveType);
	}

	async function handlePawnPromotion(
		color: PieceColor,
		promotedPiece: PieceType,
		moveMethod: string,
		autoQueen: boolean = false
	) {
		console.log("Promotion function triggered!");

		if (!parsedFENString) {
			return;
		}

		const promotionStartingSquare = getPromotionStartingSquare(
			autoQueen,
			moveMethod
		);
		const promotionEndingSquare = getPromotionEndingSquare(
			autoQueen,
			moveMethod
		);

		if (!promotionStartingSquare || !promotionEndingSquare) {
			return;
		}

		if (!unpromotedBoardPlacementRef.current) {
			return;
		}

		console.log("Updating board placement");
		sendPromotionMove(
			{
				starting_square: promotionStartingSquare,
				destination_square: promotionEndingSquare,
				piece_color: color,
				piece_type: "pawn",
			},
			promotedPiece
		);
		selectingPromotionRef.current = false;

		const newSideToMove =
			sideToMove.toLowerCase() === "white" ? "black" : "white";

		setSideToMove(newSideToMove);

		setDraggedSquare(null);
		setDroppedSquare(null);
		setPreviousClickedSquare(null);
		setClickedSquare(null);
		setPromotionCapturedPiece(null);
	}

	function handleCheckmate({ game_winner: gameWinner }: any) {
		setGameEnded(true);
		setGameWinner(gameWinner)
		setGameEndedCause("checkmate");
	}

	function handleDraw(drawCause: string) {
		setGameEnded(true);
		setGameEndedCause(drawCause)
	}

	function handleOnMessage(event: MessageEvent) {
		const parsedEventData = JSON.parse(event.data);
		const eventType = parsedEventData["type"];

		console.log(parsedEventData);

		switch (eventType) {
			case BotGameWebSocketEventTypes.MOVE_REGISTERED:
				handlePlayerMoveMade(parsedEventData);
				break;

			case BotGameWebSocketEventTypes.CHECKMATE_OCCURRED:
				handleCheckmate(parsedEventData);
				break;

			case BotGameWebSocketEventTypes.STALEMATE_OCCURED:
				handleDraw("stalemate");
				break;

			case BotGameWebSocketEventTypes.THREEFOLD_REPETITION_OCCURED:
				handleDraw("repetition");
				break;

			case BotGameWebSocketEventTypes.FIFTY_MOVE_RULE_REACHED:
				handleDraw("50-move rule")
				break;

			default:
				console.error(`Invalid event type ${eventType}`)
		}
	}

	function generateChessboard() {
		const squareElements = [];

		const startingRow = orientation.toLowerCase() === "white" ? 8 : 1;
		const endingRow = orientation.toLowerCase() === "white" ? 1 : 8;

		for (
			let row = startingRow;
			orientation.toLowerCase() === "white"
				? row >= endingRow
				: row <= endingRow;
			orientation.toLowerCase() === "white" ? row-- : row++
		) {
			const startingIndex = getBoardStartingIndex(row, orientation);
			const endingIndex = getBoardEndingIndex(row, orientation);

			for (
				let square = startingIndex;
				orientation.toLowerCase() === "white"
					? square <= endingIndex
					: square >= endingIndex;
				orientation.toLowerCase() === "white" ? square++ : square--
			) {
				const squareIsLight = isSquareLight(square - 1);
				const squareColor = squareIsLight ? "light" : "dark";

				const boardPlacementSquare = `${square - 1}`;

				if (
					Object.keys(piecePlacements).includes(boardPlacementSquare)
				) {
					const pieceColor =
						piecePlacements[boardPlacementSquare]["piece_color"];
					const pieceType =
						piecePlacements[boardPlacementSquare]["piece_type"];

					const promotionRank =
						pieceColor.toLowerCase() === "white" ? 7 : 0;
					const pieceRank = getRank(boardPlacementSquare);

					squareElements.push(
						<Square
							key={boardPlacementSquare}
							squareNumber={boardPlacementSquare}
							squareColor={squareColor}
							pieceColor={pieceColor}
							pieceType={pieceType}
							displayPromotionPopup={
								pieceType.toLowerCase() === "pawn" &&
								promotionRank === pieceRank &&
								!autoQueen
							}
							orientation={orientation}
							handleSquareClick={handleSquareClick}
							setParsedFENString={setParsedFENString}
							setDraggedSquare={setDraggedSquare}
							setDroppedSquare={setDroppedSquare}
							handlePromotionCancel={handlePromotionCancel}
							handlePawnPromotion={handlePawnPromotion}
							previousDraggedSquare={previousDraggedSquare}
							previousDroppedSquare={previousDroppedSquare}
							moveMethod={lastUsedMoveMethod}
							squareSize={squareSize}
						/>
					);
				} else {
					squareElements.push(
						<Square
							key={boardPlacementSquare}
							squareNumber={boardPlacementSquare}
							squareColor={squareColor}
							orientation={orientation}
							handleSquareClick={handleSquareClick}
							displayPromotionPopup={false}
							setParsedFENString={setParsedFENString}
							setDraggedSquare={setDraggedSquare}
							setDroppedSquare={setDroppedSquare}
							handlePromotionCancel={handlePromotionCancel}
							handlePawnPromotion={handlePawnPromotion}
							previousDraggedSquare={previousDraggedSquare}
							previousDroppedSquare={previousDroppedSquare}
							moveMethod={lastUsedMoveMethod}
							squareSize={squareSize}
						/>
					);
				}
			}
		}

		return squareElements;
	}

	return (
		<>
			<div style={chessboardStyles} className="chessboard-container">
				{generateChessboard()}
			</div>
		</>
	);
}

export default BotChessboard;
