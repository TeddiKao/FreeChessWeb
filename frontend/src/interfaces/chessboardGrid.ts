interface EmptySquareRenderParams {
    row: number;
	column: number;
	squareColor: string;
    squareIndex: number;
}

interface FilledSquareRenderParams extends EmptySquareRenderParams {
	pieceType: string;
	pieceColor: string;
}

export type { EmptySquareRenderParams, FilledSquareRenderParams }
