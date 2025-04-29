import { PieceColor } from "../types/gameLogic";
import { getPromotionRank } from "./gameLogic/promotion";

function isPawnPromotion(color: PieceColor, destinationRank: number): boolean {
    return destinationRank === getPromotionRank(color);
}

function isPawnCapture(startFile: number, endFile: number): boolean {
    return Math.abs(startFile - endFile) === 1;
}

export { isPawnPromotion, isPawnCapture }
