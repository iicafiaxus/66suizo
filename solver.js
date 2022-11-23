"REQUIRE models/model.js";
"REQUIRE util.js";

const solver = {};

solver.lines = [];
for(let player of [0, 1]){
	solver.lines[player] = [];
	for(let piece of model.pieces){
		solver.lines[player][piece.id] = [];
		for(let face of [0, 1]){
			solver.lines[player][piece.id][face] = [];
			for(let cell0 of model.cells){
				if( ! solver.lines[player][piece.id][face][cell0.x])  solver.lines[player][piece.id][face][cell0.x] = [];
				solver.lines[player][piece.id][face][cell0.x][cell0.y] = [];
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
					solver.lines[player][piece.id][face][cell0.x][cell0.y].push(cells);
				}
			}
		}
	}
}

// TODO: complexity concern
// TODO: position should point cell object
solver.makePossibleMoves = (positions, player) => {
	const moves = [];

	const occupiers = [];
	for(let cell of model.cells)for (pos of positions){
		if(pos.x == cell.x && pos.y == cell.y){
			occupiers[cell.id] = pos.player;
		}
	}

	for(let piece of model.pieces){
		if(positions[piece.id].player != player) continue;
		if(positions[piece.id].isOut){
			for(let cell of model.cells){
				if(occupiers[cell.id] >= 0) continue;
				if(player == 0 && cell.x < piece.entity.forcePromotion) continue;
				if(player == 1 && cell.x > 5 - piece.entity.forcePromotion) continue;
				if(piece.entity.occupiesColumn){
					if(model.pieces.find(p => 
						positions[p.id].y == cell.y && positions[p.id].player == player &&
						p.entity == piece.entity
					)) continue;
				}
				moves.push({ piece, cell, face: 0 });
			}
		}
		else{
			const lines = solver.lines[player][piece.id][positions[piece.id].face][positions[piece.id].x][positions[piece.id].y];
			for(let line of lines){
				for(let cell of line){
					if(occupiers[cell.id] == player) break;
					const promo = model.checkPromotion(piece, cell, positions);
					if(promo[1]) moves.push({ piece, cell, face: 1 });
					else moves.push({ piece, cell, face: 0 });
					if(occupiers[cell.id] == 1 - player) break;
				}
			}
		}
	}

	return moves;
}

// TODO: Integrate with Game.move
// TODO: Recognize nonpromoting move
// TODO: cell to piece
solver.reducePositions = (positions, move) => {
	const resultPositions = [];
	for(let p of model.pieces){
		if(positions[p.id].x == move.cell.x && positions[p.id].y == move.cell.y){
			resultPositions[p.id] = {
				...positions[p.id],
				isOut: true,
				player: positions[move.piece.id].player,
				isExcluded: p.entity.isSingleUse
			}
		}
		else resultPositions[p.id] = { ...positions[p.id] };
	}
	resultPositions[move.piece.id] = {
		...positions[move.piece.id],
		x: move.cell.x,
		y: move.cell.y,
		face: move.face,
	}
	return resultPositions;
}

solver.calcBestMove = (positions, turn) => {
	const rootItem = solver.evaluateDeep(null, positions, 1 - turn, 2);
	return { move: rootItem.nextItem?.move ?? null, value: rootItem.value };
}

// TODO: have multiple parents
solver.EvaluationItem = function(positions, turn, depth, parent = null, move){
	this.positions = positions;
	this.turn = turn;
	this.depth = depth;
	this.parent = parent;
	this.move = move;
	this.value = [10000, -10000][turn];
	this.nextItem = null;
	this.queue = new Util.PriorityQueue();
	// TODO: value should have uncertainity range
}
solver.EvaluationItem.prototype.update = function(kid){
	this.queue.push(kid, solver.calcPositionKey(kid.positions, kid.turn),
		(this.turn == 0 ? (kid.value + 10000) : (10000 - kid.value))
	);
	if(this.queue.peek().item.value != this.value){
		this.nextItem = this.queue.peek().item;
		if(globalThis.DEBUG) console.log(this.depth, solver.moveToString(this.move), this.value, kid.value, this.turn,
			this.queue.toArray().map(x => `${solver.moveToString(x.item.move)}(${x.item.value})`));
		this.setValue(this.nextItem.value);
	}
}
solver.EvaluationItem.prototype.setValue = function(value){
	this.value = value;
	if(globalThis.DEBUG) console.log(this.depth, solver.moveToString(this.move), this.value);
	if(this.parent) this.parent.update(this);
}


// TODO: priority queue
// TODO: prune
// TODO: pause for time or count
// TODO: break for time or count
solver.evaluateDeep = (move, positions, turn, depth = 3) => {
	const queue = new Util.Queue();
	const rootItem = new solver.EvaluationItem(positions, turn, depth, null, move);
	queue.push(rootItem);
	while(queue.getLength() > 0){
		const item = queue.pop();
		if(item.depth == 0){
			item.setValue(solver.evaluate(item.positions));
		}
		else{
			const moves = solver.makePossibleMoves(item.positions, 1 - item.turn);
			for(let move of moves){
				const movedPositions = solver.reducePositions(item.positions, move);
				queue.push(new solver.EvaluationItem(movedPositions, 1 - item.turn, item.depth - 1, item, move));
			}
		}
	}
	return rootItem;
}


// TODO: improve
// TODO: memoize
solver.evaluationCounter = 0;
solver.evaluate = (positions) => {
	const winner = model.checkWinner(positions);
	if(winner){
		if(winner.player == 0) return 10000; else return -10000;
	}
	const moveCounts = [0, 1].map(t => solver.makePossibleMoves(positions, t).length);
	solver.evaluationCounter += 1;
	return (moveCounts[0] - moveCounts[1]) * 100;
}

solver.solve = (positions, turn, onFound) => {
	solver.evaluationCounter = 0;
	const bestMove = solver.calcBestMove(positions, turn).move;
	console.log("solver found", solver.moveToString(bestMove), "out of", solver.evaluationCounter);
	onFound(bestMove);
}

solver.cellToString = (cell) => {
	return "" + (6 - cell.y) + ["一", "二", "三", "四", "五", "六"][cell.x];
}

solver.moveToString = (move) => {
	if( ! move) return "(null)";
	if( ! move.piece || ! move.cell) return "(" + move.piece + ", " + move.cell + ")";
	return solver.cellToString(move.cell) + move.piece.entity.names[move.face] + move.piece.id;
}

solver.calcPositionKey = (positions, turn) => {
	let key ="";
	for(let piece of model.pieces){
		const pos = positions[piece.id];
		key += "" + pos.x + pos.y + pos.face + pos.player + ",";
	}
	key += turn;
	return key;
}