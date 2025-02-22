import { PieceColor, PieceType } from "../../enums/pieces.js";
import { fetchMoveIsValid } from "../apiUtils.ts";
import { getFile, getRank } from "../boardUtils.ts";

function clearUnpromotedPawn(boardPlacement: object, previousDroppedSquare: string | number) {
    const updatedBoardPlacement = structuredClone(boardPlacement);

    delete updatedBoardPlacement[`${previousDroppedSquare}`];

    return updatedBoardPlacement;
}


function restoreCapturedPiece(
    boardPlacement: object,
    capturedPieceInfo: object,
    capturedPieceLocation: string | number
): object {
    const updatedBoardPlacement: object = structuredClone(boardPlacement);
    updatedBoardPlacement[`${capturedPieceLocation}`] = capturedPieceInfo;

    return updatedBoardPlacement;
}

function cancelPromotion(
    fenString: object,
    color: string,
    previousDraggedSquare: string | number,
    previousDroppedSquare: string | number,
    promotionCapturedPiece: object
): object {
    const updatedFENString = structuredClone(fenString);
    let updatedBoardPlacement = structuredClone(
        updatedFENString["board_placement"]
    );

    // Removes the pawn from the promotion square
    updatedBoardPlacement = clearUnpromotedPawn(
        updatedBoardPlacement,
        previousDroppedSquare
    );

    updatedBoardPlacement[`${previousDraggedSquare}`] = {
        piece_type: "Pawn",
        piece_color: color,
    };

    if (promotionCapturedPiece) {
        updatedBoardPlacement = restoreCapturedPiece(
            updatedBoardPlacement,
            promotionCapturedPiece,
            previousDroppedSquare
        );
    }

    updatedFENString["board_placement"] = updatedBoardPlacement;
    return updatedFENString;
}

function getPromotionRank(color: string): number {
    color = color.toLowerCase();

    const isWhite: boolean = color === PieceColor.WHITE;
    const promotionRank: number = isWhite ? 7 : 0;

    return promotionRank;
}

function isCapture(startFile: number, endFile: number): boolean {
    return Math.abs(startFile - endFile) === 1;
}

function isPawnPromotion(color: string, destinationRank: number): boolean {
    return destinationRank === getPromotionRank(color);
}

function handlePromotionCaptureStorage(
    fenString: object,
    pieceColor: string,
    startingSquare: string | number,
    destinationSquare: string | number,
    setPromotionCapturedPiece: any,
    selectingPromotionRef: any,
    unpromotedBoardPlacementRef: any,
	handlePawnPromotion: any,
	gameplaySettings: object
): void {
	const autoQueen: boolean = gameplaySettings["auto_queen"]

    const updatedFENString: object = structuredClone(fenString);
    const updatedBoardPlacement: object = structuredClone(
        updatedFENString["board_placement"]
    );

    const startFile: number = getFile(startingSquare);
    const destinationFile: number = getFile(destinationSquare);
    const destinationRank: number = getRank(destinationSquare);

    if (!isPawnPromotion(pieceColor, destinationRank)) {
        return;
    }

    selectingPromotionRef.current = true;
    unpromotedBoardPlacementRef.current = updatedFENString;

    if (!isCapture(startFile, destinationFile)) {
		if (autoQueen) {
			handlePawnPromotion(pieceColor, "Queen", true);
		}

		return;
    }

	if (autoQueen) {
		handlePawnPromotion(pieceColor, "Queen", true);
		return;
	}

    const capturedPieceInfo = updatedBoardPlacement[`${destinationSquare}`];
    setPromotionCapturedPiece(capturedPieceInfo);
}

async function updatePromotedBoardPlacment(
    fenString: object,
    color: string,
    promotedPiece: string,
    autoQueen: boolean,
    originalPawnSquare: string | number,
    promotionSquare: string | number,
    unpromotedBoardPlacementRef: any
): Promise<object> {
    autoQueen = autoQueen || false;

    const updatedFENString = structuredClone(fenString);
    const updatedBoardPlacement = structuredClone(
        updatedFENString["board_placement"]
    );

    const [isMoveValid, moveType] = await fetchMoveIsValid(
        unpromotedBoardPlacementRef.current,
        color,
        PieceType.PAWN,
        originalPawnSquare,
        promotionSquare,
        {
            promoted_piece: promotedPiece,
        }
    );

	console.log(`Move valid: ${isMoveValid}`)

    if (!isMoveValid) {
        return updatedFENString;
    }

    updatedBoardPlacement[`${promotionSquare}`] = {
        piece_type: promotedPiece,
        piece_color: color,
    };

	if (autoQueen) {
		delete updatedBoardPlacement[`${originalPawnSquare}`]
	}

	updatedFENString["board_placement"] = updatedBoardPlacement;
	console.log(updatedFENString, moveType)

	return [updatedFENString, moveType];
}

export {
    cancelPromotion,
    handlePromotionCaptureStorage,
    updatePromotedBoardPlacment,
};
