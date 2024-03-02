"REQUIRE models/model.js";
"REQUIRE models/boardmodel.js";
"REQUIRE util.js";

const solver = {};

solver.isWorking = false;
solver.solve = (positions, turn, onFound, onUpdated, history = []) => {
	solver.isWorking = true;
	solver.initEvaluation(onFound, onUpdated, positions, turn, history);
}
solver.cancel = () => {
	console.log("中断しました。");
	solver.isWorking = false;
}

solver.current = null;
solver.initEvaluation = (onFound, onUpdated, positions, turn, history) => {
	solver.current = new BoardState(positions, turn, history);
	solver.counter = 0;
	console.log(solver.current.makePositionString());
	solver.onEnd = (value, moveLine) => {
		console.log("読み筋 : " + solver.current.makeMoveLineString(moveLine) + " (" + value + ")");
		solver.isWorking = false;
		onFound(moveLine && moveLine.at(-1));
	};
	solver.onUpdated = (param) => {
		onUpdated(param);
	}
	solver.stack = [{
		turn, move: {}, queue: null, value: turn ? 10000 : -10000, min: -10000, max: 10000, 
		bestLine: [], parent: null, illness: 0,
	}];
	solver.evaluateFromStack();
}

/*
TODO
・劣後度（優先度トップとの差）の累積が大きい手は無視する（捨てる手のとき）
　※現状は捨てる手のときでなくても打ち切って静的評価をしている

・AIの手で詰んだとき読み筋の表示がおかしい

*/

