import "../../styles/settings/settings-switch.css"

function SettingsSwitch({ switchState, setSwitchState }) {
    const switchClassname = switchState ? "on" : "off";

    function handleSwitchToggle() {
        setSwitchState(!switchState);
    }

    return (
        <div onClick={handleSwitchToggle} className={`settings-switch ${switchClassname}`}>
            <div className="switch-slider"></div>
        </div>
    );
}

export default SettingsSwitch;
