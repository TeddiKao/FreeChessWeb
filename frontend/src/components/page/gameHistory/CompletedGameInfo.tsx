type CompletedGameInfoProps = {
    gameInfo: any,
    username: string,
}

function CompletedGameInfo({ gameInfo }: CompletedGameInfoProps) {
    return (
        <div className="completed-game-info-container">
            <p>White player: {gameInfo.white_player}</p>
            <p>Black player: {gameInfo.black_player}</p>
            <p>Result: {gameInfo.game_winner}</p>
        </div>
    )
}

export default CompletedGameInfo;