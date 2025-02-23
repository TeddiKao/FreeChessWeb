import { useEffect, useState } from "react";
import SettingsSwitch from "./SettingsSwitch.js";
import api from "../../api.js";


function Setting({ settingName, settingId, settingType, initialSettingValue, setGameplaySettingvs }) {
    const [settingValue, setSettingValue] = useState(initialSettingValue);

	useEffect(() => {
		updateSettings();
	}, [settingValue])

	async function updateSettings() {
		let newSettings = null;

        if (settingValue === undefined || settingValue === null) {
            return null;
        }

        console.log(settingValue, settingId);

		try {
			const response = await api.post("/gameplay_api/update-gameplay-settings/", {
                "setting_to_update": settingId,
                "updated_value": settingValue
            })

            console.log(response);

			if (response.status === 200) {
				newSettings = response.data;
				
				const newSettingValue = newSettings[settingId];

				setSettingValue(newSettingValue);
                setGameplaySettingvs(newSettings);
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
