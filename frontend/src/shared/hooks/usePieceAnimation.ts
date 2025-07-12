import { useState } from "react";
import { OptionalValue } from "@sharedTypes/utility.types";
import { ChessboardSquareIndex } from "@sharedTypes/chessTypes/board.types";
import {
	calculateReplayXYTransform,
	calculateXYTransform,
} from "@sharedUtils/boardUtils";
import { convertToMilliseconds } from "@sharedUtils/timeUtils";
import { pieceAnimationTime } from "@sharedConstants/pieceAnimation";
import { PieceColor } from "@sharedTypes/chessTypes/pieces.types";

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

		console.log("Animating piece!");

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

	return [
		animatingPieceSquare,
		animatingPieceStyles,
		animatePiece,
		animateMoveReplay,
	];
}

export default usePieceAnimation;
