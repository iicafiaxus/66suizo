"REQUIRE cell.jsx"
"REQUIRE piece.jsx"

const Board = function(props){
	const positions = [], setPositions = [];
	for(p of props.pieces) [positions[p.id], setPositions[p.id]] = React.useState(p.position);

	const hasFloating = () => !! positions.find(pos => pos.isFloating);
	const getFloating = () => props.pieces.find(p => positions[p.id].isFloating);

	const resetFloating = () => {
		for(p of props.pieces) setPositions[p.id]({
			x: positions[p.id].x,
			y: positions[p.id].y,
			face: positions[p.id].face,
			player: positions[p.id].player,
			isOut: positions[p.id].isOut,
			isFloating: false,
		})
	}

	const handlePieceClick = (piece) => {
		if(hasFloating()) return;
		setPositions[piece.id]({
			x: positions[piece.id].x,
			y: positions[piece.id].y,
			face: positions[piece.id].face,
			player: positions[piece.id].player,
			isOut: positions[piece.id].isOut,
			isFloating: true,
		});
	}
	const handlePieceDoubleClick = (piece) => {
		setPositions[piece.id]({
			x: positions[piece.id].x,
			y: positions[piece.id].y,
			face: 1 - positions[piece.id].face,
			player: positions[piece.id].player,
			isOut: positions[piece.id].isOut,
			isFloating: false
		});
	}

	const handleCellClick = (cell) => {
		if( ! hasFloating()) return;
		if(getCellPieces(cell).length > 0){
			resetFloating();
			return;
		}
		const floating = getFloating();
		setPositions[floating.id]({
			x: cell.x,
			y: cell.y,
			face: positions[floating.id].face,
			player: positions[floating.id].player,
			isOut: false,
			isFloating: false
		});
	}
	const handleKomadaiClick = (cell) => {
		if( ! hasFloating()) return;
		const floating = getFloating();
		setPositions[floating.id]({
			x: -1,
			y: -1,
			face: 0,
			player: cell.player,
			isOut: true,
			isFloating: false
		});
	}
	const getCellPieces = (cell) => props.pieces.filter(p =>
		positions[p.id].x == cell.x && positions[p.id].y == cell.y && ! positions[p.id].isOut
	);
	const getKomadaiPieces = (player) => props.pieces.filter(p => 
		positions[p.id].isOut && positions[p.id].player == player
	);

	// TODO: context
	const renderPieces = (pieces) => pieces.map((p, i) => 
		<Piece
			piece={p}
			position={positions[p.id]}
			key={i}
			isPickable={! hasFloating()}
			onClick={handlePieceClick}
			onDoubleClick={handlePieceDoubleClick}
		/>
	);

	return (
		<React.Fragment>
			<div className="board komadai">
				<Cell
					cell={{x: 0, y: 0, player: 1}}
					canAccept={hasFloating() && ! getKomadaiPieces(1).includes(getFloating())}
					onClick={handleKomadaiClick}
				>
					{renderPieces(getKomadaiPieces(1))}
				</Cell>
			</div>
			<div className="board" style={{
				gridTemplateColumns: "repeat(" + props.xSize + ", 1fr)",
				gridTemplateRows: "repeat(" + props.ySize + ", 1fr)",
			}}>
				{props.cells.map(cell =>
					<Cell
						cell={cell}
						key={cell.x + "/" + cell.y}
						canAccept={ hasFloating() && getCellPieces(cell).length == 0}
						onClick={handleCellClick}
					>
					{renderPieces(getCellPieces(cell))}
					</Cell>
				)}
			</div>
			<div className="board komadai">
				<Cell
					cell={{x: 0, y: 0, player: 0}}
					canAccept={hasFloating() && ! getKomadaiPieces(0).includes(getFloating())}
					onClick={handleKomadaiClick}
				>
					{renderPieces(getKomadaiPieces(0))}
				</Cell>
			</div>
		</React.Fragment>
	)
};