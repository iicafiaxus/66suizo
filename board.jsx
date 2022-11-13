"REQUIRE cell.jsx";
"REQUIRE piece.jsx";
"REQUIRE modal.jsx";

const Board = function(props){
	const [floating, setFloating] = React.useState(null);
	const [isWaitingPromotion, setIsWaitingPromotion] = React.useState(false);

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
		else{
			const promo = props.checkPromotion(floating, cell);
			if(promo[0] && promo[1]){
				props.move(floating, cell, promo[0] ? 0 : 1);
				setIsWaitingPromotion(true);
			}
			else{
				props.move(floating, cell, promo[0] ? 0 : 1);
				setFloating(null);
			}
		}
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

	const endWaitingPromotion = (yes) => {
		if(yes) props.promote(floating);
		setIsWaitingPromotion(false);
		setFloating(null);
	}

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
			{isWaitingPromotion && <Modal onClose={() => endWaitingPromotion(false)}>
				<button onClick={() => endWaitingPromotion(true)}>成る</button>
				<button onClick={() => endWaitingPromotion(false)}>成らない</button>
			</Modal>}
		</React.Fragment>
	)
};