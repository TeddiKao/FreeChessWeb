import useGameplaySettings from "../../hooks/useGameplaySettings.js";
import Setting from "../settings/Setting.js";

import "../../styles/modals/gameplay-settings.scss";

function GameplaySettings({ onClose, setGameplaySettings }) {
    const gameplaySettings = useGameplaySettings();
    if (!gameplaySettings) {
        return null;
    }

    const autoQueen = gameplaySettings["auto_queen"];
    const showLegalMoves = gameplaySettings["show_legal_moves"];

    return (
        <div className="gameplay-settings-container">
            <h1 className="gameplay-settings-heading">Settings</h1>
            <Setting
                settingName="Auto queen"
                settingId="auto_queen"
                initialSettingValue={autoQueen}
                settingType="switch"
                setGameplaySettingvs={setGameplaySettings}
            />

            <Setting
                settingName="Show legal moves"
                settingType="switch"
                settingId="show_legal_moves"
                initialSettingValue={showLegalMoves}
                setGameplaySettingvs={setGameplaySettings}
            />

            <button onClick={onClose} className="close-button">
                Close
            </button>
        </div>
    );
}

export default GameplaySettings;
