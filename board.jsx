"REQUIRE cell.jsx"
"REQUIRE piece.jsx"

const Board = function(props){
	const [floating, setFloating] = React.useState(null);

	const handlePieceClick = (piece) => {
		if(floating) return;
		setFloating(piece);
	}
	const handlePieceDoubleClick = (piece) => {
		props.promote(piece);
		setFloating(null);
	}

	const handleCellClick = (cell) => {
		if( ! floating) return;
		if( ! props.checkCanMove(floating, cell)){
			setFloating(null);
			return;
		}
		else props.move(floating, cell);
		setFloating(null);
	}
	const handleKomadaiClick = (cell) => {
		if( ! floating) return;
		props.moveToKomadai(floating, cell.player);
		setFloating(null);
	}
	const getCellPieces = (cell) => props.pieces.filter(p =>
		! props.positions[p.id].isOut && props.positions[p.id].x == cell.x && props.positions[p.id].y == cell.y
	);
	const getKomadaiPieces = (player) => props.pieces.filter(p => 
		props.positions[p.id].isOut && props.positions[p.id].player == player
	);

	// TODO: context
	const renderPieces = (pieces) => pieces.map((p, i) => 
		<Piece
			piece={p}
			position={props.positions[p.id]}
			key={i}
			isPickable={! floating}
			isFloating={floating == p}
			onClick={handlePieceClick}
			onDoubleClick={handlePieceDoubleClick}
		/>
	);

	return (
		<React.Fragment>
			<div className="board komadai">
				<Cell
					cell={{x: 0, y: 0, player: 1}}
					canAccept={floating && ! getKomadaiPieces(1).includes(floating)}
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
						canAccept={floating && props.checkCanMove(floating, cell)}
						onClick={handleCellClick}
					>
					{renderPieces(getCellPieces(cell))}
					</Cell>
				)}
			</div>
			<div className="board komadai">
				<Cell
					cell={{x: 0, y: 0, player: 0}}
					canAccept={floating && ! getKomadaiPieces(0).includes(floating)}
					onClick={handleKomadaiClick}
				>
					{renderPieces(getKomadaiPieces(0))}
				</Cell>
			</div>
		</React.Fragment>
	)
};