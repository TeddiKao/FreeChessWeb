import { useRef, useState } from "react";
import { BoardPlacement, ParsedFENString } from "../../types/gameLogic";
import { ChessboardSquareIndex } from "../../types/general";

function usePromotionLogic() {
    const boardStateBeforePromotion = useRef<BoardPlacement | null>(null);
	const prePromotionBoardState = useRef<ParsedFENString | null>(null);

	const promotionSquareRef = useRef<ChessboardSquareIndex | null>(null);
	const originalPawnSquareRef = useRef<ChessboardSquareIndex | null>(null);

	const [shouldShowPromotionPopup, setShouldShowPromotionPopup] =
		useState(false);
}

export default usePromotionLogic;