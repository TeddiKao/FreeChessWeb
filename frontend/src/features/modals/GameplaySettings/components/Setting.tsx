import { useEffect, useState } from "react";
import SettingsSwitch from "../../../../components/global/settings/SettingsSwitch.js";
import api from "../../../../api.js";

type SettingComponentProps = {
	settingName: string;
	settingId: string;
	settingType: string;
	initialSettingValue: any;
	setGameplaySettings: any;
};

function Setting({
	settingName,
	settingId,
	settingType,
	initialSettingValue,
	setGameplaySettings,
}: SettingComponentProps) {
	const [settingValue, setSettingValue] = useState(initialSettingValue);

	useEffect(() => {
		updateSettings();
	}, [settingValue]);

	async function updateSettings() {
		let newSettings = null;

		if (settingValue === undefined || settingValue === null) {
			return null;
		}

		try {
			const response = await api.post(
				"/gameplay_api/update-gameplay-settings/",
				{
					setting_to_update: settingId,
					updated_value: settingValue,
				}
			);

			if (response.status === 200) {
				newSettings = response.data;

				const newSettingValue = newSettings[settingId];

				setSettingValue(newSettingValue);
				setGameplaySettings(newSettings);
			}
		} catch (error) {
			console.error(error);
		}
	}

	function getSettingInput() {
		switch (settingType) {
			case "switch":
				return (
					<SettingsSwitch
						setSwitchState={setSettingValue}
						switchState={settingValue}
					/>
				);

			default:
				console.error(`Unknown setting type ${settingType}`);
		}
	}

	return (
		<div className="setting-container">
			<p className="setting-name">{settingName}</p>
			{getSettingInput()}
		</div>
	);
}

export default Setting;
