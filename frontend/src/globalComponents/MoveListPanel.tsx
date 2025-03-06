import "../styles/features/gameplay/move-list-panel.css";

type MoveListPanelProps = {
    moveList: Array<Array<string>>;
};

function MoveListPanel({ moveList }: MoveListPanelProps) {
    function generateMovePairMoves(movePair: Array<string>) {
        return movePair.map((notatedMove: string, _) => {
            return <p className="notated-move">{notatedMove}</p>;
        });
    }

    return (
        <div className="move-list-panel-container">
            {moveList.map((movePair: Array<string>, moveIndex: number) => {
                return (
                    <div className="move-info-container">
						<p className="move-number">{moveIndex + 1}.</p>
                        <div key={moveIndex} className="move-pair-container">
                            {generateMovePairMoves(movePair)}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default MoveListPanel;
