import { PieceColor } from "../../common/types/pieces.types";
import { getPromotionRank } from "./promotion";

function isPawnPromotion(color: PieceColor, destinationRank: number): boolean {
	return destinationRank === getPromotionRank(color);
}

function isPawnCapture(startFile: number, endFile: number): boolean {
	return Math.abs(startFile - endFile) === 1;
}

export { isPawnPromotion, isPawnCapture };
