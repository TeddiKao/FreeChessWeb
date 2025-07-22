import { useEffect, useState } from "react";
import { PositionList } from "@shared/types/chessTypes/gameState.types";
import { fetchBotGamePositionList } from "../botGameApiService";

function useBotPositionList(gameId: number) {
    const [positionList, setPositionList] = useState<PositionList>([]);
    const [positionIndex, setPositionIndex] = useState<number>(0);

    const parsedFEN = positionList[positionIndex]?.["position"];
    const previousDraggedSquare =
        positionList[positionIndex]?.["last_dragged_square"];
    const previousDroppedSquare =
        positionList[positionIndex]?.["last_dropped_square"];

    useEffect(() => {
        updatePositionList();
    }, [gameId]);

    async function updatePositionList() {
        const positionList = await fetchBotGamePositionList(gameId);

        setPositionList(positionList);
        setPositionIndex(positionList.length - 1);
    }

    return {
        positionList,
        setPositionList,
        positionIndex,
        setPositionIndex,
        parsedFEN,
        previousDraggedSquare,
        previousDroppedSquare,
    };
}

export default useBotPositionList;
