import { getSquareClass } from "@sharedUtils/boardUtils";
import { capitaliseFirstLetter } from "@sharedUtils/generalUtils";
import ChessboardGrid from "@sharedComponents/chessboard/ChessboardGrid";
import { BaseChessboardProps } from "@sharedTypes/chessTypes/chessboardProps.types";
import { ChessboardSquareIndex } from "@sharedTypes/chessTypes/board.types";
import { OptionalValue } from "@sharedTypes/utility.types";
import { EmptySquareRenderParams, FilledSquareRenderParams } from "@sharedTypes/chessTypes/chessboardGrid.types";

interface GameReplayChessboardProps extends BaseChessboardProps {
	lastDraggedSquare: string;
	lastDroppedSquare: string;

	animationSquare: OptionalValue<ChessboardSquareIndex>;
	animationStyles: Record<string, unknown>;
}

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
