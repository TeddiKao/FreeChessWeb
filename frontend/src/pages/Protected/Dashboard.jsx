import React, { useEffect, useState } from "react";
import api from "../../api.js";
import Chessboard from "../../globalComponents/Chessboard.jsx";

import "../../styles/dashboard.css";

function Dashboard() {
    const [parsedFEN, setParsedFEN] = useState("");

    useEffect(() => {
        getParsedFEN();
    }, []);

    const startingPositionFEN =
        "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

    function getParsedFEN() {
        api.get("/gameplay_api/parse-fen", {
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
        <div className="chessboard-wrapper">
            <Chessboard parsed_fen_string={parsedFEN} />
        </div>
    );
}

export default Dashboard;
