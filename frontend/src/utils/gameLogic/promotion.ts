import { BoardPlacement, MoveInfo, ParsedFEN } from "../../features/gameplay/common/types/gameState.types.ts";
import { PieceColor, PieceInfo, PieceType } from "../../features/gameplay/common/types/pieces.types.ts";
import {
	ChessboardSquareIndex,
	OptionalValue,
	RefObject,
	StateSetterFunction,
} from "../../types/general.ts";
import { fetchMoveIsValid } from "../apiUtils.ts";
import { getFile, getRank } from "../boardUtils.ts";
import { isPawnCapture, isPawnPromotion } from "../moveUtils.ts";

function clearUnpromotedPawn(
	boardPlacement: BoardPlacement,
	previousDroppedSquare: ChessboardSquareIndex
) {
	const updatedBoardPlacement: BoardPlacement =
		structuredClone(boardPlacement);

	delete updatedBoardPlacement[`${previousDroppedSquare}`];

	return updatedBoardPlacement;
}

function restoreCapturedPiece(
	boardPlacement: BoardPlacement,
	capturedPieceInfo: PieceInfo,
	capturedPieceLocation: ChessboardSquareIndex
): BoardPlacement {
	const updatedBoardPlacement: BoardPlacement =
		structuredClone(boardPlacement);
	updatedBoardPlacement[`${capturedPieceLocation}`] = capturedPieceInfo;

	return updatedBoardPlacement;
}

function cancelPromotion(
	fenString: ParsedFEN,
	color: PieceColor,
	previousDraggedSquare: ChessboardSquareIndex,
	previousDroppedSquare: ChessboardSquareIndex,
	promotionCapturedPiece?: PieceInfo
): ParsedFEN {
	const updatedFENString: ParsedFEN = structuredClone(fenString);
	let updatedBoardPlacement = structuredClone(
		updatedFENString["board_placement"]
	);

	// Removes the pawn from the promotion square
	updatedBoardPlacement = clearUnpromotedPawn(
		updatedBoardPlacement,
		previousDroppedSquare
	);

	updatedBoardPlacement[`${previousDraggedSquare}`] = {
		piece_type: "pawn",
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

function getPromotionRank(color: PieceColor): number {
	color = color.toLowerCase() as PieceColor;

	const isWhite: boolean = color === "white";
	const promotionRank: number = isWhite ? 7 : 0;

	return promotionRank;
}

function preparePawnPromotion(
	structuredFEN: ParsedFEN,
	moveInfo: MoveInfo
) {
	const updatedStructuredFEN: ParsedFEN =
		structuredClone(structuredFEN);

	const startingSquare = moveInfo["starting_square"];
	const promotionSquare = moveInfo["destination_square"];

	delete updatedStructuredFEN["board_placement"][`${startingSquare}`];

	updatedStructuredFEN["board_placement"][`${promotionSquare}`] = {
		piece_type: moveInfo["piece_type"],
		piece_color: moveInfo["piece_color"],
		starting_square: moveInfo["initial_square"],
	};

	return updatedStructuredFEN;
}

function handlePromotionCaptureStorage(
	fenString: ParsedFEN,
	pieceColor: PieceColor,
	startingSquare: ChessboardSquareIndex,
	destinationSquare: ChessboardSquareIndex,
	setPromotionCapturedPiece: StateSetterFunction<OptionalValue<PieceInfo>>,
	selectingPromotionRef: RefObject<boolean>,
	unpromotedBoardPlacementRef: RefObject<OptionalValue<ParsedFEN>>,
	handlePawnPromotion: (
		color: PieceColor,
		promotedPiece: PieceType,
		moveMethod: string,
		autoQueen?: boolean
	) => Promise<void>,

	gameplaySettings: any,
	moveMethod: string
): void {
	const autoQueen: boolean = gameplaySettings["auto_queen"];

	const updatedFENString: ParsedFEN = structuredClone(fenString);
	const updatedBoardPlacement: BoardPlacement = structuredClone(
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

	if (!isPawnCapture(startFile, destinationFile)) {
		if (autoQueen) {
			handlePawnPromotion(pieceColor, "queen", moveMethod, true);
		}

		return;
	}

	if (autoQueen) {
		handlePawnPromotion(pieceColor, "queen", moveMethod, true);
		return;
	}

	const capturedPieceInfo = updatedBoardPlacement[`${destinationSquare}`];
	setPromotionCapturedPiece(capturedPieceInfo);
}

async function updatePromotedBoardPlacment(
	fenString: ParsedFEN,
	color: string,
	promotedPiece: string,
	autoQueen: boolean,
	originalPawnSquare: string | number,
	promotionSquare: string | number,
	unpromotedBoardPlacementRef: RefObject<OptionalValue<ParsedFEN>>
): Promise<object> {
	if (!unpromotedBoardPlacementRef.current) {
		return fenString;
	}

	autoQueen = autoQueen || false;

	const updatedFENString: any = structuredClone(fenString);
	const updatedBoardPlacement: any = structuredClone(
		updatedFENString["board_placement"]
	);

	const [isMoveValid, moveType] = await fetchMoveIsValid(
		unpromotedBoardPlacementRef.current,
		color,
		"pawn",
		originalPawnSquare,
		promotionSquare,
		{
			promoted_piece: promotedPiece,
		}
	);

	if (!isMoveValid) {
		return updatedFENString;
	}

	updatedBoardPlacement[`${promotionSquare}`] = {
		piece_type: promotedPiece,
		piece_color: color,
	};

	if (autoQueen) {
		delete updatedBoardPlacement[`${originalPawnSquare}`];
	}

	updatedFENString["board_placement"] = updatedBoardPlacement;

	return [updatedFENString, moveType];
}

export {
	cancelPromotion,
	handlePromotionCaptureStorage,
	updatePromotedBoardPlacment,
	getPromotionRank,
	preparePawnPromotion,
};
