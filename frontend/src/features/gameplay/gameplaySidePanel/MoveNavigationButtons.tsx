import { useEffect } from "react";
import "../../../styles/features/gameplay/side-panel-buttons.scss";
import {
	ChessboardSquareIndex,
	OptionalValue,
	RefObject,
	StateSetterFunction,
} from "../../../types/general";
import { ArrowKeys } from "../../../enums/general";
import { PositionList } from "../../../interfaces/gameLogic";
import useAnimationLogic from "../../../hooks/gameLogic/useAnimationLogic";
import { PieceColor } from "../../../types/gameLogic";

type MoveNavigationButtonsProps = {
	setPositionIndex: StateSetterFunction<number>;
	previousPositionIndexRef: RefObject<OptionalValue<number>>;
	positionListLength: number;

	positionList?: PositionList;
	positionIndex?: number;

	orientation: PieceColor;
}

function MoveNavigationButtons({
	setPositionIndex,
	positionListLength,
	previousPositionIndexRef,

	positionList,
	positionIndex,

	orientation
}: MoveNavigationButtonsProps) {
	const { prepareAnimationData } = useAnimationLogic(orientation)

	function handleKeyDown(event: KeyboardEvent) {
		switch (event.key) {
			case ArrowKeys.ARROW_LEFT:
				handlePreviousMove();
				break;

			case ArrowKeys.ARROW_RIGHT:
				handleNextMove();
				break;

			case ArrowKeys.ARROW_DOWN:
				backToCurrentPosition();
				break;

			case ArrowKeys.ARROW_UP:
				backToStart();
				break;

			default:
				break;
		}
	}

	useEffect(() => {
		document.addEventListener("keydown", handleKeyDown);

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [positionListLength, positionList, positionIndex]);

	function backToStart() {
		setPositionIndex((prevIndex) => {
			previousPositionIndexRef.current = prevIndex;

			return 0;
		});
	}

	function handlePreviousMove() {
		if (!positionList || !positionIndex) {
			setPositionIndex((prevIndex) => {
				previousPositionIndexRef.current = prevIndex;

				return prevIndex > 0 ? prevIndex - 1 : prevIndex;
			});

			return;
		}

		const postAnimationCallback = () => {
			setPositionIndex((prevIndex) => {
				previousPositionIndexRef.current = prevIndex;

				return prevIndex > 0 ? prevIndex - 1 : prevIndex;
			});
		};

		const targetPosition = positionList?.[positionIndex];
		const startingSquare = targetPosition["move_info"]["starting_square"];
		const destinationSquare =
			targetPosition["move_info"]["destination_square"];

		prepareAnimationData(startingSquare, destinationSquare, postAnimationCallback);
	}

	function handleNextMove() {
		if (!positionList || !positionIndex) {
			setPositionIndex((prevIndex) => {
				previousPositionIndexRef.current = prevIndex;

				return prevIndex + 1 < positionListLength
					? prevIndex + 1
					: prevIndex;
			});

			return;
		}

		const postAnimationCallback = () => {
			setPositionIndex((prevIndex) => {
				previousPositionIndexRef.current = prevIndex;

				return prevIndex + 1 < positionListLength
					? prevIndex + 1
					: prevIndex;
			});
		};

		const targetPosition = positionList?.[positionIndex + 1];
		const startingSquare = targetPosition["move_info"]["starting_square"];
		const destinationSquare =
			targetPosition["move_info"]["destination_square"];

		prepareAnimationData(startingSquare, destinationSquare, postAnimationCallback);
	}

	function backToCurrentPosition() {
		setPositionIndex((prevIndex) => {
			previousPositionIndexRef.current = prevIndex;

			return positionListLength - 1;
		});
	}

	return (
		<div className="move-navigation-container">
			<h4 className="move-navigation-header">Move navigation</h4>
			<div className="move-navigation-buttons-container">
				<button
					onClick={backToStart}
					className="back-to-start-position"
				>
					{"|<"}
				</button>
				<button
					onClick={handlePreviousMove}
					className="previous-move-button"
				>
					{"<"}
				</button>
				<button onClick={handleNextMove} className="next-move-button">
					{">"}
				</button>
				<button
					onClick={backToCurrentPosition}
					className="current-position-button"
				>
					{">|"}
				</button>
			</div>
		</div>
	);
}

export default MoveNavigationButtons;
