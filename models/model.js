"REQUIRE models/piecemodel.js";

const model = {};

model.xSize = 6;
model.ySize = 6;

model.cells = (function(model){
	const cells = [];
	for(let x = 0; x < model.xSize; x ++) for(let y = 0; y < model.ySize; y ++){
		const name = "" + ["１", "２", "３", "４", "５", "６"][6 - y - 1]
			+ ["一", "二", "三", "四", "五", "六"][x];
		cells.push({ id: cells.length, x, y, name });
	}
	return cells;
})(model);
model.getCell = (x, y) => model.cells[x * model.ySize + y];

model.pieces = pieceModel.pieces;

model.turn = 0;

model.useAi = [false, true];

model.h = (positions) => {
	const life = [0, 0];
	for(p of model.pieces){
		const pos = positions[p.id];
		if( ! pos.isOut && ! pos.isExcluded){
			life[pos.player] += p.entity.life[pos.face];
		}
	}
	if(life[0] == 0) return { player: 1 };
	else if(life[1] == 0) return { player: 0 };
	else return null;
}

model.checkCanMove = (piece, cell, positions) => {
	if(positions.find(pos =>
		pos.x == cell.x && pos.y == cell.y && pos.player == positions[piece.id].player
	)) return false;
	if(positions[piece.id].isOut){
		if(positions.find(pos => pos.x == cell.x && pos.y == cell.y)) return false;
		const player = positions[piece.id].player;
		if(player == 0 && cell.x < piece.entity.forcePromotion) return false;
		if(player == 1 && cell.x > 5 - piece.entity.forcePromotion) return false;
		if(piece.entity.occupiesColumn){
			if(model.pieces.find(p => 
				positions[p.id].y == cell.y && positions[p.id].player == player &&
				p.entity == piece.entity && positions[p.id].face == 0
			)) return false;
		}
		return true;
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

model.clocks = [0, 1].map(player => ({
	id: player,
	isRunning: false,
	timeZero: 0,
	timeSpent: 0,
	timerHandle: null,
	getTime: function(){
		return this.timeSpent + (this.isRunning ? (Date.now() - this.timeZero) : 0);
	},
	start: function(){
		this.isRunning = true;
		this.timeZero = Date.now();
	},
	stop: function(){
		this.timeSpent = this.getTime();
		this.isRunning = false;
	},
	reset: function(){
		this.isRunning = false;
		this.timeSpent = 0;
	}
}));

model.makeMoveString = (piece, cell, positions, face, lastCell) => {
	const mark = ["☗", "☖"][positions[piece.id].player];
	const cellName = cell.id == lastCell?.id ? "同" : cell.name;
	const otherCells = model.pieces.map(p => {
		if(p.entity.id == piece.entity.id && positions[p.id].player == positions[piece.id].player
			&& p.id != piece.id && ! positions[p.id].isOut && ! positions[p.id].isExcluded
			&& model.checkCanMove(p, cell, positions)){
			return model.getCell(positions[p.id].x, positions[p.id].y);
		}
		else return void 0;
	}).filter(c => c);
	const isPut = positions[piece.id].isOut;
	const canPromote = model.checkPromotion(piece, cell, positions)[1];
	const originalFace = positions[piece.id].face;
	const promotes = originalFace != face;
	const result = mark + cellName + piece.entity.shortNames[originalFace]
		+ (promotes ? "成" : "")
		+ (face == 0 && canPromote ? "不成" : "")
		+ (otherCells.length && ! isPut ? "(" + model.getCell(positions[piece.id].x, positions[piece.id].y).name + ")" : "")
		+ (otherCells.length && isPut ? "打" : "");
	if(result.length <= 3) return result.charAt(0) + result.charAt(1) + "　" + result.charAt(2);
	else return result;
	// 仮実装
}