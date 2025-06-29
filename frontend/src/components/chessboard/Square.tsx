import { DragPreviewImage, useDrag, useDrop } from "react-dnd";

import "../../styles/components/chessboard/square.scss";
import PromotionPopup from "./PromotionPopup.tsx";
import React, { useEffect, useRef, useState } from "react";
import {
	getFile,
	getRank,
	isSquareLight,
	isSquareOnFileEdge,
	isSquareOnRankEdge,
} from "../../utils/boardUtils";
import { SquareProps } from "../../interfaces/chessboard.ts";
import { OptionalValue } from "../../types/general.ts";
import { capitaliseFirstLetter } from "../../utils/generalUtils.ts";
import useAnimationLogic from "../../features/gameplay/multiplayer/hooks/useAnimationLogic.ts";
import { PieceColor } from "../../features/gameplay/multiplayer/gameLogic.types.ts";

function Square({
	squareNumber,
	squareColor,
	pieceColor,
	pieceType,
	displayPromotionPopup,
	setPrevClickedSquare,
	setClickedSquare,
	setDraggedSquare,
	setDroppedSquare,
	handlePromotionCancel,
	handlePawnPromotion,
	previousDraggedSquare,
	previousDroppedSquare,
	orientation,
	squareSize,
	animatingPieceStyle,
	prevClickedSquare,
	clickedSquare,
	animationRef,
	animatingPieceSquare: animationSquare,
}: SquareProps) {
	let startingSquare: OptionalValue<string> = null;

	const [popupIsOpen, setPopupIsOpen] = useState<boolean>(
		displayPromotionPopup
	);
	const [isHighlighted, setIsHighlighted] = useState<boolean>(false);
	const verticalSideToCheck =
		orientation.toLowerCase() === "white" ? "top" : "bottom";
	const horizontalSideToCheck =
		orientation.toLowerCase() === "white" ? "left" : "right";

	const squareOnRankEdge = isSquareOnRankEdge(
		Number(squareNumber),
		horizontalSideToCheck
	);
	const squareOnFileEdge = isSquareOnFileEdge(
		Number(squareNumber),
		verticalSideToCheck
	);

	const squareStyles = {
		height: `${squareSize}px`,
	};

	function getSquareClass() {
		if (squareNumber.toString() === previousDraggedSquare?.toString()) {
			return "previous-dragged-square";
		} else if (
			squareNumber.toString() === previousDroppedSquare?.toString()
		) {
			return "previous-dropped-square";
		} else {
			return `chessboard-square ${squareColor}`;
		}
	}

	useEffect(() => {
		setPopupIsOpen(displayPromotionPopup);
	}, [displayPromotionPopup]);

	useEffect(() => {
		const highlightedClassName = isSquareLight(squareNumber)
			? "highlighted-square-light"
			: "highlighted-square-dark";

		const squareElement: HTMLElement | null = document.getElementById(
			`${squareNumber}`
		);

		if (!squareElement) {
			return;
		}

		if (isHighlighted) {
			squareElement.classList.add(highlightedClassName);
		} else {
			squareElement.classList.remove(highlightedClassName);
		}
	}, [isHighlighted]);

	const [, drag, preview] = useDrag(() => {
		return {
			type: "square",
			item: { id: squareNumber },
			collect: (monitor) => ({
				isDragging: monitor.isDragging(),
			}),
		};
	});

	const [, drop]: any = useDrop(() => ({
		accept: "square",
		drop: (item: any, _) => {
			startingSquare = item.id;

			handleOnDrop(squareNumber);
		},
	}));

	function clearAllHighlightedSquares(): void {
		for (let square = 0; square <= 63; square++) {
			const squareElement = document.getElementById(`${square}`);
			if (squareElement) {
				const highlightedClassName = isSquareLight(square)
					? "highlighted-square-light"
					: "highlighted-square-dark";

				squareElement.classList.remove(highlightedClassName);
			}
		}
	}

	function handleSquareHiglight(event: React.MouseEvent<HTMLDivElement>) {
		event.preventDefault();

		setIsHighlighted((prevHighlighted: boolean) => !prevHighlighted);
	}

	function handleOnDrop(droppedSquare: string | number) {
		if (!startingSquare) {
			return null;
		}

		setDraggedSquare(startingSquare);
		setDroppedSquare(droppedSquare);
	}

	function handleSquareClick() {
		if (!prevClickedSquare && !clickedSquare) {
			setPrevClickedSquare(squareNumber.toString());
		} else {
			setClickedSquare(squareNumber.toString());
		}
	}

	function handleOnDrag(squareDragged: string | number) {
		setDraggedSquare(squareDragged);
	}

	function generateSquareHTML() {
		if (!pieceColor || !pieceType) {
			return null;
		}

		let squareHTML = null;
		if (displayPromotionPopup) {
			squareHTML = (
				<PromotionPopup
					color={pieceColor}
					isOpen={popupIsOpen}
					onClose={() => {
						setPopupIsOpen(false);
					}}
					handlePromotionCancel={handlePromotionCancel}
					handlePawnPromotion={handlePawnPromotion}
					boardOrientation={orientation}
				/>
			);
		} else {
			const pieceImageSrc = `/icons/chessPieces/regular/${pieceColor.toLowerCase()}${capitaliseFirstLetter(
				pieceType
			)}.svg`;
			const draggingPieceImageSrc = `/icons/chessPieces/dragging/${pieceColor.toLowerCase()}${capitaliseFirstLetter(
				pieceType
			)}-dragging.svg`;

			squareHTML = (
				<>
					<DragPreviewImage
						connect={preview}
						src={draggingPieceImageSrc}
					/>
					<div
						ref={
							Number(squareNumber) === Number(animationSquare)
								? animationRef
								: undefined
						}
						className="piece-image-container"
					>
						<img
							style={
								Number(animationSquare) === Number(squareNumber)
									? animatingPieceStyle
									: undefined
							}
							ref={drag}
							onDragStart={() => {
								handleOnDrag(squareNumber);
							}}
							onTouchStart={() => {
								handleOnDrag(squareNumber);
							}}
							className="piece-image"
							src={pieceImageSrc}
						/>
					</div>
				</>
			);
		}

		return squareHTML;
	}

	function generateFileCoordinateHTML() {
		const filesList = ["a", "b", "c", "d", "e", "f", "g", "h"];

		return (
			<p className="file-coordinate">
				{filesList[getFile(squareNumber)]}
			</p>
		);
	}

	function generateRankCoordinateHTML() {
		return <p className="rank-coordinate">{getRank(squareNumber) + 1}</p>;
	}

	return (
		<div
			ref={drop}
			className={getSquareClass()}
			style={squareStyles}
			id={`${squareNumber}`}
			onClick={() => {
				handleSquareClick();
				clearAllHighlightedSquares();
			}}
			onContextMenu={handleSquareHiglight}
		>
			{squareOnRankEdge && generateRankCoordinateHTML()}
			{squareOnFileEdge && generateFileCoordinateHTML()}

			{pieceColor && pieceType && generateSquareHTML()}
		</div>
	);
}

export default Square;
