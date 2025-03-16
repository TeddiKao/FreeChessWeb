import "../../styles/features/gameplay/move-list-panel.scss";
import { StateSetterFunction } from "../../types/general";

type MoveListPanelProps = {
    moveList: Array<Array<string>>;
    setPositionIndex: StateSetterFunction<number>
};

function MoveListPanel({ moveList, setPositionIndex }: MoveListPanelProps) {
    function navigateToMove(movePairIndex: number, moveIndex: number) {
        const positionIndex = (movePairIndex * 2) + (moveIndex + 1);
        setPositionIndex(positionIndex);
    }
    
    function generateMovePairMoves(movePair: Array<string>, movePairIndex: number) {
        return movePair.map((notatedMove: string, moveIndex) => {
            return <p onClick={() => {
                navigateToMove(movePairIndex, moveIndex)
            }} key={moveIndex} className="notated-move">{notatedMove}</p>;
        });
    }

    return (
        <div className="move-list-panel-container">
            <h4 className="move-list-header">Moves</h4>
            <div className="moves-container">
                {moveList.map((movePair: Array<string>, movePairIndex: number) => {
                    return (
                        <div className="move-info-container">
                            <p className="move-number">{movePairIndex + 1}.</p>
                            <div
                                key={movePairIndex}
                                className="move-pair-container"
                            >
                                {generateMovePairMoves(movePair, movePairIndex)}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default MoveListPanel;
