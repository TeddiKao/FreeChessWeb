import {
	CapturedPiecesList,
	PromotedPiecesList,
} from "../../interfaces/materialCalculation";
import {
	CapturablePiece,
	CapturablePiecePlural,
	PieceColor,
} from "../../types/gameLogic";
import { capitaliseFirstLetter } from "../../utils/generalUtils";

import "../../styles/components/chessboard/captured-material.scss";
import { pluralToSingularPieceMap } from "../../constants/pieceMappings";

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
		const pieceFileName = `/${color}${capitaliseFirstLetter(
			pieceTypeSingular
		)}.svg`;

		for (let pieceI = 0; pieceI < pieceAmount; pieceI++) {
			capturedMaterialElements.push(
				<img
					className={pieceI === 0 ? "first-captured-piece-image" : "captured-piece-image"}
					key={pieceI}
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
