import { useState } from "react";
import { ChessboardSquareIndex, OptionalValue } from "../types/general";
import { calculateXYTransform } from "../utils/boardUtils";

function usePieceAnimation() {
	const [animatingPieceSquare, setAnimatingPieceSquare] =
		useState<OptionalValue<ChessboardSquareIndex>>(null);
	const [animatingPieceStyles, setAnimatingPieceStyles] = useState({});

	function animatePiece(
		startingSquare: ChessboardSquareIndex,
		destinationSquare: ChessboardSquareIndex,
        squareSize?: number
	) {
		const [xTransform, yTransform] = calculateXYTransform(
			startingSquare,
			destinationSquare,
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
		}, 300)
	}

    return [animatingPieceSquare, animatingPieceStyles, animatePiece];
}

export default usePieceAnimation;
