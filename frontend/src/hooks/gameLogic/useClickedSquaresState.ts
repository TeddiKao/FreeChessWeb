import { useState } from "react";
import { ChessboardSquareIndex } from "../../types/general";

function useClickedSquaresState() {
    const [prevClickedSquare, setPrevClickedSquare] =
		useState<ChessboardSquareIndex | null>(null);
	const [clickedSquare, setClickedSquare] =
		useState<ChessboardSquareIndex | null>(null);

    
}

export default useClickedSquaresState;