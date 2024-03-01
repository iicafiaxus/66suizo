"REQUIRE models/model.js";

// TODO: これも将棋のルールの一部
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

model.calcOccupiers = (positions) => { // FIXME: complexity
	const occupiers = [];
	for(let piece of model.pieces){
		const pos = positions[piece.id];
		if(pos.isOut) continue;
		if(pos.isExcluded) continue;
		occupiers[model.getCell(pos.x, pos.y).id] = piece;
	}
	return occupiers;
}
model.scanMoves = (positions, turn) => {
	const moves = [];

	const occupiers = model.calcOccupiers(positions); // これが piece を返すようにする

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
			const lines = model.lines[turn][piece.id][
				positions[piece.id].face][positions[piece.id].x][positions[piece.id].y];
			for(let line of lines){
				for(let cell of line){
					//counts[cell.id] += 1;
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
	return moves;
}
