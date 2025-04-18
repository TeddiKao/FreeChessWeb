import "../../styles/features/gameplay/side-panel-buttons.scss";

type MoveNavigationButtonsProps = {
    backToStart: (...args: any[]) => any;
    handlePreviousMove: (...args: any[]) => any;
    handleNextMove: (...args: any[]) => any;
    backToCurrentPosition: (...args: any[]) => any;
};

function MoveNavigationButtons({
    backToStart,
    handlePreviousMove,
    handleNextMove,
    backToCurrentPosition,
}: MoveNavigationButtonsProps) {
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
