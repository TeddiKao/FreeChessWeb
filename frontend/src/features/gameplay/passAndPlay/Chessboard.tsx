import { useState, useEffect, useContext, useRef } from "react";

import "../../../styles/components/chessboard/chessboard.scss";

import {
	clearSquaresStyling,
	getSquareExists,
} from "../../../utils/boardUtils.ts";

import { playAudio } from "../../../utils/audioUtils.ts";

import {
	disableCastling,
	handleCastling,
	isCastling,
} from "./utils/castling.ts";

import {
	handleEnPassant,
	updateEnPassantTargetSquare,
} from "./utils/enPassant.ts";

import {
	GameEndedSetterContext,
	GameEndedCauseSetterContext,
	GameWinnerSetterContext,
} from "../../../contexts/chessboardContexts.ts";

import {
	cancelPromotion,
	handlePromotionCaptureStorage,
	updatePromotedBoardPlacment,
} from "./utils/promotion.ts";

import {
	addPieceToDestinationSquare,
	clearStartingSquare,
} from "./utils/basicMovement.ts";

import { MoveMethods } from "../../../enums/gameLogic.ts";
import { getOppositeColor } from "./utils/general.ts";
import { ChessboardProps } from "../../../interfaces/chessboard.js";
import {
	ChessboardSquareIndex,
	OptionalValue,
} from "../../../types/general.js";
import usePieceAnimation from "../../../hooks/usePieceAnimation.ts";
import { convertToMilliseconds } from "../../../utils/timeUtils.ts";
import { pieceAnimationTime } from "../../../constants/pieceAnimation.ts";
import ChessboardGrid from "../../../components/chessboard/ChessboardGrid.tsx";
import {
	EmptySquareRenderParams,
	FilledSquareRenderParams,
} from "../../../interfaces/chessboardGrid.ts";
import Square from "../../../components/chessboard/Square.tsx";
import { displayLegalMoves, fetchMoveIsValid } from "../common/utils/moveService.ts";
import {
	BoardPlacement,
	CastlingSide,
	MoveInfo,
	ParsedFEN,
} from "../common/types/gameState.types.ts";
import {
	PieceColor,
	PieceInfo,
	PieceType,
} from "../common/types/pieces.types.ts";
import {
	getIsCheckmated,
	getIsStalemated,
} from "../common/utils/gameResultFetchApi.ts";

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
	const [parsedFENString, setParsedFEN] =
		useState<OptionalValue<ParsedFEN>>(parsed_fen_string);

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

	const [animatingPieceSquare, animatingPieceStyles, animatePiece] =
		usePieceAnimation();

	const setGameEnded = useContext(GameEndedSetterContext);
	const setGameEndedCause = useContext(GameEndedCauseSetterContext);
	const setGameWinner = useContext(GameWinnerSetterContext);

	const isFirstRender = useRef<boolean>(false);
	const selectingPromotionRef = useRef<boolean>(false);
	const unpromotedBoardPlacementRef = useRef<OptionalValue<ParsedFEN>>(null);

	const chessboardStyles = {
		gridTemplateColumns: `repeat(8, ${squareSize}px)`,
	};

	useEffect(() => {
		setParsedFEN(parsed_fen_string);
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
			draggedSquare.toString(),
			droppedSquare.toString()
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

		setParsedFEN((previousFENString: OptionalValue<ParsedFEN>) => {
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

			let newPiecePlacements: ParsedFEN = addPieceToDestinationSquare(
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
						Number(draggedSquare) - Number(droppedSquare) === -2;

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

			handleGameEndDetection(newPiecePlacements, pieceColorToValidate);

			return newPiecePlacements;
		});

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
			setPreviousClickedSquare(null);
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
			previousClickedSquare.toString(),
			clickedSquare.toString()
		);

		if (!isMoveLegal) {
			setPreviousClickedSquare(null);
			setClickedSquare(null);

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

		// @ts-ignore
		animatePiece(
			previousClickedSquare,
			clickedSquare,
			orientation.toLowerCase(),
			squareSize
		);

		setTimeout(() => {
			setParsedFEN((previousFENString: OptionalValue<ParsedFEN>) => {
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

				let newPiecePlacements: ParsedFEN = addPieceToDestinationSquare(
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

					newPiecePlacements["castling_rights"] = newCastlingRights;
				}

				handleGameEndDetection(
					newPiecePlacements,
					pieceColorToValidate
				);

				return newPiecePlacements;
			});
		}, convertToMilliseconds(pieceAnimationTime));

		const newSideToMove = getOppositeColor(pieceColorToValidate);

		setSideToMove(newSideToMove);

		playAudio(moveType);

		setPreviousDraggedSquare(previousClickedSquare);
		setPreviousDroppedSquare(clickedSquare);
		setPreviousClickedSquare(null);
		setClickedSquare(null);
		setLastUsedMoveMethod("click");
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
		} else if (previousClickedSquare && !clickedSquare) {
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

		if (!showLegalMoves) {
			return;
		}

		displayLegalMoves(parsedFENString, startingSquare);
	}

	function handlePromotionCancel(color: PieceColor) {
		if (
			!previousDraggedSquare ||
			!previousDroppedSquare ||
			!promotionCapturedPiece
		) {
			return;
		}

		setParsedFEN((prevFENString: OptionalValue<ParsedFEN>) => {
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
		fenString: ParsedFEN,
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

	async function checkIsCheckmated(currentFEN: ParsedFEN, kingColor: string) {
		const isCheckmated = await getIsCheckmated(currentFEN, kingColor);

		return isCheckmated;
	}

	async function checkIsStalemated(currentFEN: ParsedFEN, kingColor: string) {
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
				promotionStartingSquare.toString(),
				promotionEndingSquare.toString(),
				unpromotedBoardPlacementRef
			);

		setParsedFEN(updatedBoardPlacement);

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
				setParsedFEN={setParsedFEN}
				setDraggedSquare={setDraggedSquare}
				setDroppedSquare={setDroppedSquare}
				handlePromotionCancel={handlePromotionCancel}
				handlePawnPromotion={handlePawnPromotion}
				previousDraggedSquare={previousDraggedSquare}
				previousDroppedSquare={previousDroppedSquare}
				moveMethod={lastUsedMoveMethod}
				squareSize={squareSize}
				//@ts-ignore
				animatingPieceSquare={animatingPieceSquare}
				//@ts-ignore
				animatingPieceStyle={animatingPieceStyles}
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
				setParsedFEN={setParsedFEN}
				setDraggedSquare={setDraggedSquare}
				setDroppedSquare={setDroppedSquare}
				handlePromotionCancel={handlePromotionCancel}
				handlePawnPromotion={handlePawnPromotion}
				previousDraggedSquare={previousDraggedSquare}
				previousDroppedSquare={previousDroppedSquare}
				moveMethod={lastUsedMoveMethod}
				squareSize={squareSize}
				//@ts-ignore
				animatingPieceSquare={animatingPieceSquare}
				//@ts-ignore
				animatingPieceStyle={animatingPieceStyles}
			/>
		);
	}

	return (
		<>
			{/* <div style={chessboardStyles} className="chessboard-container">
				{generateChessboard()}
			</div> */}

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

export default Chessboard;
