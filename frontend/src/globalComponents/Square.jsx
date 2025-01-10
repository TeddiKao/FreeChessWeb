import { useDrag, useDrop } from "react-dnd";

import "../styles/square.css";

function Square({
    squareNumber,
    squareColor,
    pieceColor,
    pieceType,
    handleSquareClick,
    setParsedFENString
}) {
    let startingSquare = null;

    const [{ isDragging }, drag] = useDrag(() => {
        return {
            type: "square",
            item: {id: squareNumber},
            collect: (monitor) => ({
                isDragging: monitor.isDragging(),
            }),
        }
    });

	const [{ isOver }, drop] = useDrop(() => ({
		accept: "square",
		drop: (item, monitor) => {
            startingSquare = item.id
            console.log(squareNumber);
            handleOnDrop(squareNumber)
		}
	}))

    function handleOnDrop(droppedSquare) {
        setParsedFENString((previousFENString) => {
            const boardPlacement = previousFENString["board_placement"]
            const squareInfo = boardPlacement[`${startingSquare}`]

            const pieceType = squareInfo["piece_type"]
            const pieceColor = squareInfo["piece_color"]

            const newPiecePlacements = {
                ...previousFENString,
                board_placement: {
                    ...boardPlacement,
                    [`${droppedSquare}`]: {
                        "piece_type": pieceType,
                        "piece_color": pieceColor
                    }
                }
            }

            console.log(newPiecePlacements);

            delete newPiecePlacements["board_placement"][`${startingSquare}`]

            return newPiecePlacements
        })
    }

    return (
        <div
			ref={drop}
            className={`chessboard-square ${squareColor}`}
            id={squareNumber}
            onClick={(event) => {
                handleSquareClick(event, squareNumber);
            }}
        >
            {pieceColor && pieceType ? (
                <img
                    ref={drag}
                    className="piece-image"
                    src={`../../public/${pieceColor.toLowerCase()}${pieceType}.svg`}
                />
            ) : null}
        </div>
    );
}

export default Square;
