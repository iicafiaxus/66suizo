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
	React.useEffect(() => {
		model.clocks[turn].start();
	}, [turn]);

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
			isFloating: false
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
		const hndTimer = setTimeout(() => {
			setTimes([0, 1].map(t => model.clocks[t].getTime()));
		}, Math.min(1000 - times[1] % 1000, 1000 - times[0] % 1000));
		return () => {
			clearTimeout(hndTimer);
		}
	}, [times]);

	return (
		<div>
			<Board
				xSize={xSize} ySize={ySize}
				cells={cells}
				pieces={pieces}
				times={times}
				positions={pieces.map(p => positions[p.id])}
				turn={turn}
				checkCanMove={(piece, cell) => model.checkCanMove(piece, cell, positions)}
				checkIsPickable={(piece) => model.checkIsPickable(piece, positions, turn)}
				checkPromotion={(piece, cell) => model.checkPromotion(piece, cell, positions)}
				move={move}
				moveToKomadai={moveToKomadai}
				promote={promote}
			/>
		</div>
	)
}
