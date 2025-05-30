interface PromotedPiecesList {
    queens: number
    rooks: number
    bishops: number
    knights: number
}

interface CapturedPiecesList extends PromotedPiecesList {
    pawns: number
}

export type { PromotedPiecesList, CapturedPiecesList }