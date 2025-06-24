import { useEffect, useState } from "react";
import { PieceColor } from "../../../../types/gameLogic";
import { fetchSideToMove } from "../../../../utils/apiUtils";

function useSideToMove(gameId: number) {
	const [sideToMove, setSideToMove] = useState<PieceColor>("white");

	useEffect(() => {
		updateSideToMove();
	}, [gameId]);

	async function updateSideToMove() {
		const sideToMove = await fetchSideToMove(gameId);

		setSideToMove(sideToMove);
	}

	return { sideToMove, setSideToMove };
}

export default useSideToMove;
