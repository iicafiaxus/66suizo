"REQUIRE util.jsx";
"REQUIRE piece.jsx";
"REQUIRE board.jsx";
"REQUIRE models/model.js";

const Game = function(props){
	const xSize = model.xSize, ySize = model.ySize;
	const cells = model.cells;
	const pieces = model.pieces;

	const positions = [], setPositions = [];
	for(let p of pieces){
		[positions[p.id], setPositions[p.id]] = React.useState(p.position);
	}

	const [turn, setTurn] = React.useState(model.turn);

	const [isRunning, setIsRunning] = React.useState(false);
	const start = () => {
		setIsStarting(false);
		console.log("game start");
		setIsRunning(true);
		model.clocks[turn].start();
	}
	const stop = () => {
		setIsStarting(false);
		console.log("game stop");
		model.clocks[turn].stop();
		setIsRunning(false);
	}

	const [isStarting, setIsStarting] = React.useState(false);

	const [alert, setAlert] = React.useState({
		title: "",
		message: "",
		options: [
			{ caption: "今すぐ対局開始", onClick: start, isPrimary: true },
			{ caption: "あとで", onClick: stop },
		]
	});

	const move = (piece, cell, face) => {
		for(let p of pieces.filter(p =>
			positions[p.id].x == cell.x && positions[p.id].y == cell.y
		)) moveToKomadai(p, positions[piece.id].player);
		setPositions[piece.id](pos => ({
			...pos,
			x: cell.x,
			y: cell.y,
			face: face,
			isOut: false,
			isFloating: false
		}));
		model.clocks[turn].stop();
		model.clocks[1 - turn].start();
		setTurn(1 - turn);
	};
	const moveToKomadai = (piece, player) => {
		setPositions[piece.id](pos => ({
			...pos, 
			x: -1,
			y: -1,
			face: 0,
			player: player,
			isOut: true,
			isFloating: false,
			isExcluded: piece.entity.isSingleUse,
		}));
	};

	const promote = (piece) => {
		setPositions[piece.id](pos => ({
			...pos,
			face: 1 - positions[piece.id].face,
			isFloating: false
		}));
	}

	const [times, setTimes] = React.useState([0, 0]);
	React.useEffect(() => {
		if( ! isRunning) return;
		const hndTimer = setTimeout(() => {
			setTimes([0, 1].map(t => model.clocks[t].getTime()));
		}, 1000 - times[turn] % 1000);
		return () => {
			clearTimeout(hndTimer);
		}
	}, [times, turn, isRunning]);

	return (
		<div>
			<Board
				xSize={xSize} ySize={ySize}
				cells={cells}
				pieces={pieces}
				times={times}
				positions={pieces.map(p => positions[p.id])}
				turn={turn}
				isRunning={isRunning}
				isStarting={isStarting}
				checkCanMove={(piece, cell) => model.checkCanMove(piece, cell, positions)}
				checkIsPickable={(piece) => isRunning && model.checkIsPickable(piece, positions, turn)}
				checkPromotion={(piece, cell) => model.checkPromotion(piece, cell, positions)}
				move={move}
				moveToKomadai={moveToKomadai}
				promote={promote}
				start={start}
				stop={stop}
			/>

			{alert && <Modal onClose={() => setAlert(null)}>
				{alert.title && <div className="modal-title">{alert.title}</div>}
				<div className="modal-body">
					{alert.message && <div className="alert-message">{alert.message}</div>}
					{alert.options.map(opt => 
						<button
							className={opt.isPrimary ? "primaryButton" : ""}
							onClick={() => {setAlert(null); opt.onClick()}}
							key={opt.caption}
						>
							{opt.caption}
						</button>
					)}
				</div>
			</Modal>}
		</div>
	)
}
