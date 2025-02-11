function SettingsSwitch({ switchState }) {
	const switchClassname = switchState ? "on" : "off";

	return (
		<div className={`settings-switch ${switchClassname}`}></div>
	)
}

export default SettingsSwitch;