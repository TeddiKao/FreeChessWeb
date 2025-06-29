import { PieceColor } from "../features/gameplay/multiplayer/gameLogic.types";
import { getPromotionRank } from "../features/gameplay/passAndPlay/utils/promotion";

function isPawnPromotion(color: PieceColor, destinationRank: number): boolean {
	return destinationRank === getPromotionRank(color);
}

function isPawnCapture(startFile: number, endFile: number): boolean {
	return Math.abs(startFile - endFile) === 1;
}

export { isPawnPromotion, isPawnCapture };
