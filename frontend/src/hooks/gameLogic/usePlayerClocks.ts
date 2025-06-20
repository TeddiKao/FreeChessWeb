import { useEffect, useState } from "react";
import { fetchTimer } from "../../utils/apiUtils";
import { TimerChangedEventData } from "../../interfaces/gameLogic";

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

    function handleTimerChanged(eventData: TimerChangedEventData) {
		setWhitePlayerClock(eventData["white_player_clock"]);
		setBlackPlayerClock(eventData["black_player_clock"]);
	}

    return { whitePlayerClock, blackPlayerClock, handleTimerChanged }
}

export default usePlayerClocks;
