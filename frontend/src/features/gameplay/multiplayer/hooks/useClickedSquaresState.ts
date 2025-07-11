import { useEffect, useState } from "react";
import { ChessboardSquareIndex } from "@sharedTypes/chessTypes/board.types";

function useClickedSquaresState() {
	const [prevClickedSquare, setPrevClickedSquare] =
		useState<ChessboardSquareIndex | null>(null);
	const [clickedSquare, setClickedSquare] =
		useState<ChessboardSquareIndex | null>(null);

	return {
		prevClickedSquare,
		setPrevClickedSquare,
		clickedSquare,
		setClickedSquare,
	};
}

export default useClickedSquaresState;
