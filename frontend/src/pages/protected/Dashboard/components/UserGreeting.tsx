import useUsername from "@sharedHooks/useUsername";
import { getLocalTimeHours } from "@sharedUtils/timeUtils";
import "../styles/user-greeting.scss";

function UserGreeting() {
	const currentTime = getLocalTimeHours();
	const username = useUsername();

	function getGreeting() {
		if (currentTime < 12) {
			return "Good Morning";
		} else if (currentTime < 18) {
			return "Good Afternoon";
		} else {
			return "Good Evening";
		}
	}

	return (
		<h2 className="user-greeting">
			{getGreeting()} {username}!
		</h2>
	);
}

export default UserGreeting;
