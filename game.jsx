"REQUIRE util.jsx";
"REQUIRE piece.jsx";
"REQUIRE board.jsx";
"REQUIRE model.jsx";

const Game = function(props){
	const xSize = 6, ySize = 6;
	const cells = [];
	for(let x = 0; x < xSize; x ++) for(let y = 0; y < ySize; y ++){
		cells.push({ id: cells.length, x, y });
	}

	const positions = [], setPositions = [];
	for(let p of Model.pieces){
		[positions[p.id], setPositions[p.id]] = React.useState(p.position);
	}

	const checkCanMove = (piece, cell) => {
		if(positions.find(pos =>
			pos.x == cell.x && pos.y == cell.y && pos.player == positions[piece.id].player
		)) return false;
		if(positions[piece.id].isOut){
			if(positions.find(pos => pos.x == cell.x && pos.y == cell.y)) return false;
			else return true; // TODO: 行きどころのない駒、二歩
		}
		for(let line of piece.entity.lines[positions[piece.id].face]){
			for(let t of line){
				const x1 = positions[piece.id].x + t.dx * [1, -1][positions[piece.id].player];
				const y1 = positions[piece.id].y + t.dy * [1, -1][positions[piece.id].player];
				if(x1 < 0 || x1 >= xSize || y1 < 0 || y1 >= ySize) break;
				if(x1 == cell.x && y1 == cell.y) return true;
				if(positions.find(pos => pos.x == x1 && pos.y == y1)) break;
			}
		}
		return false;
	}
	const checkPromotion = (piece, cell) => {
		// returns [a, b]; a: can keep raw, b: can promote
		const player = positions[piece.id].player;
		if(positions[piece.id].face == 1) return [false, true];
		if(piece.entity.isSingleFaced) return [true, false];
		if(positions[piece.id].isOut) return [true, false];
		if(player == 0 && cell.x > 1 && positions[piece.id].x > 1) return [true, false];
		if(player == 1 && cell.x < 4 && positions[piece.id].x < 4) return [true, false];
		if(player == 0 && cell.x < piece.entity.forcePromotion) return [false, true];
		if(player == 1 && cell.x > 5 - piece.entity.forcePromotion) return [false, true];
		return [true, true];
	}

	const move = (piece, cell, face) => {
		for(let p of Model.pieces.filter(p =>
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
				pieces={Model.pieces}
				positions={Model.pieces.map(p => positions[p.id])}
				checkCanMove={checkCanMove}
				checkPromotion={checkPromotion}
				move={move}
				moveToKomadai={moveToKomadai}
				promote={promote}
			/>
		</div>
	)
}
