type MoveListPanelProps = {
	moveList: Array<Array<string>>
}

function MoveListPanel({ moveList }: MoveListPanelProps) {
	function generateMovePairMoves(movePair: Array<string>) {
		return movePair.map((notatedMove: string, _) => {
			return (
				<p className="notated-move">{notatedMove}</p>
			)
		})
	}

	return (
		<div className="move-list-panel">
			{moveList.map((movePair: Array<string>, moveIndex: number) => {
				return (
					<div key={moveIndex} className="move-pair-container">
						{generateMovePairMoves(movePair)}
					</div>
				)
			})}
		</div>
	)
}

export default MoveListPanel;