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

		const numCapturedPieces =
			capturedPiecesList[pieceType as CapturablePiecePlural];

		const pieceTypeSingular = pieceType.slice(0, -1) as CapturablePiece;
		const pieceFileName = `/${color}${capitaliseFirstLetter(
			pieceTypeSingular
		)}.svg`;

		for (let pieceI = 0; pieceI < numCapturedPieces; pieceI++) {
			capturedMaterialElements.push(
				<img
					className="captured-piece-image"
					key={pieceI}
					src={pieceFileName}
				/>
			);
		}

		return (
			<div className={`captured-${pieceType}-container`}>
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
