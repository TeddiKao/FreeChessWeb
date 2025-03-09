import "../styles/features/gameplay/side-panel-buttons.scss"

type GameplaySidePanelButtonsProps = {
    backToStart: (...args: any[]) => any;
    handlePreviousMove: (...args: any[]) => any;
    handleNextMove: (...args: any[]) => any;
    backToCurrentPosition: (...args: any[]) => any;
};

function GameplaySidePanelButtons({
    backToStart,
    handlePreviousMove,
    handleNextMove,
    backToCurrentPosition,
}: GameplaySidePanelButtonsProps) {
    return (
        <div className="gameplay-side-panel-buttons-container">
            <button onClick={backToStart} className="back-to-start-position">
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
    );
}

export default GameplaySidePanelButtons;
