import { useRef, useState } from "react";
import { BoardPlacement, ParsedFENString, PieceColor } from "../../types/gameLogic";
import { ChessboardSquareIndex } from "../../types/general";
import { getRank } from "../../utils/boardUtils";
import { isPawnPromotion } from "../../utils/moveUtils";

function usePromotionLogic(parsedFEN: ParsedFENString) {
    const boardStateBeforePromotion = useRef<BoardPlacement | null>(null);
	const prePromotionBoardState = useRef<ParsedFENString | null>(null);

	const promotionSquareRef = useRef<ChessboardSquareIndex | null>(null);
	const originalPawnSquareRef = useRef<ChessboardSquareIndex | null>(null);

	const [shouldShowPromotionPopup, setShouldShowPromotionPopup] =
		useState(false);

    function storeBoardStateBeforePromotion(
		color: PieceColor,
		destinationSquare: ChessboardSquareIndex
	) {
		if (!parsedFEN) return;

		const isPromotion = isPawnPromotion(color, getRank(destinationSquare));

		if (!isPromotion) return;

		boardStateBeforePromotion.current = parsedFEN["board_placement"];
	}

    function cancelPromotion() {
		setShouldShowPromotionPopup(false);

		clearPrePromotionBoardState();
		clearBoardStateBeforePromotion();
		clearPromotionSquare();
		clearOriginalPawnSquare();
	}

	function performPostPromotionCleanup() {
		clearBoardStateBeforePromotion();
		clearPrePromotionBoardState();
		clearPromotionSquare();
		clearOriginalPawnSquare();

		setShouldShowPromotionPopup(false);
	}

	function preparePromotion(
		startingSquare: ChessboardSquareIndex,
		destinationSquare: ChessboardSquareIndex
	) {
		updatePrePromotionBoardState(startingSquare, destinationSquare);
		updatePromotionSquare(destinationSquare);
		updateOriginalPawnSquare(startingSquare);
	}

    function updatePrePromotionBoardState(
		startingSquare: ChessboardSquareIndex,
		destinationSquare: ChessboardSquareIndex
	) {
		if (!parsedFEN) return;

		const prePromotionParsedFEN = structuredClone(parsedFEN);
		const currentBoardPlacement = prePromotionParsedFEN["board_placement"];
		const pawnInfo = currentBoardPlacement[startingSquare.toString()];

		const prePromotionBoardPlacement = structuredClone(
			currentBoardPlacement
		);

		delete prePromotionBoardPlacement[startingSquare.toString()];
		prePromotionBoardPlacement[destinationSquare.toString()] = pawnInfo;

		prePromotionParsedFEN["board_placement"] = prePromotionBoardPlacement;
		prePromotionBoardState.current = prePromotionParsedFEN;
	}

    function updatePromotionSquare(square: ChessboardSquareIndex) {
		promotionSquareRef.current = square;
	}

	function updateOriginalPawnSquare(square: ChessboardSquareIndex) {
		originalPawnSquareRef.current = square;
	}

	function clearBoardStateBeforePromotion() {
		boardStateBeforePromotion.current = null;
	}

	function clearPrePromotionBoardState() {
		prePromotionBoardState.current = null;
	}

	function clearOriginalPawnSquare() {
		originalPawnSquareRef.current = null;
	}

	function clearPromotionSquare() {
		promotionSquareRef.current = null;
	}

    return { preparePromotion, cancelPromotion, performPostPromotionCleanup };
}

export default usePromotionLogic;