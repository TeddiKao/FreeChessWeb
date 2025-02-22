import useAudio from "../hooks/useAudio.js";

function playAudio(moveType: string) {
    const moveAudio = useAudio("/move-self.mp3");
    const captureAudio = useAudio("/capture.mp3");
    const checkAudio = useAudio("/move-check.mp3");
    const promoteAudio = useAudio("/promote.mp3");
    const castlingAudio = useAudio("/castle.mp3");

    switch (moveType.toLowerCase()) {
        case "move":
            moveAudio.play();
            break;

        case "capture":
            captureAudio.play();
            break;

        case "castling":
            castlingAudio.play();
            break;

        case "promotion":
            promoteAudio.play();
            break;

        case "check":
            checkAudio.play();
            break;

        case "no sound":
            break;

        default:
            console.error(`Invalid move type: ${moveType}`);
    }
}

export { playAudio };
