import useGameplaySettings from "../../../hooks/useGameplaySettings.js";
import Setting from "../settings/Setting.js";

import "../../../styles/modals/gameplay-settings.scss";
import { StateSetterFunction } from "../../../types/general.js";

type GameplaySettingsModalProps = {
    onClose: () => void;
    setGameplaySettings: StateSetterFunction<any>;
}

function GameplaySettings({ onClose, setGameplaySettings }: GameplaySettingsModalProps) {
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
                setGameplaySettings={setGameplaySettings}
            />

            <Setting
                settingName="Show legal moves"
                settingType="switch"
                settingId="show_legal_moves"
                initialSettingValue={showLegalMoves}
                setGameplaySettings={setGameplaySettings}
            />

            <button onClick={onClose} className="close-button">
                Close
            </button>
        </div>
    );
}

export default GameplaySettings;