solver.minDepth = 3;
solver.maxDepth = 10;
solver.illnessLimit = 1800;
solver.illnessCost = 300;
solver.counterLimit = 2000000; // 超えるとillnessの増加量が2倍になる
solver.evaluateFromStack = () => {
	for(let cnt = 0; cnt < 5000; cnt ++){
		const item = solver.stack.at(-1);
		const { turn, move, queue, value, min, max, bestLine, parent, illness } = item;
		if( ! queue){ // 上から進んできて候補手の生成前
			const winner = solver.current.getWinner();
			if(winner >= 0){ 
				item.value = [10000, -10000][winner];
				item.bestLine = [];
				solver.current.revert();
				if(globalThis.DEBUG){
					console.groupEnd();
					console.log("　".repeat(solver.stack.length),
						solver.current.makeMoveLineString([move]), ":", item.value);
				}
				solver.stack.pop();
				// min, max ではなく直接 parent?.value や parent?.parent?.value を参照するでも良いかも
			}
			else if(solver.stack.length < solver.minDepth ||
				solver.stack.length < solver.maxDepth && illness < solver.illnessLimit){
				// 下に余裕がある（候補手を作成する）
				if(globalThis.DEBUG){
					console.log(solver.current.makePositionString());
					console.log({min, max});
				}
				const nextMoves = solver.current.scanMoves();
				solver.calcLikeliness(nextMoves, 
					solver.current.positions, solver.current.turn, solver.current.occupiers,
					solver.current.history.at(-1), solver.current.history.at(-2));
				nextMoves.sort((a, b) => b.likeliness - a.likeliness);
				// TODO: nextMoves.length == 0 だったときの処理
				const maxLikeliness = nextMoves[0].likeliness;
				for(let m of nextMoves) m.illness = maxLikeliness - m.likeliness;
				if(solver.stack.length == 1){
					for(let m of nextMoves) m.name = solver.current.makeMoveLineString([m]);
					console.log("候補手 : " + nextMoves.map(m =>
						m.name + (m.likeliness ? "[" + m.likeliness + "]" : "")).join(", "));
				}
				item.queue = new Util.Queue(nextMoves);
				continue;
			}
			else{ // 下に進めない（静的評価をする）
				item.value = solver.evaluate(solver.current);
				item.bestLine = [];
				solver.current.revert();
				if(globalThis.DEBUG){
					console.groupEnd();
					console.log("　".repeat(solver.stack.length),
						solver.current.makeMoveLineString([move]), ":", item.value);
				}
				solver.stack.pop();
			}
		}
		else if(queue.peek()){ // 未検討の候補手がある状態
			const move = queue.pop();
			if(globalThis.DEBUG){
				console.groupCollapsed("　".repeat(solver.stack.length), solver.stack.length,
					solver.current.makeMoveLineString([move]), "[" + move.likeliness + "] " + illness);
			}
			solver.current.perform(move);
			solver.counter += 1;
			solver.stack.push({
				turn: 1 - turn, move, queue: null, value: turn ? min : max,
				min: turn ? min : value, max: turn ? value : max, bestLine, parent: item,
				illness: illness + (move.illness + solver.illnessCost) * (solver.counter > solver.counterLimit ? 2 : 1)
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
					console.log("　".repeat(solver.stack.length),
						solver.current.makeMoveLineString(bestLine), ":", value);
				}
				solver.current.revert();
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

/*
	position = { x, y, face, player, isOut, isExcluded }
	move = {
		main: { piece, newPosition, oldPosition },
		captured: { piece, newPosition, oldPosition } | null,
		likeliness,
		name: string | undefined
	}
*/
// TODO: x, y をやめて z にしたい

solver.calcDomination = (positions, occupiers) => {
	const counts = [[], []];
	const minWorths = [[], []];
	const maxWorths = [[], []];
	for(let turn of [0, 1]) for(let cell of model.cells){
		counts[turn].push(0);
		minWorths[turn].push(9999);
		maxWorths[turn].push(0);
	}
	for(let piece of model.pieces){
		if(positions[piece.id].isExcluded) continue;
		if(positions[piece.id].isOut) continue;
		const turn = positions[piece.id].player;
		const lines = model.lines[turn][piece.id][positions[piece.id].face]
			[positions[piece.id].x][positions[piece.id].y];
		const worth = solver.worthiness[piece.entity.id][positions[piece.id].face];
		for(let line of lines){
			for(let cell of line){
				counts[turn][cell.id] += 1;
				if(worth > maxWorths[turn][cell.id]) maxWorths[turn][cell.id] = worth;
				if(worth < minWorths[turn][cell.id]) minWorths[turn][cell.id] = worth;
				if(occupiers[cell.id]) break;
			}
		}
	}
	return [counts, minWorths, maxWorths];
}
solver.calcLikeliness = (moves, positions, turn, occupiers, lastMove, lastMove2) => {
	// moves の要素である move に likeliness を書き込む
	const lastX = lastMove?.main?.newPosition?.x;
	const lastY = lastMove?.main?.newPosition?.y;
	const [counts, minWorths, maxWorths] = solver.calcDomination(positions, occupiers);
	for(let move of moves){
		let l = 0;
		const worth = solver.worthiness[move.main.piece.entity.id][move.main.newPosition.face];
		const oldWorth = solver.worthiness[move.main.piece.entity.id][move.main.oldPosition.face];
		const captureWorth = move.captured ? solver.worthiness[move.captured.piece.entity.id][move.captured.oldPosition.face] : 0;
		const x = move.main.newPosition.x;
		const y = move.main.newPosition.y;
		const z = model.getCell(x, y).id;
		const dominationCount = move.main.oldPosition.isOut ? counts[turn][z] : (counts[turn][z] - 1);
			// FIXME: 飛車先の歩を突いたような場面でカウントが正しくない
		const xo = move.main.oldPosition.x;
		const yo = move.main.oldPosition.y;
		const zo = model.getCell(xo, yo)?.id;
		// 取る手は＋
		l += 100 * captureWorth;
		// 成る手は＋
		l += 50 * (worth - oldWorth);
		// 直前に相手が操作した駒を取るのは少し＋
		if(lastMove && move.captured && move.captured.piece.id == lastMove.main.piece.id) l += 25;
		// 直前に自分が操作した駒を動かすのは＋　ただし手を戻すのは－
		if(lastMove2 && move.main.piece.id == lastMove2.main.piece.id){
			if(lastMove2.main.oldPosition.x == x && lastMove2.main.oldPosition.y == y) l -= 60;
			else l += 60;
		}
		// 直前に自分が取った駒を打つのは＋
		if(lastMove2?.captured && move.main.piece.id == lastMove2.captured.piece.id) l += 35;
		// 直前に相手が操作したマスの近くは＋
		if(x >= lastX - 1 && x <= lastX + 1 && y >= lastY - 1 && y <= lastY + 1) l += 30;
		// 自分の利きがなく相手の利きがある場所へ入る手は－
		if(dominationCount == 0 && counts[1 - turn][z] > 0) l -= 90 * worth;
		// 自分と相手の利きがある場所へ入る手は，相手の駒のほうが安ければ－
		if(dominationCount > 0 && counts[1 - turn][z] > 0 && minWorths[1 - turn][z] < worth) l -= 70 * worth;
		// 相手の安い駒に取られそうだった駒を動かす手は＋
		if( ! move.main.oldPosition.isOut && minWorths[1 - turn][zo] < worth) l += 50 * (worth - minWorths[1 - turn][zo]);
		// TODO: 増やす（増やしたら打ち切りのしきい値も調整する）
		// 相手の駒に利きを与える手は＋
		
		move.likeliness = l;
	}
}

solver.worthiness = [
	[10, 0], // king
	[8, 10], // queen
	[4, 6], // rook
	[4, 6], // bishop
	[3, 4], // silver
	[1, 4], // pawn
];

solver.evaluationCounter = 0;
solver.evaluate = (board) => {
	const winner = board.getWinner();
	if(winner >= 0){
		if(winner == 0) return 10000; else return -10000;
	}
	const [counts] = solver.calcDomination(board.positions, board.occupiers);

	let value = 0;
	for(let c of model.cells){
		if(counts[0][c.id] > counts[1][c.id]) value += 100;
		else if(counts[0][c.id] < counts[1][c.id]) value -= 100.;
	}
	for(let p of model.pieces){
		if(board.positions[p.id].isExcluded) continue;
		if(board.positions[p.id].player == 0){
			value += 100 * solver.worthiness[p.entity.id][board.positions[p.id].face];
		}
		else value -= 100 * solver.worthiness[p.entity.id][board.positions[p.id].face];
	}

	solver.evaluationCounter += 1;
	return value;
}



