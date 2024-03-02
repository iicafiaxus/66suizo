"REQUIRE cell.jsx";
"REQUIRE piece.jsx";
"REQUIRE modal.jsx";
"REQUIRE systemarea.jsx";

const Board = function(props){
	const [floating, setFloating] = React.useState(null);

	const handlePieceClick = (event, piece) => {
		if(floating) return;
		if( ! props.checkIsPickable(piece)) return;
		setFloating(piece);
		event.stopPropagation();
	}

	const handleCellClick = (cell) => {
		if(floating){
			props.move(floating, cell);
			setFloating(null);
		}
		else props.openMenu();
	}
	const handleKomadaiClick = (cell) => {
		if(floating){
			setFloating(null);
		}
		else props.openMenu();
	}
	const getCellPieces = (cell) => props.pieces.filter(p =>
		! props.positions[p.id].isOut && props.positions[p.id].cell.id == cell.id
	);
	const getKomadaiPieces = (player) => props.pieces.filter(p => 
		props.positions[p.id].isOut && props.positions[p.id].player == player &&
		! props.positions[p.id].isExcluded
	);

	// TODO: context
	const renderPieces = (pieces) => pieces.map((p, i) => 
		<Piece
			piece={p}
			position={props.positions[p.id]}
			key={i}
			isPickable={! floating && props.checkIsPickable(p)}
			isFloating={floating == p}
			onClick={handlePieceClick}
		/>
	);

	return (
		<div className="boardset">
			<div className={"boardside player1" + (props.isRunning ? " running" : "")}>
				<div className="board komadai player1">
					<Cell
						cell={{x: 0, y: 0, player: 1}}
						canAccept={false}
						onClick={handleKomadaiClick}
					>
						{renderPieces(getKomadaiPieces(1))}
					</Cell>
				</div>
			</div>

			<div
				className={"board" + (props.isRunning ? " running" : "")}
				style={{
					gridTemplateColumns: "repeat(" + props.xSize + ", 1fr)",
					gridTemplateRows: "repeat(" + props.ySize + ", 1fr)",
				}}
			>
				{props.cells.map(cell =>
					<Cell
						cell={cell}
						key={cell.x + "/" + cell.y}
						isLastCell={ ! floating && props.lastMove?.cell?.id == cell.id}
						canAccept={floating && props.checkCanMove(floating, cell)}
						onClick={handleCellClick}
					>
					{renderPieces(getCellPieces(cell))}
					</Cell>
				)}
			</div>

			<div className={"boardside player0" + (props.isRunning ? " running" : "")}>
				<div className="board komadai player0">
					<Cell
						cell={{x: 0, y: 0, player: 0}}
						canAccept={false}
						onClick={handleKomadaiClick}
					>
						{renderPieces(getKomadaiPieces(0))}
					</Cell>
				</div>
			</div>
		</div>
	)
};