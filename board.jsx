"REQUIRE cell.jsx"
"REQUIRE piece.jsx"

const Board = function(props){
	const [floatingPiece, setFloatingPiece] = React.useState(null);

	const handlePieceClick = (piece) => {
		if(floatingPiece) return;
		setFloatingPiece(piece);
	}
	const handleCellClick = (cell) => {
		if( ! floatingPiece) return;
		if(checkHasPiece(cell)){
			setFloatingPiece(null);
			return;
		}
		floatingPiece.x = cell.x, floatingPiece.y = cell.y;
		setFloatingPiece(null);
	}

	const checkHasPiece = (cell) => !! props.pieces.find(p => p.x == cell.x && p.y == cell.y);

	return <div className="board" style={{
		gridTemplateColumns: "repeat(" + props.xSize + ", 1fr)",
		gridTemplateRows: "repeat(" + props.ySize + ", 1fr)",
	}}>
		{props.cells.map(cell =>
			<Cell
				cell={cell}
				key={cell.x + "/" + cell.y}
				canAccept={ !! floatingPiece && ! checkHasPiece(cell)}
				onClick={handleCellClick}
			>
				{props.pieces
					.filter( p => (p.x == cell.x && p.y == cell.y))
					.map(p =>
						<Piece
							piece={p}
							key={cell.x + "/" + cell.y + "/" + p.name}
							isFloating={floatingPiece == p}
							isPickable={ ! floatingPiece}
							onClick={handlePieceClick}
						/>
					)
				}
			</Cell>
		)}
	</div>
};