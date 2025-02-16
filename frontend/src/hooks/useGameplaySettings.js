import { useEffect, useState } from "react";
import api from "../api.js";

function useGameplaySettings() {
    const [gameplaySettings, setGameplaySettings] = useState(null);

    useEffect(() => {
        async function modifyGameplaySettings() {
            const newGameplaySettings = await fetchGameplaySettings(
                gameplaySettings
            );
            setGameplaySettings(newGameplaySettings);
        }

        modifyGameplaySettings();
    }, []);

    async function fetchGameplaySettings() {
        let gameplaySettings = null;

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
