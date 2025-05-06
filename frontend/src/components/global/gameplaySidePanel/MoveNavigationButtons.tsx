import "../../../styles/features/gameplay/side-panel-buttons.scss";
import { StateSetterFunction } from "../../../types/general";

type MoveNavigationButtonsProps = {
	setPositionIndex: StateSetterFunction<number>;
	positionListLength: number;
};

function MoveNavigationButtons({
	setPositionIndex,
    positionListLength
}: MoveNavigationButtonsProps) {
	function backToStart() {
		setPositionIndex(0);
	}

	function handlePreviousMove() {
		setPositionIndex((prevIndex) =>
			prevIndex > 0 ? prevIndex - 1 : prevIndex
		);
	}

    function handleNextMove() {
        setPositionIndex((prevIndex) => {
            return prevIndex + 1 < positionListLength ? prevIndex + 1 : prevIndex
        })
    }

    function backToCurrentPosition() {
        setPositionIndex(positionListLength - 1);
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
