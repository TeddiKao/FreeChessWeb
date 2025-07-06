import { useEffect, useState } from "react";
import { TimerChangedEventData } from "../types/gameEvents.types";
import { fetchTimer } from "../../common/utils/gameStateFetchApi";

function usePlayerClocks(gameId: number, baseTime: number) {
	const [whitePlayerClock, setWhitePlayerClock] = useState<number>(baseTime);
	const [blackPlayerClock, setBlackPlayerClock] = useState<number>(baseTime);

	useEffect(() => {
		updatePlayerClocks();
	}, [gameId]);

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

	return { whitePlayerClock, blackPlayerClock, handleTimerChanged };
}

export default usePlayerClocks;
