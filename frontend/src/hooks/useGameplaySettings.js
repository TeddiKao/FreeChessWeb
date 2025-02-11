import { useEffect, useState } from "react";
import api from "../api.js";

function useGameplaySettings() {
    console.log("Hook called!")

    const [gameplaySettings, setGameplaySettings] = useState(null);
    
    useEffect(() => {
        console.log("Effect has run!")

        async function modifyGameplaySettings() {
            const newGameplaySettings = await fetchGameplaySettings(gameplaySettings);
            console.log(newGameplaySettings);
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

            console.log(response.data);
            console.log(response.status);

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
