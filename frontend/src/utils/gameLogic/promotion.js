import { PieceColor, PieceType } from "../../enums/pieces";
import { fetchMoveIsValid } from "../apiUtils.ts";
import { getFile, getRank } from "../boardUtils.ts";
import api from "../../api.js";

function clearUnpromotedPawn(boardPlacement, previousDroppedSquare) {
    const updatedBoardPlacement = structuredClone(boardPlacement);

    delete updatedBoardPlacement[`${previousDroppedSquare}`];

    return updatedBoardPlacement;
}


function restoreCapturedPiece(
    boardPlacement,
    capturedPieceInfo,
    capturedPieceLocation
) {
    const updatedBoardPlacement = structuredClone(boardPlacement);
    updatedBoardPlacement[`${capturedPieceLocation}`] = capturedPieceInfo;

    return updatedBoardPlacement;
}

function cancelPromotion(
    fenString,
    color,
    previousDraggedSquare,
    previousDroppedSquare,
    promotionCapturedPiece
) {
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

function getPromotionRank(color) {
    color = color.toLowerCase();

    const isWhite = color === PieceColor.WHITE;
    const promotionRank = isWhite ? 7 : 0;

    return promotionRank;
}

function isCapture(startFile, endFile) {
    return Math.abs(startFile - endFile) === 1;
}

function isPawnPromotion(color, destinationRank) {
    return destinationRank === getPromotionRank(color);
}

function handlePromotionCaptureStorage(
    fenString,
    pieceColor,
    startingSquare,
    destinationSquare,
    setPromotionCapturedPiece,
    selectingPromotionRef,
    unpromotedBoardPlacementRef,
	handlePawnPromotion,
	gameplaySettings
) {
	const autoQueen = gameplaySettings["auto_queen"]

    const updatedFENString = structuredClone(fenString);
    const updatedBoardPlacement = structuredClone(
        updatedFENString["board_placement"]
    );

    const startFile = getFile(startingSquare);
    const destinationFile = getFile(destinationSquare);
    const destinationRank = getRank(destinationSquare);

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
    fenString,
    color,
    promotedPiece,
    autoQueen,
    originalPawnSquare,
    promotionSquare,
    unpromotedBoardPlacementRef
) {
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
