function clearSquaresStyling() {
	for (let square = 1; square <= 64; square++) {
		const squareElement = document.getElementById(`${square}`)
		if (squareElement) {
			squareElement.classList.remove("legal-square")
		}
	}
}

export { clearSquaresStyling }