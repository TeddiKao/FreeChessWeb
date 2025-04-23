import React, { useState, useEffect, useRef } from "react";
import _ from "lodash";

// Basic imports like CSS files and components
import "../../styles/components/chessboard/chessboard.scss";
import Square from "../Square.js";

// Types, interfaces, enums
import {
	MoveMethods,
	GameplayWebSocketEventTypes,
} from "../../enums/gameLogic.ts";
import { MultiplayerChessboardProps } from "../../interfaces/chessboard.js";
import { ChessboardSquareIndex, OptionalValue } from "../../types/general.ts";
import {
	BoardPlacement,
	ParsedFENString,
	PieceColor,
	PieceInfo,
	PieceType,
} from "../../types/gameLogic.ts";

import {
	CheckmateEventData,
	MoveListUpdateEventData,
	MoveMadeEventData,
	PositionListUpdateEventData,
	TimerChangedEventData,
} from "../../interfaces/gameLogic.ts";

// Utils
import {
	clearSquaresStyling,
	getRank,
	getFile,
	getSquareExists,
} from "../../utils/boardUtils";
import {
	fetchCurrentPosition,
	fetchLegalMoves,
	fetchMoveIsValid,
} from "../../utils/apiUtils";

import {
	whitePromotionRank,
	blackPromotionRank,
} from "../../constants/boardSquares.js";

import { playAudio } from "../../utils/audioUtils";
import useWebSocket from "../../hooks/useWebsocket.ts";
import { getAccessToken } from "../../utils/tokenUtils.ts";
import { websocketBaseURL } from "../../constants/urls.ts";
import { getOppositeColor } from "../../utils/gameLogic/general.ts";

