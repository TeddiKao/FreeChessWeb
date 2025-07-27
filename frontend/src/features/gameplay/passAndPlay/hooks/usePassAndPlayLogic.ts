import useClickedSquaresState from "../../multiplayer/hooks/useClickedSquaresState";

function usePassAndPlayLogic() {
    const {
        clickedSquare,
        setClickedSquare,
        prevClickedSquare,
        setPrevClickedSquare,
    } = useClickedSquaresState();

    return { clickedSquare, setClickedSquare, prevClickedSquare, setPrevClickedSquare };
}

export default usePassAndPlayLogic;
