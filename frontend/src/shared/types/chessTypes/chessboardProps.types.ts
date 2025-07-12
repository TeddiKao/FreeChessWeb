import { ParsedFEN } from "@sharedTypes/chessTypes/gameState.types";
interface BaseChessboardProps {
	parsed_fen_string: ParsedFEN;
	orientation: string;
	squareSize?: number;
}

export type { BaseChessboardProps }