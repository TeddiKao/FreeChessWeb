import useGameplaySettings from "../../hooks/useGameplaySettings";
import Setting from "../settings/Setting.jsx";

import "../../styles/modals/gameplay-settings.css";
import ModalWrapper from "../wrappers/ModalWrapper.jsx";

function GameplaySettings({ onClose }) {
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
            />

            <Setting
                settingName="Show legal moves"
                settingType="switch"
                settingId="show_legal_moves"
                initialSettingValue={showLegalMoves}
            />

            <button onClick={onClose} className="close-button">Close</button>
        </div>
    );
}

export default GameplaySettings;
