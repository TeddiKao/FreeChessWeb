import { useState } from "react";

function usePlayerClocks(baseTime: number) {
	const [whitePlayerClock, setWhitePlayerClock] = useState<number>(baseTime);
	const [blackPlayerClock, setBlackPlayerClock] = useState<number>(baseTime);
}

export default usePlayerClocks;
