import SettingsSwitch from "./SettingsSwitch"

function Setting({ settingName, settingType, settingValue }) {
	function getSettingInput() {
		switch (settingType) {
			case "switch":
				return <SettingsSwitch switchState={settingValue} />

			default:
				console.error(`Unknown setting type ${settingType}`)
		}
	}

	return (
		<div className="setting-container">
			<p className="setting-name">{settingName}</p>
			{getSettingInput()}
		</div>
	)
}

export default Setting