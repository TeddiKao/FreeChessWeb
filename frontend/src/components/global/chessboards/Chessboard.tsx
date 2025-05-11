import { useState, useEffect, useContext, useRef } from "react";

import "../../../styles/components/chessboard/chessboard.scss";
import Square from "../Square.js";

import {
	clearSquaresStyling,
	getRank,
	getBoardStartingIndex,
	getBoardEndingIndex,
	isSquareLight,
	getSquareExists,
	calculateXYTransform,
} from "../../../utils/boardUtils";

import { playAudio } from "../../../utils/audioUtils";

import {
	fetchLegalMoves,
	fetchMoveIsValid,
	getIsCheckmated,
	getIsStalemated,
} from "../../../utils/apiUtils";

import {
	disableCastling,
	handleCastling,
	isCastling,
} from "../../../utils/gameLogic/castling";

import {
	handleEnPassant,
	updateEnPassantTargetSquare,
} from "../../../utils/gameLogic/enPassant";

import {
	GameEndedSetterContext,
	GameEndedCauseSetterContext,
	GameWinnerSetterContext,
} from "../../../contexts/chessboardContexts.ts";

import {
	cancelPromotion,
	handlePromotionCaptureStorage,
	updatePromotedBoardPlacment,
} from "../../../utils/gameLogic/promotion";

import {
	addPieceToDestinationSquare,
	clearStartingSquare,
} from "../../../utils/gameLogic/basicMovement";

import { MoveMethods } from "../../../enums/gameLogic.ts";
import { getOppositeColor } from "../../../utils/gameLogic/general";
import { ChessboardProps } from "../../../interfaces/chessboard.js";
import {
	ChessboardSquareIndex,
	OptionalValue,
} from "../../../types/general.js";
import {
	BoardPlacement,
	CastlingSide,
	MoveInfo,
	ParsedFENString,
	PieceColor,
	PieceInfo,
	PieceType,
} from "../../../types/gameLogic.js";

