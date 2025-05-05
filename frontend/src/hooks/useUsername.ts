import { useEffect, useState } from "react";
import { getUsername } from "../utils/apiUtils";

function useUsername() {
    const [username, setUsername] = useState<string | null>(null);

    useEffect(() => {
        updateUsername();
    }, []);

    async function updateUsername() {
        const fetchedUsername = await getUsername();

        setUsername(fetchedUsername);
    }

    return username;
}

export default useUsername;