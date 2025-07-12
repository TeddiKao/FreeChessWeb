import { useEffect, useState } from "react";
import { getEmail } from "@sharedUtils/apiUtils";

function useEmail() {
	const [email, setEmail] = useState<string | null>(null);

	useEffect(() => {
		updateEmail();
	}, []);

	async function updateEmail() {
		const fetchedEmail = await getEmail();

		setEmail(fetchedEmail);
	}

	return email;
}

export default useEmail;
