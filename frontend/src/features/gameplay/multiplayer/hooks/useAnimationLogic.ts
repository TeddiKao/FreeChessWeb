import { useEffect, useRef, useState } from "react";
import { animatePieceImage } from "@sharedUtils/boardUtils";
import { PieceColor } from "@sharedTypes/chessTypes/pieces.types";
import { ChessboardSquareIndex } from "@sharedTypes/chessTypes/board.types";

function useAnimationLogic(orientation: PieceColor) {
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

	useEffect(() => {
		handlePieceAnimation();
	}, [animationSquare, orientation]);

	function handlePieceAnimation() {
		if (!animationSquare) return;
		if (!animationStartingSquareRef.current) return;
		if (!animationDestinationSquareRef.current) return;
		if (!animationRef.current) return;

		const startingSquare = animationStartingSquareRef.current;
		const destinationSquare = animationDestinationSquareRef.current;

		const fallbackPostAnimationFunction = () => {};
		const postAnimationFunction = () => {
			postAnimationActionRef.current?.();
			performPostAnimationCleanup();
		};

		animatePieceImage(
			animationRef,
			startingSquare,
			destinationSquare,
			orientation,
			postAnimationActionRef.current
				? postAnimationFunction
				: fallbackPostAnimationFunction
		);
	}

	function performPostAnimationCleanup() {
		clearPostAnimationCallback();
		clearAnimationStartingSquare();
		clearAnimationDestinationSquare();
		clearAnimationRef();

		setAnimationSquare(null);
	}

	function prepareAnimationData(
		startingSquare: ChessboardSquareIndex,
		destinationSquare: ChessboardSquareIndex,
		postAnimationCallback: () => void
	) {
		updatePostAnimationCallback(postAnimationCallback);
		updateAnimationStartingSquare(startingSquare);
		updateAnimationDestinationSquare(destinationSquare);

		setAnimationSquare(startingSquare);
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

	return { animationRef, prepareAnimationData, animationSquare };
}

export default useAnimationLogic;
