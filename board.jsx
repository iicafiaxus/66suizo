"REQUIRE cell.jsx";
"REQUIRE piece.jsx";
"REQUIRE modal.jsx";
"REQUIRE systemarea.jsx";

const Board = function(props){
	const [floating, setFloating] = React.useState(null);
	const [isWaitingPromotion, setIsWaitingPromotion] = React.useState(false);

	const handlePieceClick = (piece) => {
		if(floating) return;
		if( ! props.checkIsPickable(piece)) return;
		setFloating(piece);
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
		setFloating(null);
	}
	const getCellPieces = (cell) => props.pieces.filter(p =>
		! props.positions[p.id].isOut && props.positions[p.id].x == cell.x && props.positions[p.id].y == cell.y
	);
	const getKomadaiPieces = (player) => props.pieces.filter(p => 
		props.positions[p.id].isOut && props.positions[p.id].player == player &&
		! props.positions[p.id].isExcluded
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
			isPickable={! floating && props.checkIsPickable(p)}
			isFloating={floating == p}
			onClick={handlePieceClick}
		/>
	);

	return (
		<React.Fragment>
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
				<SystemArea player="1"
					isActive={props.turn == "1"}
					time={props.times[1]}
				/>
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
						canAccept={floating && props.checkCanMove(floating, cell)}
						onClick={handleCellClick}
					>
					{renderPieces(getCellPieces(cell))}
					</Cell>
				)}
			</div>

			<div className={"boardside player0" + (props.isRunning ? " running" : "")}>
				<SystemArea player="0"
					isActive={props.turn == "0"}
					time={props.times[0]}
				/>
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

			{isWaitingPromotion && <Modal onClose={() => endWaitingPromotion(false)}>
				<div className="modal-body">
					<button className="primaryButton" onClick={() => endWaitingPromotion(true)}>成る</button>
					<button onClick={() => endWaitingPromotion(false)}>成らない</button>
				</div>
			</Modal>}

		</React.Fragment>
	)
};