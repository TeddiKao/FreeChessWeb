import { useEffect, useState } from "react";
import { PositionList } from "../../interfaces/gameLogic";
import { fetchPositionList } from "../../utils/apiUtils";

function usePositionList(gameId: number) {
    const [positionList, setPositionList] = useState<PositionList>([]);
    const [positionIndex, setPositionIndex] = useState(0);

    const parsedFEN = positionList[positionIndex]?.["position"];
	const previousDraggedSquare =
		positionList[positionIndex]?.["last_dragged_square"];
	const previousDroppedSquare =
		positionList[positionIndex]?.["last_dropped_square"];

	const capturedMaterial = positionList[positionIndex]?.["captured_material"];
	const promotedPieces = positionList[positionIndex]?.["promoted_pieces"];

    useEffect(() => {
        updatePositionList();
    }, [gameId]);

    async function updatePositionList() {
		const positionList = await fetchPositionList(gameId);

		setPositionList(positionList);
	}
}

export default usePositionList;