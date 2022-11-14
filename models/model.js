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

model.pieces = [
	{id: 0, entity: pieceModel.entities.king, position: { x: 0, y: 3, face: 0, player: 1, isOut: false }},
	{id: 1, entity: pieceModel.entities.king, position: { x: 5, y: 2, face: 0, player: 0, isOut: false }},
	{id: 2, entity: pieceModel.entities.queen, position: { x: 0, y: 2, face: 0, player: 1, isOut: false }},
	{id: 3, entity: pieceModel.entities.queen, position: { x: 5, y: 3, face: 0, player: 0, isOut: false }},
	{id: 4, entity: pieceModel.entities.rook, position: { x: 0, y: 1, face: 0, player: 1, isOut: false }},
	{id: 5, entity: pieceModel.entities.rook, position: { x: 5, y: 4, face: 0, player: 0, isOut: false }},
	{id: 6, entity: pieceModel.entities.bishop, position: { x: 0, y: 4, face: 0, player: 1, isOut: false }},
	{id: 7, entity: pieceModel.entities.bishop, position: { x: 5, y: 1, face: 0, player: 0, isOut: false }},
	{id: 8, entity: pieceModel.entities.silver, position: { x: 0, y: 0, face: 0, player: 1, isOut: false }},
	{id: 9, entity: pieceModel.entities.silver, position: { x: 0, y: 5, face: 0, player: 1, isOut: false }},
	{id: 10, entity: pieceModel.entities.silver, position: { x: 5, y: 0, face: 0, player: 0, isOut: false }},
	{id: 11, entity: pieceModel.entities.silver, position: { x: 5, y: 5, face: 0, player: 0, isOut: false }},
	{id: 12, entity: pieceModel.entities.pawn, position: { x: 1, y: 0, face: 0, player: 1, isOut: false }},
	{id: 13, entity: pieceModel.entities.pawn, position: { x: 1, y: 1, face: 0, player: 1, isOut: false }},
	{id: 14, entity: pieceModel.entities.pawn, position: { x: 1, y: 2, face: 0, player: 1, isOut: false }},
	{id: 15, entity: pieceModel.entities.pawn, position: { x: 1, y: 3, face: 0, player: 1, isOut: false }},
	{id: 16, entity: pieceModel.entities.pawn, position: { x: 1, y: 4, face: 0, player: 1, isOut: false }},
	{id: 17, entity: pieceModel.entities.pawn, position: { x: 1, y: 5, face: 0, player: 1, isOut: false }},
	{id: 18, entity: pieceModel.entities.pawn, position: { x: 4, y: 0, face: 0, player: 0, isOut: false }},
	{id: 19, entity: pieceModel.entities.pawn, position: { x: 4, y: 1, face: 0, player: 0, isOut: false }},
	{id: 20, entity: pieceModel.entities.pawn, position: { x: 4, y: 2, face: 0, player: 0, isOut: false }},
	{id: 21, entity: pieceModel.entities.pawn, position: { x: 4, y: 3, face: 0, player: 0, isOut: false }},
	{id: 22, entity: pieceModel.entities.pawn, position: { x: 4, y: 4, face: 0, player: 0, isOut: false }},
	{id: 23, entity: pieceModel.entities.pawn, position: { x: 4, y: 5, face: 0, player: 0, isOut: false }},
];

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
