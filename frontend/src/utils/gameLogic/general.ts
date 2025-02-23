import { PieceColor } from "../../types/gameLogic";

function getOppositeColor(color: PieceColor): PieceColor {
    color = (color.toLowerCase()) as PieceColor;

    if (color === "white") {
        return "black"
    } else {
        return "white"
    }
}

export { getOppositeColor };
