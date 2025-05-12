import { useState } from "react";
import { ChessboardSquareIndex, OptionalValue } from "../types/general";
import { calculateXYTransform } from "../utils/boardUtils";
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
        squareSize?: number,
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
		}, convertToMilliseconds(pieceAnimationTime))
	}

    return [animatingPieceSquare, animatingPieceStyles, animatePiece];
}

export default usePieceAnimation;
