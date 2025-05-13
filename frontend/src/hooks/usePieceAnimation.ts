import { useState } from "react";
import { ChessboardSquareIndex, OptionalValue } from "../types/general";
import { calculateReplayXYTransform, calculateXYTransform } from "../utils/boardUtils";
import { convertToMilliseconds } from "../utils/timeUtils";
import { pieceAnimationTime } from "../constants/pieceAnimation";
import { PieceColor } from "../types/gameLogic";

function usePieceAnimation() {
	const [animatingPieceSquare, setAnimatingPieceSquare] =
		useState<OptionalValue<ChessboardSquareIndex>>(null);
	const [animatingPieceStyles, setAnimatingPieceStyles] = useState({});

	function animatePiece(
		startingSquare: ChessboardSquareIndex,
		destinationSquare: ChessboardSquareIndex,
		orientation: PieceColor,
		squareSize?: number
	) {
		const [xTransform, yTransform] = calculateXYTransform(
			startingSquare,
			destinationSquare,
			orientation,
			squareSize
		);

		setAnimatingPieceSquare(Number(startingSquare));
		setAnimatingPieceStyles({
			transform: `translate(${xTransform}px, ${yTransform}px)`,
			pointerEvents: "none",
			zIndex: "100",
		});

		setTimeout(() => {
			setAnimatingPieceSquare(null);
			setAnimatingPieceStyles({});
		}, convertToMilliseconds(pieceAnimationTime));
	}

	function animateMoveReplay(
		startingSquare: ChessboardSquareIndex,
		destinationSquare: ChessboardSquareIndex,
		orientation: PieceColor,
		squareSize?: number
	) {
		const [xTransform, yTransform] = calculateReplayXYTransform(
			startingSquare,
			destinationSquare,
			orientation,
			squareSize
		);

		setAnimatingPieceSquare(Number(destinationSquare));
		setAnimatingPieceStyles({
			transform: `translate(${xTransform}px, ${yTransform}px)`,
			pointerEvents: "none",
			zIndex: "100",
		});

		setTimeout(() => {
			setAnimatingPieceSquare(null);
			setAnimatingPieceStyles({});
		}, convertToMilliseconds(pieceAnimationTime));
	}

	return [animatingPieceSquare, animatingPieceStyles, animatePiece, animateMoveReplay];
}

export default usePieceAnimation;
