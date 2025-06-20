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

    function performPostAnimationCleanup() {
		clearPostAnimationCallback();
		clearAnimationStartingSquare();
		clearAnimationDestinationSquare();
		clearAnimationRef();

		setAnimationSquare(null);
	}


    function updateAnimationStartingSquare(square: ChessboardSquareIndex) {
		animationStartingSquareRef.current = square;
	}

	function updateAnimationDestinationSquare(square: ChessboardSquareIndex) {
		animationDestinationSquareRef.current = square;
	}

	function updatePostAnimationCallback(callbackFn: () => void) {
		postAnimationActionRef.current = callbackFn;
	}

	function clearPostAnimationCallback() {
		postAnimationActionRef.current = null;
	}

	function clearAnimationStartingSquare() {
		animationStartingSquareRef.current = null;
	}

	function clearAnimationDestinationSquare() {
		animationDestinationSquareRef.current = null;
	}

	function clearAnimationRef() {
		animationRef.current = null;
	}
}

export default useAnimationLogic;