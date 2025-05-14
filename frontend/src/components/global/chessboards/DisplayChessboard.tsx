import { DisplayChessboardProps } from "../../../interfaces/chessboard";
import "../../../styles/components/chessboard/chessboard.scss";
import ChessboardGrid from "./ChessboardGrid";

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
	}: any) {
		return (
			<div
				key={squareIndex}
				id={`${squareIndex}`}
				className={`chessboard-square ${squareColor}`}
			>
				<img
					src={`/${pieceColor.toLowerCase()}${pieceType}.svg`}
					className="piece-image"
				/>
			</div>
		);
	}

	function renderEmptySquare({ squareIndex, squareColor }: any) {
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
