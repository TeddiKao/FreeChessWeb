import { useEffect, useState } from "react";
import { PositionList } from "../interfaces/gameLogic";
import { fetchMoveList, fetchPositionList } from "../utils/apiUtils";
import { websocketBaseURL } from "../constants/urls";
import { getAccessToken } from "../utils/tokenUtils";
import useWebsocketWithLifecycle from "./useWebsocketWithLifecycle";
import { ChessboardSquareIndex } from "../types/general";

function useMultiplayerGameplayLogic(gameId: number) {
    const gameWebsocketUrl = `${websocketBaseURL}/ws/game-server/?token=${getAccessToken()}&gameId=${gameId}`;
    const { socketRef: gameWebsocketRef } = useWebsocketWithLifecycle({
        url: gameWebsocketUrl,
        onMessage: () => {},
        enabled: true,
    })

    const [prevClickedSquare, setPrevClickedSquare] = useState<ChessboardSquareIndex>(null);
    const [clickedSquare, setClickedSquare] = useState<ChessboardSquareIndex>(null);

    const [draggedSquare, setDraggedSquare] = useState<ChessboardSquareIndex>(null);
    const [droppedSquare, setDroppedSquare] = useState<ChessboardSquareIndex>(null);

    const [positionList, setPositionList] = useState<PositionList>([]);
    const [positionIndex, setPositionIndex] = useState(0);

    const [moveList, setMoveList] = useState<Array<Array<string>>>([]);

    const parsedFEN = positionList[positionIndex]?.["position"];
    const previousDraggedSquare = positionList[positionIndex]?.["last_dragged_square"];
    const previousDroppedSquare = positionList[positionIndex]?.["last_dropped_square"];

    const moveType = positionList[positionIndex]?.["move_type"];

    const capturedMaterial = positionList[positionIndex]?.["captured_material"]
    const promotedPieces = positionList[positionIndex]?.["promoted_pieces"];

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

    return {
        prevClickedSquare,
        clickedSquare,
        setPrevClickedSquare,
        setClickedSquare,

        draggedSquare,
        droppedSquare,
        setDraggedSquare,
        setDroppedSquare,

        parsedFEN,
        previousDraggedSquare,
        previousDroppedSquare,

        gameStateHistory: {
            positionList,
            moveList,
            positionIndex,
        },

        capturedMaterial,
        promotedPieces
    }
}

export default useMultiplayerGameplayLogic;