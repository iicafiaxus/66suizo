"REQUIRE models/model.js";

model.lines = [0, 1].map(player => 
	model.pieces.map(piece =>
		[0, 1].map(face => 
			model.cells.map(cell0 =>
				piece.entity.lines[face].map(line => {
					const cells = [];
					for(let t of line){
						const x1 = cell0.x + t.dx * [1, -1][player];
						const y1 = cell0.y + t.dy * [1, -1][player];
						for(let cell of model.cells){
							if(x1 == cell.x && y1 == cell.y) cells.push(cell);
						}
					}
					return cells;
				})
			)
		)
	)
)
// model.lines[player][piece.id][face][cell.id] : cell[][]

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
		this.occupiers[pos.cell.id] = piece;
	}

	this.lives = [0, 0];
	for(let piece of model.pieces){
		const pos = positions[piece.id];
		if( ! pos.isOut && ! pos.isExcluded){
			this.lives[pos.player] += piece.entity.life[pos.face];
		}
	}
}
BoardState.prototype.getWinner = function(){
	return this.lives[0] ? this.lives[1] ? -1 : 0 : 1;
}
BoardState.prototype.perform = function(move){
	this.history.push(move);
	if(move.main){
		this.positions[move.main.piece.id] = move.main.newPosition;

		const cell = move.main.newPosition.cell;
		this.occupiers[cell.id] = move.main.piece;
		this.lives[this.turn] += move.main.piece.entity.life[move.main.newPosition.face];
		
		const cellOld = move.main.oldPosition.cell;
		if(cellOld && ! move.main.oldPosition.isOut){
			this.occupiers[cellOld.id] = null;
			this.lives[this.turn] -= move.main.piece.entity.life[move.main.oldPosition.face];
		}
	}
	if(move.captured){
		this.positions[move.captured.piece.id] = move.captured.newPosition;
		this.lives[1 - this.turn] -= move.captured.piece.entity.life[move.captured.oldPosition.face];
	}
	this.turn = 1 - this.turn;
}
BoardState.prototype.revert = function(){
	this.turn = 1 - this.turn;
	const move = this.history.pop();
	if(move.main){
		this.positions[move.main.piece.id] = move.main.oldPosition;

		const cell = move.main.newPosition.cell;
		this.occupiers[cell.id] = move.captured ? move.captured.piece : null;
		this.lives[this.turn] -= move.main.piece.entity.life[move.main.newPosition.face];

		const cellOld = move.main.oldPosition.cell;
		if(cellOld && ! move.main.oldPosition.isOut && ! move.main.oldPosition.isExcluded){
			this.occupiers[cellOld.id] = move.main.piece;
			this.lives[this.turn] += move.main.piece.entity.life[move.main.oldPosition.face];
		}
	}
	if(move.captured){
		this.positions[move.captured.piece.id] = move.captured.oldPosition;
		this.lives[1 - this.turn] += move.captured.piece.entity.life[move.captured.oldPosition.face];
	}
}
BoardState.prototype.makeMoveLineString = function(moveLine){ // moveLine は直近の手が最後，現在盤面からのラインでないとバグる
	if( ! moveLine) return "";
	let moveStrings = [];
	let cell = null, lastCell = null;
	for(move of moveLine.toReversed()){
		cell = move.main.newPosition.cell;
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
						this.positions[p.id].cell?.y == cell.y &&
						this.positions[p.id].player == this.turn &&
						p.entity == piece.entity && this.positions[p.id].face == 0
					)) continue;
				}
				moves.push({
					main: {
						piece,
						newPosition: { cell, face: 0, player: this.turn,
							isOut: false, isExcluded: false },
						oldPosition: this.positions[piece.id],
					},
					likeliness: 0,
				});
			}
		}
		else{
			const lines = model.lines[this.turn][piece.id][
				this.positions[piece.id].face][this.positions[piece.id].cell.id];
			for(let line of lines){
				for(let cell of line){
					if(this.positions[this.occupiers[cell.id]?.id]?.player == this.turn) break;
					const promo = model.checkPromotion(piece, cell, this.positions);
					moves.push({
						main: {
							piece,
							newPosition: { cell, face: (promo[1] ? 1 : 0), player: this.turn,
								isOut: false, isExcluded: false },
							oldPosition: this.positions[piece.id],
						},
						captured: this.occupiers[cell.id] ? {
							piece: this.occupiers[cell.id],
							newPosition: { cell: null, face: 0, player: this.turn,
								isOut: true, isExcluded: !!this.occupiers[cell.id].entity.isSingleUse },
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
		if( ! pos.isOut) grid[pos.cell.x][pos.cell.y] = piece.entity.shortNames[pos.face].charAt(0);
	}
	return grid.map(row => row.join("")).join("\n");
}