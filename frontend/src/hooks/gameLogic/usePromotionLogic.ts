import { useRef, useState } from "react";
import {
	ParsedFENString,
	PieceType,
} from "../../types/gameLogic";
import { ChessboardSquareIndex } from "../../types/general";
import useGameplaySettings from "../useGameplaySettings";

function usePromotionLogic(parsedFEN: ParsedFENString) {
	const prePromotionBoardState = useRef<ParsedFENString | null>(null);

	const promotionSquareRef = useRef<ChessboardSquareIndex | null>(null);
	const originalPawnSquareRef = useRef<ChessboardSquareIndex | null>(null);

	const [shouldShowPromotionPopup, setShouldShowPromotionPopup] =
		useState(false);

    const gameplaySettings = useGameplaySettings();

	function cancelPromotion() {
		performPostPromotionCleanup();
	}

	function performPostPromotionCleanup() {
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

	function clearPrePromotionBoardState() {
		prePromotionBoardState.current = null;
	}

	function clearOriginalPawnSquare() {
		originalPawnSquareRef.current = null;
	}

	function clearPromotionSquare() {
		promotionSquareRef.current = null;
	}

	function handlePawnPromotion(
		sendPromotionMove: (
			originalPawnSquare: ChessboardSquareIndex,
			promotionSquare: ChessboardSquareIndex,
			pieceType: PieceType
		) => void
	) {
		if (!parsedFEN) return;

		if (!originalPawnSquareRef.current) return;
		if (!promotionSquareRef.current) return;

		const originalPawnSquare = originalPawnSquareRef.current;
		const promotionSquare = promotionSquareRef.current;

		// @ts-ignore
		const autoQueen = gameplaySettings["auto_queen"];

		if (autoQueen) {
			sendPromotionMove(originalPawnSquare, promotionSquare, "queen");
		} else {
            console.log("Showing promotion popup!")
			setShouldShowPromotionPopup(true);
		}
	}

	return {
		preparePromotion,
		cancelPromotion,
		performPostPromotionCleanup,
		handlePawnPromotion,
        shouldShowPromotionPopup,
        promotionSquareRef,
        prePromotionBoardState,
        originalPawnSquareRef,
	};
}

export default usePromotionLogic;
