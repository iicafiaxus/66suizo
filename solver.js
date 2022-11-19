"REQUIRE models/model.js";

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
				moves.push({ piece, cell });
			}
		}
		else{
			const lines = solver.lines[player][piece.id][positions[piece.id].face][positions[piece.id].x][positions[piece.id].y];
			for(let line of lines){
				for(let cell of line){
					if(occupiers[cell.id] >= 0){
						if(occupiers[cell.id] != player) moves.push({ piece, cell });
						break;
					}
					else moves.push({ piece, cell });
				}
			}
		}
	}

	return moves;
}

solver.cellToString = (cell) => {
	return "" + (6 - cell.y) + ["一", "二", "三", "四", "五", "六"][cell.x];
}

solver.moveToString = (move) => {
	return move.piece.entity.names[0] + move.piece.id + " " + solver.cellToString(move.cell);

}