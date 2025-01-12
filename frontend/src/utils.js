import api from "./api.js";

function clearSquaresStyling() {
    for (let square = 1; square <= 64; square++) {
        const squareElement = document.getElementById(`${square}`);
        if (squareElement) {
            squareElement.classList.remove("legal-square");
        }
    }
}

async function fetchFen(rawFenString) {
    let parsedFen = null;

    try {
		const response = await api.get("/gameplay_api/parse-fen/", {
			params: {
				raw_fen_string: rawFenString,
			},
		})
		
		parsedFen = response.data
		console.log(parsedFen)

	} catch (error) {
		console.log(error);
	}

	console.log(parsedFen)
    return parsedFen
}

export { clearSquaresStyling, fetchFen };
