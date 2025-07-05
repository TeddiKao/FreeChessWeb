import { useEffect, useState } from "react";
import { MoveListUpdateEventData } from "../types/gameEvents.types";
import { MoveList } from "../../../../shared/types/gameState.types";
import { fetchMoveList } from "../../common/utils/gameStateFetchApi";

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
