import { useRef, useState } from "react";
import { ChessboardSquareIndex } from "../../types/general";

function useAnimationLogic() {
    const animationRef = useRef<HTMLDivElement | null>(null);
	const postAnimationActionRef = useRef<(() => void) | null>(null);

	const animationStartingSquareRef = useRef<ChessboardSquareIndex | null>(
		null
	);
	const animationDestinationSquareRef = useRef<ChessboardSquareIndex | null>(
		null
	);

	const [animationSquare, setAnimationSquare] =
		useState<ChessboardSquareIndex | null>(null);
}

export default useAnimationLogic;