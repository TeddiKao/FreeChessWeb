import React, {useEffect, useState} from "react";
import api from "../api.js";

function useGameplaySettings() {
	const [gameplaySettings, setGameplaySettings] = useState(null);

	useEffect(() => {
		fetchGameplaySettings();
	}, [])

	function fetchGameplaySettings() {
		api.get("/gameplay_api/get-gameplay-settings/")
		.then((response) => response.data)
		.then((data) => setNotes(data));
	}

	return gameplaySettings;
}

export default useGameplaySettings;