import { GameReplayChessboardProps } from "../../../interfaces/chessboard";
import {
	EmptySquareRenderParams,
	FilledSquareRenderParams,
} from "../../../interfaces/chessboardGrid";
import { getSquareClass } from "../../../shared/utils/boardUtils";
import { capitaliseFirstLetter } from "../../../shared/utils/generalUtils";
import ChessboardGrid from "../../../shared/components/chessboard/ChessboardGrid";

function GameReplayChessboard({
	parsed_fen_string,
	lastDraggedSquare,
	lastDroppedSquare,
	orientation,
	animationSquare,
	animationStyles,
}: GameReplayChessboardProps) {
	console.log(animationStyles);

	if (!parsed_fen_string) {
		return null;
	}

	function renderFilledSquare({
		squareIndex,
		pieceColor,
		pieceType,
	}: FilledSquareRenderParams) {
		return (
			<div
				key={`${squareIndex}`}
				id={`${squareIndex}`}
				className={getSquareClass(
					`${squareIndex}`,
					lastDraggedSquare,
					lastDroppedSquare
				)}
			>
				<img
					style={
						Number(animationSquare) === Number(squareIndex)
							? animationStyles
							: undefined
					}
					src={`/icons/chessPieces/regular/${pieceColor.toLowerCase()}${capitaliseFirstLetter(
						pieceType
					)}.svg`}
					className="piece-image"
				/>
			</div>
		);
	}

	function renderEmptySquare({ squareIndex }: EmptySquareRenderParams) {
		return (
			<div
				key={`${squareIndex}`}
				id={`${squareIndex}`}
				className={getSquareClass(
					`${squareIndex}`,
					lastDraggedSquare,
					lastDroppedSquare
				)}
			></div>
		);
	}

	return (
		<ChessboardGrid
			renderEmptySquare={renderEmptySquare}
			renderFilledSquare={renderFilledSquare}
			boardOrientation={orientation}
			boardPlacement={parsed_fen_string["board_placement"]}
		/>
	);
}

export default GameReplayChessboard;
