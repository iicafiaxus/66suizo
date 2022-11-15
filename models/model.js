"REQUIRE models/piecemodel.js";

const model = {};

model.xSize = 6;
model.ySize = 6;

model.cells = (function(model){
	const cells = [];
	for(let x = 0; x < model.xSize; x ++) for(let y = 0; y < model.ySize; y ++){
		cells.push({ id: cells.length, x, y });
	}
	return cells;
})(model);

model.pieces = pieceModel.pieces;

model.turn = 0;

model.checkCanMove = (piece, cell, positions) => {
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
			if(x1 == cell.x && y1 == cell.y) return true;
			if(positions.find(pos => pos.x == x1 && pos.y == y1)) break;
		}
	}
	return false;
}

model.checkPromotion = (piece, cell, positions) => {
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

model.checkIsPickable = (piece, positions, turn) => {
	return positions[piece.id].player == turn;
}