import { useEffect, useState } from "react";
import { fetchMoveList } from "../../../../utils/apiUtils";
import { MoveListUpdateEventData } from "../types/gameEvents.types";
import { MoveList } from "../../common/types/gameState.types";

function useMoveList(gameId: number) {
	const [moveList, setMoveList] = useState<MoveList>([]);

	useEffect(() => {
		updateMoveList();
	}, [gameId]);

	async function updateMoveList() {
		const moveList = await fetchMoveList(gameId);

		setMoveList(moveList);
	}

	function handleMoveListUpdated(eventData: MoveListUpdateEventData) {
		setMoveList(eventData["new_move_list"]);
	}

	return { moveList, handleMoveListUpdated };
}

export default useMoveList;
