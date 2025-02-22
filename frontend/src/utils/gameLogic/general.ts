import { PieceColor } from "../../enums/pieces";

function getOppositeColor(color) {
    color = color.toLowerCase();

    if (color === PieceColor.WHITE) {
        return PieceColor.BLACK;
    } else {
        return PieceColor.WHITE;
    }
}

export { getOppositeColor };
