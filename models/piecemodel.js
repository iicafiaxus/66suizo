const pieceModel = {};

pieceModel.entities = {
	king: { names: ["王将", "　"], size: 4, isSingleFaced: true },
	queen: { names: ["酔象", "太子"], size: 4, forcePromotion: 0 },
	rook: { names: ["飛車", "龍王"], size: 3, forcePromotion: 0 },
	bishop: { names: ["角行", "龍馬"], size: 3, forcePromotion: 0 },
	silver: { names: ["銀将", "金"], size: 2, forcePromotion: 0 },
	pawn: { names: ["歩兵", "と"], size: 1, forcePromotion: 1 },
};

pieceModel.entities.king.lines = [[
	[{dx: -1, dy: -1}], [{dx: -1, dy: 0}], [{dx: -1, dy: 1}], [{dx: 0, dy: -1}],
	[{dx: 0, dy: 1}], [{dx: 1, dy: -1}], [{dx: 1, dy: 0}], [{dx: 0, dy: 1}],
],[
]];
pieceModel.entities.queen.lines = [[
	[{dx: -1, dy: -1}], [{dx: -1, dy: 0}], [{dx: -1, dy: 1}], [{dx: 0, dy: -1}],
	[{dx: 0, dy: 1}], [{dx: 1, dy: -1}], [{dx: 1, dy: 1}],
],[
	[{dx: -1, dy: -1}], [{dx: -1, dy: 0}], [{dx: -1, dy: 1}], [{dx: 0, dy: -1}],
	[{dx: 0, dy: 1}], [{dx: 1, dy: -1}], [{dx: 1, dy: 0}], [{dx: 1, dy: 1}],
]];
pieceModel.entities.silver.lines = [[
	[{dx: -1, dy: -1}], [{dx: -1, dy: 0}], [{dx: -1, dy: 1}],
	[{dx: 1, dy: -1}], [{dx: 1, dy: 1}],
],[
	[{dx: -1, dy: -1}], [{dx: -1, dy: 0}], [{dx: -1, dy: 1}], [{dx: 0, dy: -1}],
	[{dx: 0, dy: 1}], [{dx: 1, dy: 0}],
]];
pieceModel.entities.pawn.lines = [[
	[{dx: -1, dy: 0}]
],[
	[{dx: -1, dy: -1}], [{dx: -1, dy: 0}], [{dx: -1, dy: 1}], [{dx: 0, dy: -1}],
	[{dx: 0, dy: 1}], [{dx: 1, dy: 0}],
]];
pieceModel.entities.rook.lines = [[
	[{dx: -1, dy: 0}, {dx: -2, dy: 0}, {dx: -3, dy: 0}, {dx: -4, dy: 0}, {dx: -5, dy: 0}],
	[{dx: 0, dy: -1}, {dx: 0, dy: -2}, {dx: 0, dy: -3}, {dx: 0, dy: -4}, {dx: 0, dy: -5}],
	[{dx: 0, dy: 1}, {dx: 0, dy: 2}, {dx: 0, dy: 3}, {dx: 0, dy: 4}, {dx: 0, dy: 5}],
	[{dx: 1, dy: 0}, {dx: 2, dy: 0}, {dx: 3, dy: 0}, {dx: 4, dy: 0}, {dx: 5, dy: 0}],
],[
	[{dx: -1, dy: 0}, {dx: -2, dy: 0}, {dx: -3, dy: 0}, {dx: -4, dy: 0}, {dx: -5, dy: 0}],
	[{dx: 0, dy: -1}, {dx: 0, dy: -2}, {dx: 0, dy: -3}, {dx: 0, dy: -4}, {dx: 0, dy: -5}],
	[{dx: 0, dy: 1}, {dx: 0, dy: 2}, {dx: 0, dy: 3}, {dx: 0, dy: 4}, {dx: 0, dy: 5}],
	[{dx: 1, dy: 0}, {dx: 2, dy: 0}, {dx: 3, dy: 0}, {dx: 4, dy: 0}, {dx: 5, dy: 0}],
	[{dx: -1, dy: -1}], [{dx: -1, dy: 1}], [{dx: 1, dy: -1}], [{dx: 1, dy: 1}],
]];
pieceModel.entities.bishop.lines = [[
	[{dx: -1, dy: -1}, {dx: -2, dy: -2}, {dx: -3, dy: -3}, {dx: -4, dy: -4}, {dx: -5, dy: -5}],
	[{dx: -1, dy: 1}, {dx: -2, dy: 2}, {dx: -3, dy: 3}, {dx: -4, dy: 4}, {dx: -5, dy: 5}],
	[{dx: 1, dy: -1}, {dx: 2, dy: -2}, {dx: 3, dy: -3}, {dx: 4, dy: -4}, {dx: 5, dy: -5}],
	[{dx: 1, dy: 1}, {dx: 2, dy: 2}, {dx: 3, dy: 3}, {dx: 4, dy: 4}, {dx: 5, dy: 5}],
],[
	[{dx: -1, dy: -1}, {dx: -2, dy: -2}, {dx: -3, dy: -3}, {dx: -4, dy: -4}, {dx: -5, dy: -5}],
	[{dx: -1, dy: 1}, {dx: -2, dy: 2}, {dx: -3, dy: 3}, {dx: -4, dy: 4}, {dx: -5, dy: 5}],
	[{dx: 1, dy: -1}, {dx: 2, dy: -2}, {dx: 3, dy: -3}, {dx: 4, dy: -4}, {dx: 5, dy: -5}],
	[{dx: 1, dy: 1}, {dx: 2, dy: 2}, {dx: 3, dy: 3}, {dx: 4, dy: 4}, {dx: 5, dy: 5}],
	[{dx: -1, dy: 0}], [{dx: 0, dy: -1}], [{dx: 0, dy: 1}], [{dx: 1, dy: 0}],
]];