function Chessboard({
	parsed_fen_string,
	orientation,
	setBoardOrientation,
	flipOnMove,
	gameplaySettings,
	squareSize,
}: ChessboardProps) {
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
		useState<OptionalValue<ChessboardSquareIndex>>(null);
	const [previousDroppedSquare, setPreviousDroppedSquare] =
		useState<OptionalValue<ChessboardSquareIndex>>(null);
	const [promotionCapturedPiece, setPromotionCapturedPiece] =
		useState<OptionalValue<PieceInfo>>(null);

	const [lastUsedMoveMethod, setLastUsedMoveMethod] =
		useState<OptionalValue<string>>(null);

	const [sideToMove, setSideToMove] = useState<string>("white");

	const [animatingPieceSquare, setAnimatingPieceSquare] =
		useState<OptionalValue<number>>(null);
	const [animatingPieceStyles, setAnimatingPieceStyles] = useState({});

	const setGameEnded = useContext(GameEndedSetterContext);
	const setGameEndedCause = useContext(GameEndedCauseSetterContext);
	const setGameWinner = useContext(GameWinnerSetterContext);

	const isFirstRender = useRef<boolean>(false);
	const selectingPromotionRef = useRef<boolean>(false);
	const unpromotedBoardPlacementRef =
		useRef<OptionalValue<ParsedFENString>>(null);

	const chessboardStyles = {
		gridTemplateColumns: `repeat(8, ${squareSize}px)`,
	};

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
		if (isFirstRender.current) {
			isFirstRender.current = false;
			return;
		}

		if (flipOnMove) {
			setBoardOrientation(sideToMove.toLowerCase());
		}
	}, [sideToMove]);

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

		const boardPlacementToValidate: BoardPlacement =
			parsedFENString["board_placement"];
		const squareInfoToValidate =
			boardPlacementToValidate[`${draggedSquare}`];

		const pieceTypeToValidate = squareInfoToValidate["piece_type"];
		const pieceColorToValidate: PieceColor =
			squareInfoToValidate["piece_color"];

		const [moveIsLegal, moveType] = await fetchMoveIsValid(
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

		const lowercasedPieceType =
			pieceTypeToValidate.toLowerCase() as Lowercase<
				typeof pieceTypeToValidate
			>;

		if (lowercasedPieceType === "pawn") {
			handlePromotionCaptureStorage(
				parsedFENString,
				pieceColorToValidate,
				draggedSquare,
				droppedSquare,
				setPromotionCapturedPiece,
				selectingPromotionRef,
				unpromotedBoardPlacementRef,
				handlePawnPromotion,
				gameplaySettings,
				"drag"
			);
		}

		setParsedFENString(
			(previousFENString: OptionalValue<ParsedFENString>) => {
				if (!previousFENString) {
					return parsedFENString;
				}

				const originalBoardPlacements =
					previousFENString["board_placement"];

				const draggedSquareInfo =
					originalBoardPlacements[`${draggedSquare}`];
				const pieceType = draggedSquareInfo["piece_type"];
				const pieceColor: PieceColor = draggedSquareInfo["piece_color"];

				const initialSquare = draggedSquareInfo["starting_square"];

				let newPiecePlacements: ParsedFENString =
					addPieceToDestinationSquare(
						previousFENString,
						droppedSquare,
						{
							piece_type: pieceType,
							piece_color: pieceColor,
							starting_square: initialSquare,
						}
					);

				newPiecePlacements = clearStartingSquare(
					newPiecePlacements,
					draggedSquare
				);

				if (pieceTypeToValidate.toLowerCase() === "pawn") {
					newPiecePlacements = handleEnPassant(
						newPiecePlacements,
						droppedSquare
					);
				}

				const enPassantMoveInfo: MoveInfo = {
					starting_square: draggedSquare,
					destination_square: droppedSquare,
					piece_type: pieceType,
					piece_color: pieceColor,
				};

				newPiecePlacements = updateEnPassantTargetSquare(
					newPiecePlacements,
					enPassantMoveInfo
				);

				if (pieceTypeToValidate.toLowerCase() === "rook") {
					const kingsideRookSquares = [7, 63];

					const initialSquareExists = initialSquare !== undefined;
					const kingsideRookMoved =
						initialSquareExists &&
						kingsideRookSquares.includes(Number(initialSquare));
					const sideToDisable: CastlingSide = kingsideRookMoved
						? "kingside"
						: "queenside";

					newPiecePlacements["castling_rights"] = disableCastling(
						pieceColorToValidate,
						newPiecePlacements["castling_rights"],
						[sideToDisable]
					);
				}

				if (pieceTypeToValidate.toLowerCase() === "king") {
					if (isCastling(draggedSquare, droppedSquare)) {
						const isKingside =
							Number(draggedSquare) - Number(droppedSquare) ===
							-2;

						const castlingSide: CastlingSide = isKingside
							? "kingside"
							: "queenside";

						newPiecePlacements = handleCastling(
							previousFENString,
							pieceColorToValidate,
							castlingSide
						);
					}

					const originalCastlingRights = structuredClone(
						newPiecePlacements["castling_rights"]
					);

					const newCastlingRights = disableCastling(
						pieceColorToValidate,
						originalCastlingRights,
						["kingside", "queenside"]
					);

					newPiecePlacements["castling_rights"] = newCastlingRights;
				}

				handleGameEndDetection(
					newPiecePlacements,
					pieceColorToValidate
				);

				return newPiecePlacements;
			}
		);

		const newSideToMove = getOppositeColor(pieceColorToValidate);

		if (!selectingPromotionRef.current) {
			setSideToMove(newSideToMove);
		}

		playAudio(moveType);

		setPreviousDraggedSquare(draggedSquare);
		setPreviousDroppedSquare(droppedSquare);
		setDraggedSquare(null);
		setDroppedSquare(null);
		setLastUsedMoveMethod("drag");
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

		const [isMoveLegal, moveType] = await fetchMoveIsValid(
			parsedFENString,
			pieceColorToValidate,
			pieceTypeToValidate,
			previousClickedSquare,
			clickedSquare
		);

		if (!isMoveLegal) {
			return;
		}

		if (pieceTypeToValidate === "pawn") {
			handlePromotionCaptureStorage(
				parsedFENString,
				pieceColorToValidate,
				previousClickedSquare,
				clickedSquare,
				setPromotionCapturedPiece,
				selectingPromotionRef,
				unpromotedBoardPlacementRef,
				handlePawnPromotion,
				gameplaySettings,
				"click"
			);
		}

		animatePiece();
		setTimeout(() => {
			setParsedFENString(
				(previousFENString: OptionalValue<ParsedFENString>) => {
					if (!previousFENString) {
						return parsedFENString;
					}

					const oringinalBoardPlacements =
						previousFENString["board_placement"];

					const pieceType =
						oringinalBoardPlacements[`${previousClickedSquare}`][
							"piece_type"
						];
					const pieceColor =
						oringinalBoardPlacements[`${previousClickedSquare}`][
							"piece_color"
						];

					let newPiecePlacements: ParsedFENString =
						addPieceToDestinationSquare(
							previousFENString,
							clickedSquare,
							{
								piece_type: pieceType,
								piece_color: pieceColor,
								starting_square: initialSquare,
							}
						);

					newPiecePlacements = clearStartingSquare(
						newPiecePlacements,
						previousClickedSquare
					);

					if (pieceTypeToValidate.toLowerCase() === "pawn") {
						newPiecePlacements = handleEnPassant(
							newPiecePlacements,
							clickedSquare
						);
					}

					const enPassantMoveInfo: MoveInfo = {
						starting_square: previousClickedSquare,
						destination_square: clickedSquare,
						piece_type: pieceTypeToValidate,
						piece_color: pieceColorToValidate,
					};

					newPiecePlacements = updateEnPassantTargetSquare(
						newPiecePlacements,
						enPassantMoveInfo
					);

					if (pieceTypeToValidate === "pawn") {
						const kingsideRookSquares = [7, 63];
						const initialSquareExists = initialSquare !== undefined;

						const kingsideRookMoved =
							initialSquareExists &&
							kingsideRookSquares.includes(Number(initialSquare));

						const sideToDisable: CastlingSide = kingsideRookMoved
							? "kingside"
							: "queenside";

						newPiecePlacements["castling_rights"] = disableCastling(
							pieceColorToValidate,
							newPiecePlacements["castling_rights"],
							[sideToDisable]
						);
					}

					if (pieceTypeToValidate.toLowerCase() === "king") {
						if (isCastling(previousClickedSquare, clickedSquare)) {
							const isKingside =
								Number(previousClickedSquare) -
									Number(clickedSquare) ===
								-2;
							const castlingSide: CastlingSide = isKingside
								? "kingside"
								: "queenside";

							newPiecePlacements = handleCastling(
								previousFENString,
								pieceColorToValidate,
								castlingSide
							);
						}

						const originalCastlingRights = structuredClone(
							newPiecePlacements["castling_rights"]
						);

						const newCastlingRights = disableCastling(
							pieceColorToValidate,
							originalCastlingRights,
							["kingside", "queenside"]
						);

						newPiecePlacements["castling_rights"] =
							newCastlingRights;
					}

					handleGameEndDetection(
						newPiecePlacements,
						pieceColorToValidate
					);

					return newPiecePlacements;
				}
			);
		}, 1000);

		const newSideToMove = getOppositeColor(pieceColorToValidate);

		setSideToMove(newSideToMove);

		playAudio(moveType);

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

	function animatePiece() {
		const [xTransform, yTransform] = calculateXYTransform(
			previousClickedSquare!,
			clickedSquare!,
			squareSize
		);

		setAnimatingPieceSquare(Number(previousClickedSquare));
		setAnimatingPieceStyles({
			transform: `translate(${xTransform}px, ${yTransform}px)`,
            pointerEvents: "none"
		});

		console.log("Styling set up!");
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
		if (
			!previousDraggedSquare ||
			!previousDroppedSquare ||
			!promotionCapturedPiece
		) {
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
				promotionCapturedPiece
			);

			return updatedBoardPlacement;
		});

		setPromotionCapturedPiece(null);
		selectingPromotionRef.current = false;
	}

	async function handleGameEndDetection(
		fenString: ParsedFENString,
		color: PieceColor
	): Promise<void> {
		const kingColor = getOppositeColor(color);

		const isCheckmated = await checkIsCheckmated(fenString, kingColor);
		const isStalemated = await checkIsStalemated(fenString, kingColor);

		const gameEnded = isCheckmated || isStalemated;
		if (gameEnded) {
			handleGameEnded(isCheckmated, color);
		}
	}

	function handleGameEnded(isCheckmated: boolean, color: string) {
		if (!setGameEnded || !setGameEndedCause || !setGameWinner) {
			throw new Error("Game ended contexts not provided");
		}

		setGameEnded(true);

		const gameEndedCause = isCheckmated ? "checkmate" : "stalemate";
		const gameWinner = isCheckmated ? color : null;

		setGameEndedCause(gameEndedCause);
		setGameWinner(gameWinner);
	}

	async function checkIsCheckmated(
		currentFEN: ParsedFENString,
		kingColor: string
	) {
		const isCheckmated = await getIsCheckmated(currentFEN, kingColor);

		return isCheckmated;
	}

	async function checkIsStalemated(
		currentFEN: ParsedFENString,
		kingColor: string
	) {
		const isStalemated = await getIsStalemated(currentFEN, kingColor);

		return isStalemated;
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

	async function handlePawnPromotion(
		color: PieceColor,
		promotedPiece: PieceType,
		moveMethod: string,
		autoQueen: boolean = false
	) {
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

		await updatePromotedBoardPlacment(
			parsedFENString,
			color,
			promotedPiece,
			autoQueen,
			promotionStartingSquare,
			promotionEndingSquare,
			unpromotedBoardPlacementRef
		);

		const [updatedBoardPlacement, moveType]: any =
			await updatePromotedBoardPlacment(
				parsedFENString,
				color,
				promotedPiece,
				autoQueen,
				promotionStartingSquare,
				promotionEndingSquare,
				unpromotedBoardPlacementRef
			);

		setParsedFENString(updatedBoardPlacement);

		playAudio(moveType);
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
							animatingPieceStyle={animatingPieceStyles}
							animatingPieceSquare={animatingPieceSquare}
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
							animatingPieceSquare={animatingPieceSquare}
							animatingPieceStyle={animatingPieceStyles}
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

export default Chessboard;
