import ChessboardGrid from "@sharedComponents/chessboard/ChessboardGrid";
import { FilledSquareRenderParams, EmptySquareRenderParams } from "@sharedTypes/chessTypes/chessboardGrid.types";
import { BaseChessboardProps } from "@sharedTypes/chessTypes/chessboardProps.types";

interface DisplayChessboardProps extends BaseChessboardProps {}

function DisplayChessboard({
	parsed_fen_string,
	orientation,
}: DisplayChessboardProps) {
	if (!parsed_fen_string) {
		return null;
	}

	function renderFilledSquare({
		squareIndex,
		pieceType,
		pieceColor,
		squareColor,
	}: FilledSquareRenderParams) {
		return (
			<div
				key={squareIndex}
				id={`${squareIndex}`}
				className={`chessboard-square ${squareColor}`}
			>
				<img
					src={`/icons/chessPieces/regular/${pieceColor.toLowerCase()}${pieceType}.svg`}
					className="piece-image"
				/>
			</div>
		);
	}

	function renderEmptySquare({
		squareIndex,
		squareColor,
	}: EmptySquareRenderParams) {
		return (
			<div
				key={squareIndex}
				id={`${squareIndex}`}
				className={`chessboard-square ${squareColor}`}
			></div>
		);
	}

	return (
		<ChessboardGrid
			renderFilledSquare={renderFilledSquare}
			renderEmptySquare={renderEmptySquare}
			boardOrientation={orientation}
			boardPlacement={parsed_fen_string["board_placement"]}
		/>
	);
}

export default DisplayChessboard;
