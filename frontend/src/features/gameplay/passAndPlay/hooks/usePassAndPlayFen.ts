import { ParsedFEN } from "@/shared/types/chessTypes/gameState.types";
import { useEffect, useState } from "react";
import { fetchFen } from "../utils/passAndPlayApi";

function usePassAndPlayFen() {
    const [parsedFEN, setParsedFEN] = useState<ParsedFEN | null>(null);

    useEffect(() => {
        getParsedFEN();
    }, []);

    async function getParsedFEN() {
        const startingPositionFEN =
            "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

        try {
            const fetchedFEN = await fetchFen(startingPositionFEN);
            setParsedFEN(fetchedFEN);
        } catch (error) {
            console.log(error);
        }
    }


    return { parsedFEN, setParsedFEN };
}

export default usePassAndPlayFen;
