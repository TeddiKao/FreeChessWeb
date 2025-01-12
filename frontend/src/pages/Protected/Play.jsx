import React, { useEffect, useState } from "react";
import api from "../../api.js";
import Chessboard from "../../globalComponents/Chessboard.jsx";

import Timer from "../../pageComponents/gameplay/Timer.jsx";

import "../../styles/play.css";
import DisplayChessboard from "../../globalComponents/DisplayChessboard.jsx";

function Play() {
    const [parsedFEN, setParsedFEN] = useState("");

    useEffect(() => {
        getParsedFEN();
    }, []);

    const startingPositionFEN =
        "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

    function getParsedFEN() {
        api.get("/gameplay_api/parse-fen/", {
            params: {
                raw_fen_string: startingPositionFEN,
            },
        })
            .then((response) => response.data)
            .then((data) => {
                setParsedFEN(data);
            })
            .catch((error) => console.log(error));
    }

    return (
        <div className="playing-interface-container">
            <div className="top-timer-wrapper">
                <Timer playerColor="black" position="top" />
            </div>

            <Chessboard parsed_fen_string={parsedFEN} orientation="White" />

            <div className="bottom-timer-wrapper">
                <Timer playerColor="white" position="bottom" />
            </div>
        </div>
    );
}

export default Play;
