import { useEffect, useState } from "react";
import { PieceColor } from "../../common/types/pieces.types";
import { fetchSideToMove } from "../../common/utils/gameStateFetchApi";

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
