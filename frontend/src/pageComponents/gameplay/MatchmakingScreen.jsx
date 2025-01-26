import { useEffect, useState } from "react"
import api from "../../api.js"

function MatchmakingScreen({ timeControlInfo: { baseTime, increment } }) {
	const [matchmakingStatus, setMatchmakingStatus] = useState("Finding match")
	
	useEffect(() => {
		async function findMatch() {
			try {
				const response = await api.post("/matchmaking-api/match-player/")
				if (response.data["player_found"]) {
					setMatchmakingStatus("Found player")
				}

			} catch (error) {
				console.log(error)
			}
		}

		const findMatchInterval = setInterval(() => {
			findMatch().catch((error) => {
				console.log(error);
			})
		}, 1000)

		return () => {
			clearInterval(findMatchInterval)
		}
	}, [])
}

export default MatchmakingScreen