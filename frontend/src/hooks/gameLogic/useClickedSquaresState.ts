import { useEffect, useState } from "react";
import { ChessboardSquareIndex } from "../../types/general";

function useClickedSquaresState(onClickCallback: () => void) {
	const [prevClickedSquare, setPrevClickedSquare] =
		useState<ChessboardSquareIndex | null>(null);
	const [clickedSquare, setClickedSquare] =
		useState<ChessboardSquareIndex | null>(null);

	useEffect(() => {
		onClickCallback();
	}, [prevClickedSquare, clickedSquare, onClickCallback]);

	return {
		prevClickedSquare,
		setPrevClickedSquare,
		clickedSquare,
		setClickedSquare,
	};
}

export default useClickedSquaresState;
