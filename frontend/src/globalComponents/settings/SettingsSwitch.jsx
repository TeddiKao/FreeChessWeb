import { useState } from "react";
import "../../styles/settings/settings-switch.css"

function SettingsSwitch({ switchState }) {
    const [settingSwitchState, setSettingSwitchState] = useState(switchState);
    const switchClassname = settingSwitchState ? "on" : "off";

    function handleSwitchToggle() {
        setSettingSwitchState(!settingSwitchState);
    }

    return (
        <div onClick={handleSwitchToggle} className={`settings-switch ${switchClassname}`}>
            <div className="switch-slider"></div>
        </div>
    );
}

export default SettingsSwitch;
