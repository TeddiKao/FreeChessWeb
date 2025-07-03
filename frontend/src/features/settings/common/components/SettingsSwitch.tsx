import "../../styles/components/settings/settings-switch.scss";

interface SettingsSwitchProps {
    switchState: boolean;
    setSwitchState: (state: boolean) => void;
}

function SettingsSwitch({ switchState, setSwitchState }: SettingsSwitchProps) {
    const switchClassname = switchState ? "on" : "off";

    function handleSwitchToggle() {
        setSwitchState(!switchState);
    }

    return (
        <div
            onClick={handleSwitchToggle}
            className={`settings-switch ${switchClassname}`}
        >
            <div className="switch-slider"></div>
        </div>
    );
}

export default SettingsSwitch;
