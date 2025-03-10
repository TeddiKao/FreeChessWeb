import "../styles/features/gameplay/side-panel-buttons.scss";

type GameplayActionButtonsProps = {
    backToStart: (...args: any[]) => any;
    handlePreviousMove: (...args: any[]) => any;
    handleNextMove: (...args: any[]) => any;
    backToCurrentPosition: (...args: any[]) => any;
};

function GameplayActionButtons({
    backToStart,
    handlePreviousMove,
    handleNextMove,
    backToCurrentPosition,
}: GameplayActionButtonsProps) {
    return (
        <div className="gameplay-side-panel-buttons-container">
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

            <div className="offer-action-buttons">
                <img src="/resignButton.svg" className="resign-button" />
            </div>
        </div>
    );
}

export default GameplayActionButtons;
