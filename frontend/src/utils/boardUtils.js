function clearSquaresStyling() {
    for (let square = 0; square <= 63; square++) {
        const squareElement = document.getElementById(`${square}`);
        if (squareElement) {
            squareElement.classList.remove("legal-square");
        }
    }
}

function getRank(square) {
    return Math.ceil(((parseInt(square) + 1) / 8) - 1);
}

function getFile(square) {
    return (parseInt(square)) % 8;
}

export { clearSquaresStyling, getRank, getFile }