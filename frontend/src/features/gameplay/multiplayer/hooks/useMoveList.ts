import { useEffect, useState } from "react";
import { MoveListUpdateEventData } from "@gameplay/multiplayer/types/gameEvents.types";
import { MoveList } from "@sharedTypes/chessTypes/gameState.types";
import { fetchMoveList } from "@gameplay/common/utils/gameStateFetchApi";

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
