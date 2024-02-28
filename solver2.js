"REQUIRE models/model.js";
"REQUIRE util.js";
"REQUIRE solver.js";

solver.current = null;
solver.initEvaluation2 = (onFound, onUpdated, positions, turn, lastMove, lastMove2, depth = 4) => {
	solver.current = { positions, turn, depth, bestMoveLine: [], history: [lastMove, lastMove2] };
	solver.counter = 0;
	console.log(solver.makePositionString(solver.current.positions));
	solver.onEnd = (value, moveLine) => {
		console.log("読み筋 : " + solver.makeMoveLineString(moveLine) + " (" + value + ")");
		solver.isWorking = false;
		onFound(moveLine && moveLine.at(-1));
	};
	solver.onUpdated = (param) => {
		onUpdated(param);
	}
	solver.stack = [{
		turn, move: {}, queue: null, value: turn ? 10000 : -10000, min: -10000, max: 10000, 
		bestLine: [], parent: null
	}];
	solver.evaluateFromStack();
}
// stackItem: { queue: Util.Queue(move), value, min, max, history };

/*
TODO
・劣後度（優先度トップとの差）の累積が大きい手は無視する（捨てる手のとき）

・initEvaluation2等の引数を見直す

*/

solver.maxDepth = 6;
solver.evaluateFromStack = () => {
	for(let cnt = 0; cnt < 5000; cnt ++){
		const item = solver.stack.at(-1);
		const { turn, move, queue, value, min, max, bestLine, parent } = item;
		if( ! queue){ // 上から進んできて候補手の生成前
			const check = model.checkWinner(solver.current.positions);
			if(check){ 
				item.value = [10000, -10000][check.player];
				item.bestLine = [];
				solver.revert(move);
				if(globalThis.DEBUG){
					console.groupEnd();
					console.log("　".repeat(solver.stack.length), solver.makeMoveLineString([move]), ":", item.value);
				}
				solver.stack.pop();
				if(parent.turn == 0 && v > parent.value || parent.turn == 1 && v < parent.value){
					parent.value = v;
					parent.bestLine = [move];
					if(parent.value > parent.max || parent.value < parent.min){
						//item.queue.flush();
						parent.queue.flush();
					}
				}
				// TODO: 分岐を整理したい（同じ処理が3個ある）しかもこの処理は parent に属するべきと思われる
				// min, max ではなく直接 parent?.value や parent?.parent?.value を参照するでも良いかも
			}
			else if(solver.stack.length < solver.maxDepth){ // 下に余裕がある（候補手を作成する）
				if(globalThis.DEBUG){
					console.log(solver.makePositionString(solver.current.positions));
					console.log({min, max});
				}
				const nextMoves = solver.scanMoves2(solver.current.positions, solver.current.turn,
					solver.current.history.at(-1), solver.current.history.at(-2)).moves;
				if(solver.stack.length == 1){
					for(let m of nextMoves) m.name = solver.makeMoveLineString([m]);
				}
				item.queue = new Util.Queue(nextMoves);
				continue;
			}
			else{ // 下に進めない（静的評価をする）
				item.value = solver.evaluate(solver.current.positions);
				item.bestLine = [];
				solver.revert(move);
				if(globalThis.DEBUG){
					console.groupEnd();
					console.log("　".repeat(solver.stack.length), solver.makeMoveLineString([move]), ":", item.value);
				}
				solver.stack.pop();
				if(parent.turn == 0 && v > parent.value || parent.turn == 1 && v < parent.value){
					parent.value = v;
					parent.bestLine = [move];
					if(parent.value > parent.max || parent.value < parent.min){
						//item.queue.flush();
						parent.queue.flush();
					}
				}
			}
		}
		else if(queue.peek()){ // 未検討の候補手がある状態
			const move = queue.pop();
			if(globalThis.DEBUG){
				console.groupCollapsed("　".repeat(solver.stack.length), solver.stack.length,
					solver.makeMoveLineString([move]), "[" + move.likeliness + "]");
			}
			solver.perform(move);
			solver.counter += 1;
			solver.stack.push({
				turn: 1 - turn, move, queue: null, value: turn ? min : max,
				min: turn ? min : value, max: turn ? value : max, bestLine, parent: item
			});
			continue;
		}
		else{ // 候補手の検討が終わった状態
			if( ! parent){ // 上に戻れない（評価を終了して結果を返す）
				solver.onEnd(value, bestLine);
				return;
			}
			else{ // 上に戻る
				if(globalThis.DEBUG){
					console.log("　".repeat(solver.stack.length), solver.makeMoveLineString(bestLine), ":", value);
				}
				solver.revert(move);
				if(globalThis.DEBUG){
					console.groupEnd();
				}
				solver.stack.pop();
			}
		}
		if(parent?.turn == 0 && item.value > parent.value || parent?.turn == 1 && item.value < parent.value){
			parent.value = item.value;
			parent.bestLine = [...item.bestLine, move];
					if(parent.value > parent.max || parent.value < parent.min){
				item.queue?.flush();
						parent.queue.flush();
			}
		}
	}
	if(solver.isWorking){
		solver.onUpdated({
			counter: solver.counter,
			move: solver.stack[1]?.move,
			bestMove: solver.stack[0]?.bestLine?.at(-1),
			value: solver.stack[0]?.value
		});
		window.setTimeout(() => solver.evaluateFromStack(), 0);
	}
	else solver.onUpdated({ message: "中断しました。" });
}
solver.evaluateRecursive2 = (min, max, lastMove, lastMove2, onEnd) => {
	if(solver.current.depth == 0 || model.checkWinner(solver.current.positions)){
		onEnd(solver.evaluate(solver.current.positions), []);
		return;
	}
	const moves = solver.scanMoves2(solver.current.positions, solver.current.turn, lastMove, lastMove2).moves;
	if(moves.length == 0){
		onEnd([-10000, 10000][solver.current.turn], []);
		return;
	}
	else{
		moves.sort((a, b) => b.likeliness - a.likeliness);
		let value = solver.current.turn ? max : min;
		let line = [];
		for(let move of moves){
			if(solver.current.turn == 0){
				solver.perform(move);
				solver.evaluateRecursive2(value, max, move, lastMove, (v, l) => {
					if(v > value) [value, line] = [v, [...l, move]];
					solver.revert(move);
					// if(value > max) queue.clear();
				});
			}
			else{
				solver.perform(move);
				solver.evaluateRecursive2(min, value, move, lastMove, (v, l) => {
					if(v < value) [value, line] = [v, [...l, move]];
					solver.revert(move);
					// if(value > max) queue.clear();
				});
			}
		}
		onEnd(value, line);
		return;
	}

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
					solver.revert(move);
					if(value > max) break;
				}
				else{
					solver.perform(move);
					const [v, l] = solver.evaluateRecursive(min, value, move, lastMove);
					if(v < value){
						value = v;
						line = [ ...l, move];
					}
					solver.revert(move);
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


/*
	position = { x, y, face, player, isOut, isExcluded }
	move = {
		main: { piece, newPosition, oldPosition },
		captured: { piece, newPosition, oldPosition } | null,
		likeliness,
		name: string | undefined
	}
*/

solver.perform = (move) => {
	solver.current.turn = 1 - solver.current.turn;
	solver.current.depth -= 1;
	solver.current.history.push(move);
	if(move.main) solver.current.positions[move.main.piece.id] = move.main.newPosition;
	if(move.captured) solver.current.positions[move.captured.piece.id] = move.captured.newPosition;
}
solver.revert = (/*move*/) => {
	solver.current.turn = 1 - solver.current.turn;
	solver.current.depth += 1;
	const move = solver.current.history.pop(); // TODO: use popped move
	if(move.main) solver.current.positions[move.main.piece.id] = move.main.oldPosition;
	if(move.captured) solver.current.positions[move.captured.piece.id] = move.captured.oldPosition;
}
solver.makeMoveLineString = (moveLine) => { // 現在盤面からのラインでないとバグるので注意
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
		solver.revert(move);
	}
	return moveStrings.join(" ");
}
solver.makePositionString = (positions) => {
	const grid = [];
	for(let x = 0; x < model.xSize; x ++){
		grid.push([]);
		for(let y = 0; y < model.ySize; y ++) grid.at(-1).push("　");
	}
	for(let piece of model.pieces){
		const pos = positions[piece.id];
		if( ! pos.isOut) grid[pos.x][pos.y] = piece.entity.shortNames[pos.face].charAt(0);
	}
	return grid.map(row => row.join("")).join("\n");
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
		if(lastMove && move.captured && move.captured.piece.id == lastMove.main.piece.id) move.likeliness += 120;
		if(lastMove2 && move.main.piece.id == lastMove2.main.piece.id) move.likeliness += 70;
		if(lastMove2?.captured && move.main.piece.id == lastMove2.captured.piece.id) move.likeliness += 40;
	}

	return { moves, counts };
}




solver.isWorking = false;
solver.solve = (positions, turn, onFound, onUpdated, moveLine = []) => {
	solver.isWorking = true;
	solver.initEvaluation2(onFound, onUpdated, positions, turn, moveLine.at(-2), moveLine.at(-1));
}
solver.cancel = () => {
	console.log("中断しました。");
	solver.isWorking = false;
}
