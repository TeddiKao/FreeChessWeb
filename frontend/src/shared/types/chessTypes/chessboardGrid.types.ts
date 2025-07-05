interface EmptySquareRenderParams {
    row: number;
	column: number;
	squareColor: string;
    squareIndex: number;
}

interface FilledSquareRenderParams extends EmptySquareRenderParams {
	pieceType: string;
	pieceColor: string;
	pieceRank: number;
	promotionRank: number;
}


export type { EmptySquareRenderParams, FilledSquareRenderParams }