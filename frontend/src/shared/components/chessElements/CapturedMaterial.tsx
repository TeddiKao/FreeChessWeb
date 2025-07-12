import { capitaliseFirstLetter } from "@sharedUtils/generalUtils";

import "@sharedStyles/chessElements/captured-material.scss";
import { pluralToSingularPieceMap } from "@sharedConstants/pieceMappings";
import { CapturedPiecesList, PromotedPiecesList } from "@sharedTypes/chessTypes/gameState.types";
import { PieceColor, CapturablePiecePlural } from "@sharedTypes/chessTypes/pieces.types";

type CapturedMaterialProps = {
	capturedPiecesList: CapturedPiecesList;
	promotedPiecesList: PromotedPiecesList;
	color: PieceColor;
};

function CapturedMaterial({
	capturedPiecesList,
	promotedPiecesList,
	color,
}: CapturedMaterialProps) {
	function generateCapturedMaterial(pieceType: string, pieceAmount: number) {
		const capturedMaterialElements = [];

		const pieceTypeSingular = pluralToSingularPieceMap[pieceType];
		const pieceFileName = `/icons/chessPieces/regular/${color}${capitaliseFirstLetter(
			pieceTypeSingular
		)}.svg`;

		for (let pieceIndex = 0; pieceIndex < pieceAmount; pieceIndex++) {
			const isFirstPiece = pieceIndex === 0;
			capturedMaterialElements.push(
				<img
					className={
						isFirstPiece
							? "first-captured-piece-image"
							: "captured-piece-image"
					}
					key={pieceIndex}
					src={pieceFileName}
				/>
			);
		}

		return (
			<div className="captured-material-container">
				{capturedMaterialElements}
			</div>
		);
	}

	return (
		<div className="captured-material-container">
			{Object.keys(capturedPiecesList).map((capturedPiece, _) => {
				return generateCapturedMaterial(
					capturedPiece,
					capturedPiecesList[capturedPiece as CapturablePiecePlural]
				);
			})}
		</div>
	);
}

export default CapturedMaterial;
