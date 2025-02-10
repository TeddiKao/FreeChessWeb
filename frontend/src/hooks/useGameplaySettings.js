import React, {useEffect, useState} from "react";
import api from "../api.js";

function useGameplaySettings() {
	const [gameplaySettings, setGameplaySettings] = useState(null);

	useEffect(() => {

	})

	async function fetchGameplaySettings() {
		try {

		} catch (error) {
			console.log(error);
		}
	}

	return gameplaySettings;
}

export default useGameplaySettings;