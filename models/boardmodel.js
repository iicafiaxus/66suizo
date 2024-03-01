"REQUIRE models/model.js";

model.lines = [];
for(let player of [0, 1]){
	model.lines[player] = [];
	for(let piece of model.pieces){
		model.lines[player][piece.id] = [];
		for(let face of [0, 1]){
			model.lines[player][piece.id][face] = [];
			for(let cell0 of model.cells){
				if( ! model.lines[player][piece.id][face][cell0.x])  model.lines[player][piece.id][face][cell0.x] = [];
				model.lines[player][piece.id][face][cell0.x][cell0.y] = [];
				const lines = piece.entity.lines[face];
				for(let line of lines){
					const cells = [];
					for(let t of line){
						const x1 = cell0.x + t.dx * [1, -1][player];
						const y1 = cell0.y + t.dy * [1, -1][player];
						for(let cell of model.cells){
							if(x1 == cell.x && y1 == cell.y) cells.push(cell);
						}
					}
					model.lines[player][piece.id][face][cell0.x][cell0.y].push(cells);
				}
			}
		}
	}
}

const BoardState = function(positions, turn, history){
	this.positions = positions;
	this.turn = turn;
	this.history = history;

	this.occupiers = [];
	for(let cell of model.cells) this.occupiers.push(null);
	for(let piece of model.pieces){
		const pos = this.positions[piece.id];
		if(pos.isOut) continue;
		if(pos.isExcluded) continue;
		this.occupiers[model.getCell(pos.x, pos.y).id] = piece;
	}
}
BoardState.prototype.perform = function(move){
	this.turn = 1 - this.turn;
	this.history.push(move);
	if(move.main){
		this.positions[move.main.piece.id] = move.main.newPosition;
		const cell = model.getCell(move.main.newPosition.x, move.main.newPosition.y);
		const cellOld = model.getCell(move.main.oldPosition.x, move.main.oldPosition.y);
		this.occupiers[cell.id] = move.main.piece;
		if(cellOld) this.occupiers[cellOld.id] = null;
	}
	if(move.captured) this.positions[move.captured.piece.id] = move.captured.newPosition;
}
BoardState.prototype.revert = function(){
	this.turn = 1 - this.turn;
	const move = this.history.pop();
	if(move.main){
		this.positions[move.main.piece.id] = move.main.oldPosition;
		const cell = model.getCell(move.main.newPosition.x, move.main.newPosition.y);
		const cellOld = model.getCell(move.main.oldPosition.x, move.main.oldPosition.y);
		if(cellOld) this.occupiers[cellOld.id] = move.main.piece;
		this.occupiers[cell.id] = move.captured ? move.captured.piece : null;
	}
	if(move.captured){
		this.positions[move.captured.piece.id] = move.captured.oldPosition;
	}
}
BoardState.prototype.makeMoveLineString = function(moveLine){ // moveLine は直近の手が最後，現在盤面からのラインでないとバグる
	if( ! moveLine) return "";
	let moveStrings = [];
	let cell = null, lastCell = null;
	for(move of moveLine.toReversed()){
		cell = model.getCell(move.main.newPosition.x, move.main.newPosition.y);
		moveStrings.push(model.makeMoveString(move.main.piece, cell, this.positions, move.main.newPosition.face, lastCell));
		this.perform(move);
		lastCell = cell;
	}
	for(move of moveLine){
		this.revert(move);
	}
	return moveStrings.join(" ");
}

BoardState.prototype.scanMoves = function(){
	const moves = [];

	const isUsed = [];
	for(let piece of model.pieces){
		if(this.positions[piece.id].player != this.turn) continue;
		if(this.positions[piece.id].isExcluded) continue;
		if(this.positions[piece.id].isOut){
			if(isUsed[piece.entity.id]) continue;
			isUsed[piece.entity.id] = true;
			for(let cell of model.cells){
				if(this.occupiers[cell.id]) continue;
				if(this.turn == 0 && cell.x < piece.entity.forcePromotion) continue;
				if(this.turn == 1 && cell.x > 5 - piece.entity.forcePromotion) continue;
				if(piece.entity.occupiesColumn){
					if(model.pieces.find(p => 
						this.positions[p.id].y == cell.y && this.positions[p.id].player == this.turn &&
						p.entity == piece.entity && this.positions[p.id].face == 0
					)) continue;
				}
				moves.push({
					main: {
						piece,
						newPosition: { x: cell.x, y: cell.y, face: 0, player: this.turn,
							isOut: false, isExcluded: false },
						oldPosition: this.positions[piece.id],
					},
					likeliness: 0,
				});
			}
		}
		else{
			const lines = model.lines[this.turn][piece.id][
				this.positions[piece.id].face][this.positions[piece.id].x][this.positions[piece.id].y];
			for(let line of lines){
				for(let cell of line){
					if(this.positions[this.occupiers[cell.id]?.id]?.player == this.turn) break;
					const promo = model.checkPromotion(piece, cell, this.positions);
					moves.push({
						main: {
							piece,
							newPosition: { x: cell.x, y: cell.y, face: (promo[1] ? 1 : 0), player: this.turn,
								isOut: false, isExcluded: false },
							oldPosition: this.positions[piece.id],
						},
						captured: this.occupiers[cell.id] ? {
							piece: this.occupiers[cell.id],
							newPosition: { x: 0, y: 0, face: 0, player: this.turn,
								isOut: true, isExcluded: this.occupiers[cell.id].entity.isSingleUse },
							oldPosition: this.positions[this.occupiers[cell.id].id],
						} : null,
						likeliness: 0,
					});
					if(this.occupiers[cell.id]) break;
				}
			}
		}
	}
	return moves;
}

BoardState.prototype.makePositionString = function(){
	const grid = [];
	for(let x = 0; x < model.xSize; x ++){
		grid.push([]);
		for(let y = 0; y < model.ySize; y ++) grid.at(-1).push("　");
	}
	for(let piece of model.pieces){
		const pos = this.positions[piece.id];
		if( ! pos.isOut) grid[pos.x][pos.y] = piece.entity.shortNames[pos.face].charAt(0);
	}
	return grid.map(row => row.join("")).join("\n");
}