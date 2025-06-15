import { useState, useEffect, useRef } from "react";

import "../../../styles/components/chessboard/chessboard.scss";
import Square from "../chessboard/Square.tsx";

import {
	clearSquaresStyling,
	getRank,
	getSquareExists,
} from "../../../utils/boardUtils";

import { fetchLegalMoves } from "../../../utils/apiUtils";

import {
	cancelPromotion,
	handlePromotionCaptureStorage,
	preparePawnPromotion,
} from "../../../utils/gameLogic/promotion";

import {
	BotGameWebSocketEventTypes,
	MoveMethods,
} from "../../../enums/gameLogic.ts";
import { BotChessboardProps } from "../../../interfaces/chessboard.js";
import {
	ChessboardSquareIndex,
	OptionalValue,
} from "../../../types/general.js";
import {
	BoardPlacement,
	MoveInfo,
	ParsedFENString,
	PieceColor,
	PieceInfo,
	PieceType,
} from "../../../types/gameLogic.js";
import { isPawnPromotion } from "../../../utils/moveUtils.ts";
import useWebSocket from "../../../hooks/useWebsocket.ts";
import { isObjEmpty, parseWebsocketUrl } from "../../../utils/generalUtils.ts";
import usePieceAnimation from "../../../hooks/usePieceAnimation.ts";
import {
	EmptySquareRenderParams,
	FilledSquareRenderParams,
} from "../../../interfaces/chessboardGrid.ts";
import ChessboardGrid from "../chessboard/ChessboardGrid.tsx";
import useWebsocketLifecycle from "../../../hooks/useWebsocketLifecycle.ts";
function BotChessboard({
	parsed_fen_string,
	orientation,
	gameplaySettings,
	squareSize,
	gameId,
	setMoveList,
	setPositionList,
	lastDraggedSquare,
	lastDroppedSquare,
	setGameEnded,
	setGameEndedCause,
	setGameWinner,

	parentAnimationSquare,
	parentAnimationStyles,
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
	const [pieceAnimationSquare, pieceAnimationStyles, animatePiece] =
		usePieceAnimation();

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
		handleMoveMade("click");
	}, [previousClickedSquare, clickedSquare]);

	useEffect(() => {
		handleMoveMade("drag");
	}, [draggedSquare, droppedSquare]);

	useEffect(() => {
		setPreviousDraggedSquare(lastDraggedSquare);
		setPreviousDroppedSquare(lastDroppedSquare);
	}, [lastDraggedSquare, lastDroppedSquare]);

	useWebsocketLifecycle({
		websocket: socket,
		websocketRef: botGameWebsocketRef,
		websocketExistsRef: botGameWebsocketExists,
		setWebsocketEnabled: setBotGameWebsocketEnabled,
		handleWindowUnload: handleWindowUnload,
	});

	useEffect(() => {
		botGameWebsocketRef.current = socket;
	}, [socket]);

	function handleWindowUnload() {
		if (botGameWebsocketRef.current?.readyState === WebSocket.OPEN) {
			botGameWebsocketRef.current?.close();
			botGameWebsocketExists.current = false;
		}
	}

	function handleMoveMade(moveMethod: string) {
		const startingSquare =
			moveMethod === "drag" ? draggedSquare : previousClickedSquare;
		const destinationSquare =
			moveMethod === "drag" ? droppedSquare : clickedSquare;

		clearSquaresStyling();

		if (!parsedFENString) {
			return null;
		}

		if (!(startingSquare && destinationSquare)) {
			if (!startingSquare) {
				return;
			}

			handleLegalMoveDisplay(moveMethod);

			return;
		}

		if (startingSquare === destinationSquare) {
			return;
		}

		const boardPlacement = parsedFENString["board_placement"];
		const squareInfo = boardPlacement[`${startingSquare}`];

		const pieceColor = squareInfo["piece_color"];
		const pieceType = squareInfo["piece_type"];
		const initialSquare = squareInfo["starting_square"];

		updateBoardOnMove(pieceColor, pieceType, initialSquare);

		if (moveMethod == MoveMethods.DRAG) {
			setDraggedSquare(null);
			setDroppedSquare(null);
		} else if (moveMethod == MoveMethods.CLICK) {
			setPreviousClickedSquare(null);
			setClickedSquare(null);
		}

		setLastUsedMoveMethod(moveMethod);
	}

	async function updateBoardOnMove(
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
			? `${draggedSquare}`
			: `${previousClickedSquare}`;

		console.log(typeof startingSquare);

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
		new_position_list: newPositionList,
		new_move_list: newMoveList,
		move_data: moveData,
	}: any) {
		// @ts-ignore
		animatePiece(
			moveData["starting_square"],
			moveData["destination_square"],
			orientation.toLowerCase(),
			squareSize
		);

		setPositionList(newPositionList);
		setMoveList(newMoveList);
	}

	function handleBotMoveMade({
		new_position_list: newPositionList,
		new_move_list: newMoveList,
		move_data: moveData,
	}: any) {
		// @ts-ignore
		animatePiece(
			moveData["starting_square"],
			moveData["destination_square"],
			orientation.toLowerCase(),
			squareSize
		);

		setPositionList(newPositionList);
		setMoveList(newMoveList);
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
		setGameWinner(gameWinner);
		setGameEndedCause("checkmate");
	}

	function handleDraw(drawCause: string) {
		setGameEnded(true);
		setGameEndedCause(drawCause);
	}

	function handleOnMessage(event: MessageEvent) {
		const parsedEventData = JSON.parse(event.data);
		const eventType = parsedEventData["type"];

		switch (eventType) {
			case BotGameWebSocketEventTypes.MOVE_REGISTERED:
				handlePlayerMoveMade(parsedEventData);
				break;

			case BotGameWebSocketEventTypes.CHECKMATE_OCCURRED:
				handleCheckmate(parsedEventData);
				break;

			case BotGameWebSocketEventTypes.STALEMATE_OCCURRED:
				handleDraw("stalemate");
				break;

			case BotGameWebSocketEventTypes.THREEFOLD_REPETITION_OCCURRED:
				handleDraw("repetition");
				break;

			case BotGameWebSocketEventTypes.FIFTY_MOVE_RULE_REACHED:
				handleDraw("50-move rule");
				break;

			case BotGameWebSocketEventTypes.BOT_MOVE_MADE:
				handleBotMoveMade(parsedEventData);
				break;

			default:
				console.error(`Invalid event type ${eventType}`);
		}
	}

	function renderFilledSquare({
		squareIndex,
		squareColor,
		pieceType,
		pieceColor,
		promotionRank,
		pieceRank,
	}: FilledSquareRenderParams) {
		return (
			<Square
				key={squareIndex}
				squareNumber={squareIndex}
				squareColor={squareColor}
				pieceColor={pieceColor as PieceColor}
				pieceType={pieceType as PieceType}
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
				// @ts-ignore
				animatingPieceSquare={
					pieceAnimationSquare || parentAnimationSquare
				}
				// @ts-ignore
				animatingPieceStyle={
					// @ts-ignore
					isObjEmpty(pieceAnimationStyles)
						? parentAnimationStyles
						: pieceAnimationStyles
				}
			/>
		);
	}

	function renderEmptySquare({
		squareIndex,
		squareColor,
	}: EmptySquareRenderParams) {
		return (
			<Square
				key={squareIndex}
				squareNumber={squareIndex}
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
				// @ts-ignore
				animatingPieceSquare={
					pieceAnimationSquare || parentAnimationSquare
				}
				// @ts-ignore
				animatingPieceStyle={
					// @ts-ignore
					isObjEmpty(pieceAnimationStyles)
						? parentAnimationStyles
						: pieceAnimationStyles
				}
			/>
		);
	}

	return (
		<>
			<ChessboardGrid
				renderFilledSquare={renderFilledSquare}
				renderEmptySquare={renderEmptySquare}
				boardOrientation={orientation}
				boardPlacement={parsedFENString["board_placement"]}
				chessboardStyles={chessboardStyles}
			/>
		</>
	);
}

export default BotChessboard;