function MultiplayerChessboard({
	parsed_fen_string,
	orientation,
	gameId,
	setWhiteTimer,
	setBlackTimer,
	gameplaySettings,
	setPositionIndex,
	setPositionList,
	setMoveList,
	lastDraggedSquare,
	lastDroppedSquare,

	setGameEnded,
	setGameWinner,
	setGameEndedCause,

	squareSize,
}: MultiplayerChessboardProps) {
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

	const [boardOrientation, setBoardOrientation] = useState(orientation);

	const gameWebsocketRef = useRef<WebSocket | null>(null);
	const gameWebsocketExists = useRef<boolean>(false);

    const [gameWebsocketEnabled, setGameWebsocketEnabled] = useState(false);
	const gameWebsocketUrl = `${websocketBaseURL}ws/game-server/?token=${getAccessToken()}&gameId=${gameId}`;
	
    const gameWebsocket = useWebSocket(gameWebsocketUrl, handleOnMessage, undefined, gameWebsocketEnabled);

	const chessboardStyles = {
		gridTemplateColumns: `repeat(8, ${squareSize}px`,
	};

	useEffect(() => {
		setParsedFENString(parsed_fen_string);
	}, [parsed_fen_string]);

	useEffect(() => {
		setPreviousDraggedSquare(lastDraggedSquare);
		setPreviousDroppedSquare(lastDroppedSquare);
	}, [lastDraggedSquare, lastDraggedSquare]);

	useEffect(() => {
		setBoardOrientation(orientation);
	}, [orientation]);

	useEffect(() => {
		handleClickToMove();
	}, [previousClickedSquare, clickedSquare]);

	useEffect(() => {
		updateCurrentPosition();
	}, []);

	useEffect(() => {
		if (gameWebsocketExists.current === false) {
			window.addEventListener("beforeunload", handleWindowUnload);

			gameWebsocketRef.current = gameWebsocket;

			gameWebsocketExists.current = true;

            setGameWebsocketEnabled(true);
		}

		return () => {
			window.removeEventListener("beforeunload", handleWindowUnload);

			if (gameWebsocketRef.current?.readyState === WebSocket.OPEN) {
				gameWebsocketRef.current.close();
				gameWebsocketExists.current = false;
			}
		};
	}, []);

    useEffect(() => {
        gameWebsocketRef.current = gameWebsocket;
    }, [gameWebsocket]);

	useEffect(() => {
		handleOnDrop();
	}, [draggedSquare, droppedSquare]);

	function handleWindowUnload() {
		if (gameWebsocketRef.current?.readyState === WebSocket.OPEN) {
			gameWebsocketRef.current.close();
			gameWebsocketExists.current = false;
		}
	}

	function handleOnMessage(event: MessageEvent) {
		const parsedEventData = JSON.parse(event.data);
		const eventType = parsedEventData["type"];

		switch (eventType) {
			case GameplayWebSocketEventTypes.MOVE_MADE:
				makeMove(parsedEventData);
				break;

			case GameplayWebSocketEventTypes.TIMER_DECREMENTED:
				handleTimerChange(parsedEventData);
				break;

			case GameplayWebSocketEventTypes.TIMER_INCREMENTED:
				handleTimerChange(parsedEventData);
				break;

			case GameplayWebSocketEventTypes.POSITION_LIST_UPDATED:
				handlePositionListUpdate(parsedEventData);
				break;

			case GameplayWebSocketEventTypes.MOVE_LIST_UPDATED:
				handleMoveListUpdate(parsedEventData);
				break;

			case GameplayWebSocketEventTypes.PLAYER_CHECKMATED:
				handleCheckmate(parsedEventData);
				break;

			case GameplayWebSocketEventTypes.PLAYER_STALEMATED:
				handleStalemate();
				break;

			case GameplayWebSocketEventTypes.THREEFOLD_REPETITION_DETECTED:
				handleThreefoldRepetition();
				break;

			case GameplayWebSocketEventTypes.FIFTY_MOVE_RULE_DETECTED:
				handle50MoveRule();
				break;

			case GameplayWebSocketEventTypes.INSUFFICIENT_MATERIAL:
				handleInsufficientMaterial();
				break;

			case GameplayWebSocketEventTypes.PLAYER_TIMEOUT:
				handlePlayerTimeout(parsedEventData);
				break;

			default:
				break;
		}
	}

	async function updateCurrentPosition(): Promise<void> {
		const currentPosition = await fetchCurrentPosition(Number(gameId));

		setParsedFENString(currentPosition);
	}

	function handleStalemate() {
		setGameEnded(true);
		setGameEndedCause("Stalemate");
	}

	function handleThreefoldRepetition() {
		setGameEnded(true);
		setGameEndedCause("Repetition");
	}

	function handle50MoveRule() {
		setGameEnded(true);
		setGameEndedCause("50-move-rule");
	}

	function handleInsufficientMaterial() {
		setGameEnded(true);
		setGameEndedCause("Insufficient material");
	}

	function handleCheckmate(parsedEventData: CheckmateEventData) {
		setGameEnded(true);
		setGameEndedCause("Checkmate");
		setGameWinner(parsedEventData["winning_color"]);
	}

	function handlePlayerTimeout(parsedEventData: any) {
		// if (parsedEventData["timeout_color"].toLowerCase() === "white") {
		//     setWhiteTimer(0);
		// } else {
		//     setBlackTimer(0);
		// }

		setGameEnded(true);
		setGameEndedCause("Timeout");
		setGameWinner(getOppositeColor(parsedEventData["timeout_color"]));
	}

	function handleTimerChange(parsedEventData: TimerChangedEventData) {
		const newWhitePlayerClock = parsedEventData["white_player_clock"];
		const newBlackPlayerClock = parsedEventData["black_player_clock"];

		setWhiteTimer(Math.ceil(newWhitePlayerClock));
		setBlackTimer(Math.ceil(newBlackPlayerClock));
	}

	function handlePositionListUpdate(
		parsedEventData: PositionListUpdateEventData
	) {
		const newPositionList = parsedEventData["new_position_list"];
		setPositionList(newPositionList);
	}

	function handleMoveListUpdate(parsedEventData: MoveListUpdateEventData) {
		const newMoveList = parsedEventData["new_move_list"];
		setMoveList(newMoveList);
	}

	function makeMove(eventData: MoveMadeEventData) {
		setPositionIndex(eventData["new_position_index"]);

		playAudio(eventData["move_type"]);
	}

	async function handleOnDrop() {
		clearSquaresStyling();

		if (!parsedFENString) {
			return;
		}

		if (!draggedSquare) {
			return;
		}

		if (!droppedSquare) {
			handleLegalMoveDisplay("drag");
			setLastUsedMoveMethod("drag");

			return;
		}

		if (draggedSquare === droppedSquare) {
			setDraggedSquare(null);
			setDroppedSquare(null);

			return;
		}

		const boardPlacementToValidate = parsedFENString["board_placement"];
		const squareInfoToValidate =
			boardPlacementToValidate[`${draggedSquare}`];

		const initialSquare = squareInfoToValidate["starting_square"];

		const pieceTypeToValidate = squareInfoToValidate["piece_type"];
		const pieceColorToValidate = squareInfoToValidate["piece_color"];

		const autoQueen = gameplaySettings["auto_queen"];

		const moveIsLegal = await fetchMoveIsValid(
			parsedFENString,
			pieceColorToValidate,
			pieceTypeToValidate,
			draggedSquare,
			droppedSquare
		);

		if (!moveIsLegal) {
			setDraggedSquare(null);
			setDroppedSquare(null);
			return;
		}

		if (pieceTypeToValidate.toLowerCase() === "pawn") {
			const isPromotion = handlePromotionCapture(
				pieceColorToValidate,
				draggedSquare,
				droppedSquare,
				autoQueen
			);

			if (isPromotion) {
				handlePromotionSetup(pieceColorToValidate, "drag");

				return;
			}
		}

		if (gameWebsocketRef.current?.readyState === WebSocket.OPEN) {
			const pieceInfo = {
				piece_color: pieceColorToValidate,
				piece_type: pieceTypeToValidate,
			};

			sendRegularMoveDetails(pieceInfo, initialSquare, "drag");
		} 

		setDraggedSquare(null);
		setDroppedSquare(null);
		setLastUsedMoveMethod("drag");
	}

	function sendRegularMoveDetails(
		pieceInfo: PieceInfo,
		initialSquare: ChessboardSquareIndex | undefined,
		moveMethod: string
	) {
		const usingDrag = moveMethod.toLowerCase() === "drag";

		const moveDetails = {
			type: "move_made",

			piece_color: pieceInfo["piece_color"],
			piece_type: pieceInfo["piece_type"],
			starting_square: usingDrag ? draggedSquare : previousClickedSquare,
			initial_square: initialSquare,
			destination_square: usingDrag ? droppedSquare : clickedSquare,

			additional_info: {},
		};

		gameWebsocketRef.current?.send(JSON.stringify(moveDetails));
	}

	function handlePromotionSetup(
		pieceColorToValidate: PieceColor,
		moveMethod: string
	) {
		const usingDrag = moveMethod.toLowerCase() === "drag";
		const squareToClear = usingDrag ? draggedSquare : previousClickedSquare;
		const promotionSquare = usingDrag ? droppedSquare : clickedSquare;

		setParsedFENString((prevFENString: OptionalValue<ParsedFENString>) => {
			if (!prevFENString) {
				return parsedFENString;
			}

			let newPiecePlacements = structuredClone(prevFENString);

			newPiecePlacements = {
				...newPiecePlacements,
				board_placement: {
					...newPiecePlacements["board_placement"],
					[`${promotionSquare}`]: {
						piece_type: "pawn",
						piece_color: pieceColorToValidate,
					},
				},
			};

			delete newPiecePlacements["board_placement"][`${squareToClear}`];

			return newPiecePlacements;
		});

		setPreviousDraggedSquare(squareToClear);
		setPreviousDroppedSquare(promotionSquare);

		if (usingDrag) {
			setDraggedSquare(null);
			setDroppedSquare(null);
		} else {
			setPreviousClickedSquare(null);
			setClickedSquare(null);
		}

		setLastUsedMoveMethod(usingDrag ? "drag" : "click");
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

		displayLegalMoves(pieceType, pieceColor, startingSquare);
	}

	async function handleClickToMove() {
		if (!parsedFENString) {
			return;
		}

		if (!previousClickedSquare) {
			return;
		}

		clearSquaresStyling();

		const boardPlacement: BoardPlacement =
			parsedFENString["board_placement"];

		if (!getSquareExists(previousClickedSquare, boardPlacement)) {
			setPreviousClickedSquare(null);
			setClickedSquare(null);

			return;
		}

		if (!clickedSquare) {
			handleLegalMoveDisplay("click");
			setLastUsedMoveMethod("click");

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
		const pieceColorToValidate =
			boardPlacement[`${previousClickedSquare}`]["piece_color"];

		const isMoveLegal = await fetchMoveIsValid(
			parsedFENString,
			pieceColorToValidate,
			pieceTypeToValidate,
			previousClickedSquare,
			clickedSquare
		);

		if (!isMoveLegal) {
			return;
		}

		if (pieceTypeToValidate.toLowerCase() === "pawn") {
			const isPromotion = handlePromotionCapture(
				pieceColorToValidate,
				previousClickedSquare,
				clickedSquare
			);

			if (isPromotion) {
				handlePromotionSetup(pieceColorToValidate, "click");
				return;
			}
		}

		if (gameWebsocketRef.current?.readyState === WebSocket.OPEN) {
			const pieceInfo = {
				piece_color: pieceColorToValidate,
				piece_type: pieceTypeToValidate,
			};

			sendRegularMoveDetails(pieceInfo, initialSquare, "click");
		}

		setPreviousClickedSquare(null);
		setClickedSquare(null);

		setLastUsedMoveMethod("click");
	}

	async function displayLegalMoves(
		pieceType: PieceType,
		pieceColor: PieceColor,
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

	const piecePlacements = parsedFENString["board_placement"];

	function handleSquareClick(event: React.MouseEvent<HTMLElement>) {
		if (!previousClickedSquare && !clickedSquare) {
			setPreviousClickedSquare(event.currentTarget.id);
		} else {
			setClickedSquare(event.currentTarget.id);
		}
	}

	function handlePromotionCancel(color: PieceColor) {
		if (!previousDraggedSquare || !previousDroppedSquare) {
			return;
		}

		setParsedFENString((prevFENString: OptionalValue<ParsedFENString>) => {
			if (!prevFENString) {
				return parsedFENString;
			}

			let updatedBoardPlacement = {
				...prevFENString,
				board_placement: {
					...prevFENString["board_placement"],
					[previousDraggedSquare]: {
						piece_type: "pawn" as PieceType,
						piece_color: color,
					},
				},
			};

			delete updatedBoardPlacement["board_placement"][
				previousDroppedSquare
			];

			if (
				!Object.keys(prevFENString["board_placement"]).includes(
					`${previousDroppedSquare}`
				)
			) {
				return updatedBoardPlacement;
			}

			if (!promotionCapturedPiece) {
				return updatedBoardPlacement;
			}

			if (
				promotionCapturedPiece["piece_color"].toLowerCase() ===
				color.toLowerCase()
			) {
				return updatedBoardPlacement;
			}

			updatedBoardPlacement = {
				...updatedBoardPlacement,
				board_placement: {
					...updatedBoardPlacement["board_placement"],
					[previousDroppedSquare]: promotionCapturedPiece,
				},
			};

			return updatedBoardPlacement;
		});

		setPromotionCapturedPiece(null);
	}

	function handlePromotionCapture(
		pieceColor: PieceColor,
		startSquare: ChessboardSquareIndex,
		destinationSquare: ChessboardSquareIndex,
		autoQueen: boolean = false
	) {
		if (!parsedFENString) {
			return;
		}

		const rank = getRank(destinationSquare);
		const startFile = getFile(startSquare);
		const endFile = getFile(destinationSquare);
		const fileDifference = Math.abs(startFile - endFile);

		const promotionRank =
			pieceColor.toLowerCase() === "white"
				? whitePromotionRank
				: blackPromotionRank;

		const isCapture = fileDifference === 1;
		const isPromotion = rank === promotionRank;

		if (isPromotion && autoQueen) {
			handleAutoQueen(pieceColor, startSquare, destinationSquare);

			return;
		}

		if (!isPromotion || !isCapture) {
			if (isPromotion && fileDifference === 0) {
				return true;
			}

			return;
		}

		const boardPlacement = parsedFENString["board_placement"];
		const capturedPieceInfo = boardPlacement[`${destinationSquare}`];

		setPromotionCapturedPiece(capturedPieceInfo);

		return true;
	}

	function handleAutoQueen(
		pieceColor: string,
		startSquare: ChessboardSquareIndex,
		destinationSquare: ChessboardSquareIndex
	) {
		console.log("Queening automatically");

		const moveDetails = {
			type: "move_made",

			piece_color: pieceColor,
			piece_type: "pawn",
			starting_square: startSquare,
			destination_square: destinationSquare,

			additional_info: {
				promoted_piece: "queen",
			},
		};

		gameWebsocketRef?.current?.send(JSON.stringify(moveDetails));
	}

	function handlePawnPromotion(color: PieceColor, promotedPiece: PieceType) {
		sendPromotionDetails(color, promotedPiece);

		setDraggedSquare(null);
		setDroppedSquare(null);
		setPreviousClickedSquare(null);
		setClickedSquare(null);
		setPromotionCapturedPiece(null);
	}

	function sendPromotionDetails(color: string, promotedPiece: string) {
		const moveDetails = {
			type: "move_made",

			piece_color: color,
			piece_type: "Pawn",
			starting_square: previousDraggedSquare,
			destination_square: previousDroppedSquare,

			additional_info: {
				promoted_piece: promotedPiece,
			},
		};

		gameWebsocketRef?.current?.send(JSON.stringify(moveDetails));
	}

	function generateChessboard() {
		const squareElements = [];

		const startingRow = boardOrientation.toLowerCase() === "white" ? 8 : 1;
		const endingRow = boardOrientation.toLowerCase() === "white" ? 1 : 8;

		for (
			let row = startingRow;
			boardOrientation.toLowerCase() === "white"
				? row >= endingRow
				: row <= endingRow;
			boardOrientation.toLowerCase() === "white" ? row-- : row++
		) {
			const whiteOrientationStartingIndex = (row - 1) * 8 + 1;
			const whiteOrientationEndingIndex = row * 8;

			const blackOrientationStartingIndex = row * 8;
			const blackOrientationEndingIndex = (row - 1) * 8 + 1;

			const startingIndex =
				boardOrientation.toLowerCase() === "white"
					? whiteOrientationStartingIndex
					: blackOrientationStartingIndex;
			const endingIndex =
				boardOrientation.toLowerCase() === "white"
					? whiteOrientationEndingIndex
					: blackOrientationEndingIndex;

			for (
				let square = startingIndex;
				boardOrientation.toLowerCase() === "white"
					? square <= endingIndex
					: square >= endingIndex;
				boardOrientation.toLowerCase() === "white" ? square++ : square--
			) {
				const file = getFile(square);

				const squareIsLight = (file + row) % 2 !== 0;
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
								promotionRank === pieceRank
							}
							handleSquareClick={handleSquareClick}
							setParsedFENString={setParsedFENString}
							setDraggedSquare={setDraggedSquare}
							setDroppedSquare={setDroppedSquare}
							handlePromotionCancel={handlePromotionCancel}
							handlePawnPromotion={handlePawnPromotion}
							previousDraggedSquare={previousDraggedSquare}
							previousDroppedSquare={previousDroppedSquare}
							orientation={boardOrientation}
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
							handleSquareClick={handleSquareClick}
							displayPromotionPopup={false}
							setParsedFENString={setParsedFENString}
							setDraggedSquare={setDraggedSquare}
							setDroppedSquare={setDroppedSquare}
							handlePromotionCancel={handlePromotionCancel}
							handlePawnPromotion={handlePawnPromotion}
							previousDraggedSquare={previousDraggedSquare}
							previousDroppedSquare={previousDroppedSquare}
							orientation={boardOrientation}
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

export default MultiplayerChessboard;
