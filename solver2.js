"REQUIRE models/model.js";
"REQUIRE util.js";

solver.current = null;
solver.initEvaluation2 = (onFound, positions, turn, lastMove, lastMove2, depth = 4) => {
	solver.current = { positions, turn, depth, bestMoveLine: [] };
	//solver.antimoveStack = [];
	//solver.queue = new Util.Queue();
	//solver.evaluationStack = new Util.Queue();
	// スタックはコールスタックでやるのでいらない →　それだと中断できない…
	// あとで書き直す
	const [value, moveLine] = solver.evaluateRecursive(-10000, 10000, lastMove, lastMove2);
	console.log("読み筋 : " + solver.makeMoveLineString(moveLine) + " (" + value + ")");
	onFound(moveLine && moveLine.at(-1));
}
solver.evaluateRecursive = (min, max, lastMove = null, lastMove2 = null) => {
	if(solver.current.depth == 0 || model.checkWinner(solver.current.positions)){
		return [solver.evaluate(solver.current.positions), []];
	}
	else{
		const moves = solver.scanMoves2(solver.current.positions, solver.current.turn, lastMove, lastMove2).moves;
		if(moves.length == 0){
			return [-10000, 10000][solver.current.turn]; // 合法手が無いので負け
		}
		else{
			moves.sort((a, b) => b.likeliness - a.likeliness); 
			//console.log("候補手", moves.map(move => solver.makeMoveLineString([move]) + "[" + move.likeliness + "]").join(", "));
			let value = solver.current.turn ? max : min;
			let line = [];
			for(let move of moves){
				// console.groupCollapsed(solver.makeMoveLineString([x.move]));
				if(solver.current.turn == 0){
					solver.perform(move);
					const [v, l] = solver.evaluateRecursive(value, max, move, lastMove);
					if(v > value){
						value = v;
						line = [ ...l, move];
					}
					solver.restore(move);
					if(value > max) break;
				}
				else{
					solver.perform(move);
					const [v, l] = solver.evaluateRecursive(min, value, move, lastMove);
					if(v < value){
						value = v;
						line = [ ...l, move];
					}
					solver.restore(move);
					if(value < min) break;
				}
				// console.log(v);
				// console.groupEnd() // ループとの位置関係に注意
			}
			// console.log(solver.makeMoveLineString(line) + " (" + value + ")");
			return [value, line];
		}
	}
}


// position = { x, y, face, player, isOut, isExcluded }
// move = { main: { piece, newPosition, oldPosition }, captured: { piece, newPosition, oldPosition } | null, likeliness }

solver.perform = (move) => {
	solver.current.turn = 1 - solver.current.turn;
	solver.current.depth -= 1;
	if(move.main) solver.current.positions[move.main.piece.id] = move.main.newPosition;
	if(move.captured) solver.current.positions[move.captured.piece.id] = move.captured.newPosition;
}
solver.restore = (move) => {
	solver.current.turn = 1 - solver.current.turn;
	solver.current.depth += 1;
	if(move.main) solver.current.positions[move.main.piece.id] = move.main.oldPosition;
	if(move.captured) solver.current.positions[move.captured.piece.id] = move.captured.oldPosition;
}
solver.makeMoveLineString = (moveLine) => {
	if( ! moveLine) return "";
	let moveStrings = [];
	let cell = null, lastCell = null;
	for(move of moveLine.toReversed()){
		cell = model.getCell(move.main.newPosition.x, move.main.newPosition.y);
		moveStrings.push(model.makeMoveString(move.main.piece, cell, solver.current.positions, move.main.newPosition.face, lastCell));
		solver.perform(move);
		lastCell = cell;
	}
	for(move of moveLine){
		solver.restore(move);
	}
	return moveStrings.join(" ");
}

solver.calcOccupiers = (positions) => { // FIXME: complexity
	const occupiers = [];
	for(let piece of model.pieces){
		const pos = positions[piece.id];
		if(pos.isOut) continue;
		if(pos.isExcluded) continue;
		occupiers[model.getCell(pos.x, pos.y).id] = piece;
	}
	return occupiers;
}
solver.scanMoves2 = (positions, turn, lastMove, lastMove2) => {
	const moves = [];
	const counts = [];
	for(let cell of model.cells) counts[cell.id] = 0;

	const occupiers = solver.calcOccupiers(positions); // これが piece を返すようにする

	const isUsed = [];
	for(let piece of model.pieces){
		if(positions[piece.id].player != turn) continue;
		if(positions[piece.id].isExcluded) continue;
		if(positions[piece.id].isOut){
			if(isUsed[piece.entity.id]) continue;
			isUsed[piece.entity.id] = true;
			for(let cell of model.cells){
				if(occupiers[cell.id]) continue;
				if(turn == 0 && cell.x < piece.entity.forcePromotion) continue;
				if(turn == 1 && cell.x > 5 - piece.entity.forcePromotion) continue;
				if(piece.entity.occupiesColumn){
					if(model.pieces.find(p => 
						positions[p.id].y == cell.y && positions[p.id].player == turn &&
						p.entity == piece.entity && positions[p.id].face == 0
					)) continue;
				}
				moves.push({
					main: {
						piece,
						newPosition: { x: cell.x, y: cell.y, face: 0, player: turn, isOut: false, isExcluded: false },
						oldPosition: positions[piece.id],
					},
					likeliness: 0,
				});
			}
		}
		else{
			const lines = solver.lines[turn][piece.id][
				positions[piece.id].face][positions[piece.id].x][positions[piece.id].y];
			for(let line of lines){
				for(let cell of line){
					counts[cell.id] += 1;
					if(positions[occupiers[cell.id]?.id]?.player == turn) break;
					const promo = model.checkPromotion(piece, cell, positions);
					moves.push({
						main: {
							piece,
							newPosition: { x: cell.x, y: cell.y, face: (promo[1] ? 1 : 0), player: turn, isOut: false, isExcluded: false },
							oldPosition: positions[piece.id],
						},
						captured: occupiers[cell.id] ? {
							piece: occupiers[cell.id],
							newPosition: { x: 0, y: 0, face: 0, player: turn, isOut: true, isExcluded: occupiers[cell.id].entity.isSingleUse },
							oldPosition: positions[occupiers[cell.id].id],
						} : null,
						likeliness: 0,
					});
					if(occupiers[cell.id]) break;
				}
			}
		}
	}

	for(let move of moves){
		if(move.captured) move.likeliness +=
			100 * solver.worthiness[move.captured.piece.entity.id][move.captured.oldPosition.face];
		move.likeliness +=
			100 * solver.worthiness[move.main.piece.entity.id][move.main.newPosition.face]
			- 100 * solver.worthiness[move.main.piece.entity.id][move.main.oldPosition.face];
		if(lastMove && move.captured && move.captured.piece.id == lastMove.main.piece.id) move.likeliness += 1000;
		if(lastMove2 && move.main.piece.id == lastMove2.main.piece.id) move.likeliness += 900;
		if(lastMove2?.captured && move.main.piece.id == lastMove2.captured.piece.id) move.likeliness += 800;
	}

	return { moves, counts };
}




solver.isWorking = false;
solver.solve = (positions, turn, onFound, onUpdated, moveLine = []) => {
	/*
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
	*/
	console.log(moveLine);
	solver.initEvaluation2(onFound, positions, turn, moveLine.at(-1), moveLine.at(-2));
}
solver.cancel = () => {
	console.log("中断しました。");
	solver.isWorking = false;
}
