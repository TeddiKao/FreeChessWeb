import { useEffect, useState } from "react";
import { PositionList } from "@sharedTypes/chessTypes/gameState.types";
import { PositionListUpdateEventData } from "@gameplay/multiplayer/types/gameEvents.types";
import { fetchPositionList } from "@gameplay/common/utils/gameStateFetchApi";

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
		synchronisePositionIndex();
	}, [gameId]);

	async function updatePositionList() {
		const positionList = await fetchPositionList(gameId);

		setPositionList(positionList);
	}

	async function synchronisePositionIndex() {
		const positionList = await fetchPositionList(gameId);
		setPositionIndex(positionList.length - 1);
	}

	function handlePositionListUpdated(eventData: PositionListUpdateEventData) {
		setPositionList(eventData["new_position_list"]);
	}

	return {
		positionList,
		setPositionList,
		positionIndex,
		setPositionIndex,
		parsedFEN,
		previousDraggedSquare,
		previousDroppedSquare,
		capturedMaterial,
		promotedPieces,
		handlePositionListUpdated,
	};
}

export default usePositionList;
