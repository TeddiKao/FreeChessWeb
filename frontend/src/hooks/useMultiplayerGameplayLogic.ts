import { useEffect, useState } from "react";
import { ParsedFENString } from "../types/gameLogic";
import { PositionList } from "../interfaces/gameLogic";
import { fetchMoveList, fetchPositionList } from "../utils/apiUtils";

function useMultiplayerGameplayLogic(gameId: number) {
    const [positionList, setPositionList] = useState<PositionList>([]);
    const [positionIndex, setPositionIndex] = useState(0);

    const [moveList, setMoveList] = useState<Array<Array<string>>>([]);

    useEffect(() => {
        updatePositionList();
        updateMoveList();
    }, []);

    async function updatePositionList() {
        const positionList = await fetchPositionList(gameId);

        setPositionList(positionList);
    }

    async function updateMoveList() {
        const moveList = await fetchMoveList(gameId);

        setMoveList(moveList);
    }
}

export default useMultiplayerGameplayLogic;