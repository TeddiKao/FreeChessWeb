import { useEffect, useState } from "react"
import { fetchCompletedGames } from "../utils/apiUtils";

function useCompletedGames(currentPage: number) {
    const [completedGames, setCompletedGames] = useState([]);
    
    useEffect(() => {
        updateCompletedGames();
    }, []);

    async function updateCompletedGames(): Promise<void> {
        const fetchedCompletedGames = await fetchCompletedGames(currentPage);

        setCompletedGames(fetchedCompletedGames);
    }

    return completedGames;
}

export default useCompletedGames