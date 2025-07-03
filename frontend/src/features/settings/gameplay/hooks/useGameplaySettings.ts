import { useEffect, useState } from "react";
import api from "../../../../api.ts";

function useGameplaySettings() {
	const [gameplaySettings, setGameplaySettings] = useState<object | null>(
		null
	);

	useEffect(() => {
		async function updateGameplaySettings(): Promise<void> {
			const newGameplaySettings: object | null =
				await fetchGameplaySettings();
			setGameplaySettings(newGameplaySettings);
		}

		updateGameplaySettings();
	}, []);

	async function fetchGameplaySettings(): Promise<object | null> {
		let gameplaySettings: object | null = null;

		try {
			const response = await api.post(
				"/gameplay_api/get-gameplay-settings/"
			);

			if (response.status === 200 || response.status === 201) {
				gameplaySettings = response.data;
			}
		} catch (error) {
			console.log(error);
		}

		return gameplaySettings;
	}

	return gameplaySettings;
}

export default useGameplaySettings;
