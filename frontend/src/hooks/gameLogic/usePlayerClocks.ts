import { useEffect, useState } from "react";
import { fetchTimer } from "../../utils/apiUtils";

function usePlayerClocks(gameId: number, baseTime: number) {
	const [whitePlayerClock, setWhitePlayerClock] = useState<number>(baseTime);
	const [blackPlayerClock, setBlackPlayerClock] = useState<number>(baseTime);

    useEffect(() => {
        updatePlayerClocks();
    }, []);

    async function updatePlayerClocks() {
		const whitePlayerClock = await fetchTimer(gameId, "white");
		const blackPlayerClock = await fetchTimer(gameId, "black");

		setWhitePlayerClock(whitePlayerClock);
		setBlackPlayerClock(blackPlayerClock);
	}
}

export default usePlayerClocks;
