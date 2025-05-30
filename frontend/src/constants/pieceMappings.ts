import { CapturablePiece, CapturablePiecePlural } from "../types/gameLogic"

interface PluralToSingularPieceMap {
    [key: string]: CapturablePiece
}

interface SingularToPluralPieceMap {
    [key: string]: CapturablePiecePlural
}

const pluralToSingularPieceMap: PluralToSingularPieceMap = {
    pawns: "pawn",
    knights: "knight",
    bishops: "bishop",
    rooks: "rook",
    queens: "queen"
}

const singularToPluralPieceMap: SingularToPluralPieceMap = {
    pawn: "pawns",
    knight: "knights",
    bishop: "bishops",
    rook: "rooks",
    queen: "queens"
}

export { pluralToSingularPieceMap, singularToPluralPieceMap }