import { useEffect, useState } from "react"
import { fetchCompletedGames, fetchTotalCompletedGames } from "../utils/apiUtils";
import { OptionalValue } from "../types/general";

function useCompletedGames(currentPage: number) {
    const [completedGames, setCompletedGames] = useState([]);
    const [totalCompletedGames, setTotalCompletedGames] = useState<OptionalValue<number>>(null);
    
    useEffect(() => {
        updateCompletedGames();
        updateTotalCompletedGames();
    }, []);

    useEffect(() => {
        updateCompletedGames();
        updateTotalCompletedGames();
    }, [currentPage]);

    async function updateCompletedGames(): Promise<void> {
        const fetchedCompletedGames = await fetchCompletedGames(currentPage);

        setCompletedGames(fetchedCompletedGames);
    }

    async function updateTotalCompletedGames(): Promise<void> {
        const fetchedTotalCompletedGames = await fetchTotalCompletedGames();

        setTotalCompletedGames(fetchedTotalCompletedGames);
    }

    return {
        initialCompletedGames: completedGames,
        initialTotalCompletedGames: totalCompletedGames
    };
}

export default useCompletedGames