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

	return (
		<div>
			<Board
				xSize={xSize} ySize={ySize}
				cells={cells}
				pieces={pieces}
				positions={pieces.map(p => positions[p.id])}
				checkCanMove={(piece, cell) => model.checkCanMove(piece, cell, positions)}
				checkPromotion={(piece, cell) => model.checkPromotion(piece, cell, positions)}
				move={move}
				moveToKomadai={moveToKomadai}
				promote={promote}
			/>
		</div>
	)
}
