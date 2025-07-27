import { ParsedFEN } from "@/shared/types/chessTypes/gameState.types";
import { useState } from "react";

function usePassAndPlayFen() {
    const [parsedFEN, setParsedFEN] = useState<ParsedFEN | null>(null);

    return { parsedFEN, setParsedFEN };
}

export default usePassAndPlayFen;
