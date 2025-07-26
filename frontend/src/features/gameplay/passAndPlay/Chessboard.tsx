import { useState, useEffect, useContext, useRef } from "react";

import {
	clearSquaresStyling,
	getSquareExists,
} from "@sharedUtils/boardUtils";

import { playAudio } from "@sharedUtils/audioUtils";

import { disableCastling, handleCastling, isCastling } from "./utils/castling";

import {
	handleEnPassant,
	updateEnPassantTargetSquare,
} from "./utils/enPassant";

import {
	cancelPromotion,
	handlePromotionCaptureStorage,
	updatePromotedBoardPlacment,
} from "./utils/promotion";

import { getOppositeColor } from "./utils/general";
import usePieceAnimation from "@sharedHooks/usePieceAnimation";
import ChessboardGrid from "@sharedComponents/chessboard/ChessboardGrid";
import Square from "@sharedComponents/chessboard/Square";
import {
	displayLegalMoves,
	fetchMoveIsValid,
} from "../common/utils/moveService";
import {
	BoardPlacement,
	CastlingSide,
	MoveInfo,
	ParsedFEN,
} from "@sharedTypes/chessTypes/gameState.types";
import {
	PieceColor,
	PieceInfo,
	PieceType,
} from "@sharedTypes/chessTypes/pieces.types";
import {
	GameEndedSetterContext,
	GameEndedCauseSetterContext,
	GameWinnerSetterContext,
} from "./contexts/gameEndStateSetters";
import { ChessboardSquareIndex } from "@sharedTypes/chessTypes/board.types";
import { OptionalValue, StateSetterFunction } from "@sharedTypes/utility.types";
import { MoveMethods } from "@sharedTypes/chessTypes/moveMethods.enums";
import { BaseChessboardProps } from "@sharedTypes/chessTypes/chessboardProps.types";
import { FilledSquareRenderParams, EmptySquareRenderParams } from "@sharedTypes/chessTypes/chessboardGrid.types";
import { getIsCheckmated, getIsStalemated, processMove } from "@/shared/utils/apiUtils";

interface ChessboardProps extends BaseChessboardProps {
	setBoardOrientation: StateSetterFunction<string>;
	flipOnMove: boolean;
	gameplaySettings: any;
}

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

		const moveInfo: MoveInfo = {
			starting_square: draggedSquare.toString(),
			destination_square: droppedSquare.toString(),
			piece_type: pieceTypeToValidate,
			piece_color: pieceColorToValidate,
		};

		const updatedStructuredFEN = await processMove(parsedFENString, moveInfo);

		if (!updatedStructuredFEN) {
			return;
		}

		setParsedFEN(updatedStructuredFEN);

		await checkForGameEnd(updatedStructuredFEN, getOppositeColor(pieceColorToValidate));

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

	async function checkForGameEnd(structuredFEN: ParsedFEN, kingColor: PieceColor) {
		const isCheckmated = await getIsCheckmated(structuredFEN, kingColor);
		const isStalemated = await getIsStalemated(structuredFEN, kingColor);

		if (isCheckmated) {
			setGameEnded!(true);
			setGameEndedCause!("checkmate");
			setGameWinner!(getOppositeColor(kingColor));
			return;
		}

		if (isStalemated) {
			setGameEnded!(true);
			setGameEndedCause!("stalemate");
			setGameWinner!(null);
			return;
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

		const moveInfo: MoveInfo = {
			starting_square: previousClickedSquare.toString(),
			destination_square: clickedSquare.toString(),
			piece_type: pieceTypeToValidate,
			piece_color: pieceColorToValidate,
		};

		const updatedStructuredFEN = await processMove(parsedFENString, moveInfo);

		if (!updatedStructuredFEN) {
			return;
		}

		setParsedFEN(updatedStructuredFEN);
		await checkForGameEnd(updatedStructuredFEN, getOppositeColor(pieceColorToValidate));

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
				clickedSquare={clickedSquare}
				previousClickedSquare={previousClickedSquare}
				setPrevClickedSquare={setPreviousClickedSquare}
				setClickedSquare={setClickedSquare}
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
				prevClickedSquare={previousClickedSquare}
				clickedSquare={clickedSquare}
				setPrevClickedSquare={setPreviousClickedSquare}
				setClickedSquare={setClickedSquare}
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
