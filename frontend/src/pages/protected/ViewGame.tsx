import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchMoveList, fetchPositionList } from "../../utils/apiUtils";
import { ParsedFENString } from "../../types/gameLogic";

function ViewGame() {
    const { gameId } = useParams();

    const [positionList, setPositionList] = useState([]);
    const [positionIndex, setPositionIndex] = useState(0);
    const [moveList, setMoveList] = useState([]);
    const parsedFEN: ParsedFENString = positionList[positionIndex]?.["position"];

    useEffect(() => {
        updatePositionList();
        updateMoveList();
    }, []);

    async function updatePositionList() {
        const fetchedPositionList = await fetchPositionList(Number(gameId));
        setPositionList(fetchedPositionList);
    }

    async function updateMoveList() {
        const fetchedMoveList = await fetchMoveList(Number(gameId));
        setMoveList(fetchedMoveList);
    }


    return (
        <div className="view-game-interface-container">
            
        </div>
    )
}

export default ViewGame;