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

solver.calcOccupiers = (positions) => {
	const occupiers = [];
	for(let cell of model.cells)for (pos of positions){
		if(pos.x == cell.x && pos.y == cell.y){
			occupiers[cell.id] = pos.player;
		}
	}
	return occupiers;
}

// TODO: complexity concern
// TODO: position should point cell object
solver.scanMoves = (positions, player) => {
	const moves = [];
	const counts = [];
	for(let cell of model.cells) counts[cell.id] = 0;

	const occupiers = solver.calcOccupiers(positions);

	const isUsed = [];
	for(let piece of model.pieces){
		if(positions[piece.id].player != player) continue;
		if(positions[piece.id].isExcluded) continue;
		if(positions[piece.id].isOut){
			if(isUsed[piece.entity.id]) continue;
			isUsed[piece.entity.id] = true;
			for(let cell of model.cells){
				if(occupiers[cell.id] >= 0) continue;
				if(player == 0 && cell.x < piece.entity.forcePromotion) continue;
				if(player == 1 && cell.x > 5 - piece.entity.forcePromotion) continue;
				if(piece.entity.occupiesColumn){
					if(model.pieces.find(p => 
						positions[p.id].y == cell.y && positions[p.id].player == player &&
						p.entity == piece.entity && positions[p.id].face == 0
					)) continue;
				}
				moves.push({ piece, cell, face: 0 });
			}
		}
		else{
			const lines = solver.lines[player][piece.id][
				positions[piece.id].face][positions[piece.id].x][positions[piece.id].y];
			for(let line of lines){
				for(let cell of line){
					counts[cell.id] += 1;
					if(occupiers[cell.id] == player) break;
					const promo = model.checkPromotion(piece, cell, positions);
					if(promo[1]) moves.push({ piece, cell, face: 1 });
					else moves.push({ piece, cell, face: 0 });
					if(occupiers[cell.id] == 1 - player) break;
				}
			}
		}
	}

	return { moves, counts };
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
solver.count = 0;
solver.EvaluationItem = function(positions, turn, depth, parent = null, move){
	solver.count += 1;
	this.positions = positions;
	this.turn = turn;
	this.depth = depth;
	this.parent = parent;
	this.move = move;
	this.value = [10001, -10001][turn];
	this.nextItem = null;
	this.waitCount = 0;
	this.queue = new Util.PriorityQueue();
	// TODO: value should have uncertainity range
}
solver.EvaluationItem.prototype.update = function(kid){
	if( ! this.parent && globalThis.DEBUG) console.log(solver.makeLineString(kid), "(" + kid.value + ")");
	this.queue.push(kid, solver.calcPositionKey(kid.positions, kid.turn),
		(this.turn == 0 ? (kid.value + 10000) : (10000 - kid.value))
	);
	if(this.queue.peek().item.value != this.value){
		if(this.nextItem == kid && this.queue.peek().item != kid){
			this.killerMove = kid.nextItem?.move;
			if( ! this.parent && globalThis.DEBUG) console.log("!", solver.moveToString(this.killerMove, this.turn));
		}
		this.nextItem = this.queue.peek().item;
		this.setValue(this.nextItem.value);
	}
}
solver.EvaluationItem.prototype.setValue = function(value){
	this.value = value;
	if(this.parent && this.waitCount == 0) this.parent.update(this);
	if( ! this.parent && globalThis.DEBUG){
		const bestMoveString = solver.makeLineString(solver.rootItem.nextItem);
		console.log("【最善手】", bestMoveString, "(" + solver.rootItem?.value + ")");
	}
}
solver.EvaluationItem.prototype.addWait = function(){
	this.waitCount += 1;
}
solver.EvaluationItem.prototype.removeWait = function(){
	this.waitCount -= 1;
	if(this.waitCount == 0 && this.parent) this.parent.update(this);
}


solver.makeLineString = (item) => {
	let s = "";
	for(let c = item; c && c.move; c = c.nextItem){
		s += " " + model.makeMoveString(c.move.piece, c.move.cell,
			c.positions, c.move.face, c.parent?.move?.cell);
	}
	return s;
}


// TODO: priority queue
// TODO: prune
// TODO: pause for time or count
// TODO: break for time or count
solver.initEvaluation = (callback, positions, turn, depth = 3) => {
	const rootItem = new solver.EvaluationItem(positions, turn, depth, null, null);
	solver.queue = new Util.Queue();
	solver.queue.push(rootItem);
	solver.rootItem = rootItem;
	solver.callback = callback;
	solver.evaluateFromQueue();
}
solver.evaluateFromQueue = () => {
	let count = 0;
	while(solver.queue.getLength() > 0 && ++count < 500){
		const item = solver.queue.popStack();
		if(item.parent) item.parent.removeWait();
		if(item.parent && item.parent.parent){
			// pruning; note: this works only when using stack.
			if(
				item.turn == 0 && (item.parent.value >= 10000 || item.parent.value > item.parent.parent.value) ||
				item.turn == 1 && (item.parent.value <= -10000 || item.parent.value < item.parent.parent.value)
			){
				continue;
			}
		}
		if(item.depth == 0 || model.checkWinner(item.positions)){
			item.setValue(solver.evaluate(item.positions));
		}
		else{
			const moves = solver.scanMoves(item.positions, 1 - item.turn).moves;
			count += moves.length;
			let xs = moves.map(move => {
				const newPositions = solver.reducePositions(item.positions, move);
				const likeliness = solver.calcLikeliness(item.positions, move, newPositions);
				return { move, newPositions, likeliness };				
			});
			const killerMove = item.parent?.parent?.killerMove;
			const killer = xs.find(x => x.move.piece.id == killerMove?.piece?.id && x.move.cell.id == killerMove?.cell?.id);
			if(solver.queue.getLength() > 4000){
				xs = xs.filter(x => x.likeliness * item.depth >= 200);
			}
			if(xs.length == 0){
				item.setValue(solver.evaluate(item.positions));
			}
			else{
				xs.sort((a, b) => a.likeliness - b.likeliness); // because now it is stack
				for(let x of xs){
					solver.queue.push(new solver.EvaluationItem(x.newPositions, 1 - item.turn, item.depth - 1, item, x.move));
					item.addWait();
				}
				if(killer){
					solver.queue.push(new solver.EvaluationItem(killer.newPositions, 1 - item.turn, item.depth - 1, item, killer.move));
					item.waitCount += 1;
				}
			}
		}
	}
	const more = solver.callback(solver.rootItem?.nextItem, solver.queue.getLength());
	if(solver.queue.getLength() > 0 && more) setTimeout(solver.evaluateFromQueue, 0);
}

solver.worthiness = [
	[10, 0], // king
	[8, 10], // queen
	[4, 6], // rook
	[4, 6], // bishop
	[3, 4], // silver
	[1, 4], // pawn
];

solver.calcLikeliness = (positions, move, newPositions) => {
	let likeliness = 0;
	const turn = positions[move.piece.id].player;

	// capture something
	for(let p of model.pieces){
		if(positions[p.id].player == 1 - turn && newPositions[p.id].player == turn){
			likeliness += 100 * solver.worthiness[p.entity.id][positions[p.id].face];
		}
	}

	// TODO: do not calc every time
	const scans = [0, 1].map(turn => solver.scanMoves(positions, turn));
	const newScans = [0, 1].map(turn => solver.scanMoves(newPositions, turn));
	const occupiers = solver.calcOccupiers(positions);
	const newOccupiers = solver.calcOccupiers(newPositions);

	for(let cell of model.cells){

		// remove opponent domination
		if(
			scans[turn].counts[cell.id] < scans[1 - turn].counts[cell.id] &&
			occupiers[cell.id] === turn
		){
			if(
				newScans[turn].counts[cell.id] >= newScans[1 - turn].counts[cell.id] ||
				occupiers[cell.id] !== turn
			){
				likeliness += 50 * solver.worthiness[p.entity.id][positions[p.id].face];
			}
		}

		// make domination
		if(
			newScans[turn].counts[cell.id] > newScans[1 - turn].counts[cell.id] &&
			newOccupiers === 1 - turn
		){
			if(scans[turn].counts[cell.id] >= scans[1 - turn].counts[cell.id]){
				likeliness += 25 * solver.worthiness[p.entity.id][positions[p.id].face];
			}
		}
	}

	return likeliness;

}


// TODO: improve
// TODO: memoize
solver.evaluationCounter = 0;
solver.evaluate = (positions) => {
	const winner = model.checkWinner(positions);
	if(winner){
		if(winner.player == 0) return 10000; else return -10000;
	}
	const scan0 = solver.scanMoves(positions, 0);
	const scan1 = solver.scanMoves(positions, 1);

	let value = 0;
	for(let c of model.cells){
		if(scan0.counts[c.id] > scan1.counts[c.id]) value += 100;
		else if(scan0.counts[c.id] < scan1.counts[c.id]) value -= 100.;
	}
	for(let p of model.pieces){
		if(positions[p.id].isExcluded) continue;
		if(positions[p.id].player == 0) value += 100 * solver.worthiness[p.entity.id][positions[p.id].face];
		else value -= 100 * solver.worthiness[p.entity.id][positions[p.id].face];
	}

	solver.evaluationCounter += 1;
	return value;
}

solver.isWorking = false;
solver.solve = (positions, turn, onFound, onUpdated) => {
	console.log("考えています…");
	solver.count = 0;
	solver.isWorking = true;
	solver.initEvaluation(
		(item, length) => {
			if( ! solver.isWorking) return false;
			if(length == 0){
				const bestMoveString = solver.makeLineString(solver.rootItem.nextItem);
				console.log("読み筋 :" + bestMoveString, "(" + solver.rootItem?.value + ") " + solver.count);
				if(item?.move && (item.turn == 0 && item.value > -5000 || item.turn == 1 && item.value < 5000)){
					onFound(item.move);
				}
				else onFound(null);
			}
			else{
				onUpdated({ move: item?.move, value: item?.value });
				return true;
			}
			return false;
		},
		positions,
		1 - turn,
		4
	);
}
solver.cancel = () => {
	console.log("中断しました。");
	solver.isWorking = false;
}

solver.moveToString = (move, player) => {
	if( ! move) return "(null)";
	if( ! move.piece || ! move.cell) return "(" + move.piece + ", " + move.cell + ")";
	return (["☗", "☖"][player ?? move.player] ?? "-") + move.cell.name + move.piece.entity.names[move.face] + move.piece.id;
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