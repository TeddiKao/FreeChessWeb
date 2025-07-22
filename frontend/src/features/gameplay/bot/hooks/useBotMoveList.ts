import { MoveList } from "@shared/types/chessTypes/gameState.types";
import { useEffect, useState } from "react";
import { fetchBotGameMoveList } from "../botGameApiService";

function useBotMoveList(gameId: number) {
    const [moveList, setMoveList] = useState<MoveList>([]);

    useEffect(() => {
        updateMoveList();
    }, [gameId]);

    async function updateMoveList() {
        const moveList = await fetchBotGameMoveList(gameId);

        setMoveList(moveList);
    }

    return { moveList, setMoveList };
}

export default useBotMoveList;