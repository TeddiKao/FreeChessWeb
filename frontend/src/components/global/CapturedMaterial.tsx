import {
	CapturedPiecesList,
	PromotedPiecesList,
} from "../../interfaces/materialCalculation";
import { CapturablePiecePlural, PieceColor } from "../../types/gameLogic";
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
	function generateCapturedMaterial(pieceType: string) {
		const capturedMaterialElements = [];

		for (const piece in capturedPiecesList) {
			const numCapturedPieces =
				capturedPiecesList[piece as CapturablePiecePlural];

			const pieceFileName = `/${color}${capitaliseFirstLetter(
				pieceType
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
				return generateCapturedMaterial(capturedPiece);
			})}
		</div>
	);
}

export default CapturedMaterial;
