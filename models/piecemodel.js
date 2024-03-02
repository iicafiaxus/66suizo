const pieceModel = {};

pieceModel.entities = {
	king: { id: 0, names: ["王将", "　"], shortNames: ["玉", "　"],
		size: 4, life: [1, 0], isSingleFaced: true, isSingleUse: true },
	queen: { id: 1, names: ["酔象", "太子"], shortNames: ["酔", "太"],
		size: 4, life: [0, 1], forcePromotion: 0 },
	rook: { id: 2, names: ["飛車", "龍王"], shortNames: ["飛", "竜"],
		size: 3, life: [0, 0], forcePromotion: 0 },
	bishop: { id: 3, names: ["角行", "龍馬"], shortNames: ["角", "馬"],
		size: 3, life: [0, 0], forcePromotion: 0 },
	silver: { id: 4, names: ["銀将", "金"], shortNames: ["銀", "成銀"],
		size: 2, life: [0, 0], forcePromotion: 0 },
	pawn: { id: 5, names: ["歩兵", "と"], shortNames: ["歩", "と"],
		size: 1, life: [0, 0], forcePromotion: 1, occupiesColumn: true },
};

pieceModel.entities.king.lines = [[
	[{dx: -1, dy: -1}], [{dx: -1, dy: 0}], [{dx: -1, dy: 1}], [{dx: 0, dy: -1}],
	[{dx: 0, dy: 1}], [{dx: 1, dy: -1}], [{dx: 1, dy: 0}], [{dx: 1, dy: 1}],
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

pieceModel.pieces = [
	{id: 0, entity: pieceModel.entities.king},
	{id: 1, entity: pieceModel.entities.king},
	{id: 2, entity: pieceModel.entities.queen},
	{id: 3, entity: pieceModel.entities.queen},
	{id: 4, entity: pieceModel.entities.rook},
	{id: 5, entity: pieceModel.entities.rook},
	{id: 6, entity: pieceModel.entities.bishop},
	{id: 7, entity: pieceModel.entities.bishop},
	{id: 8, entity: pieceModel.entities.silver},
	{id: 9, entity: pieceModel.entities.silver},
	{id: 10, entity: pieceModel.entities.silver},
	{id: 11, entity: pieceModel.entities.silver},
	{id: 12, entity: pieceModel.entities.pawn},
	{id: 13, entity: pieceModel.entities.pawn},
	{id: 14, entity: pieceModel.entities.pawn},
	{id: 15, entity: pieceModel.entities.pawn},
	{id: 16, entity: pieceModel.entities.pawn},
	{id: 17, entity: pieceModel.entities.pawn},
	{id: 18, entity: pieceModel.entities.pawn},
	{id: 19, entity: pieceModel.entities.pawn},
	{id: 20, entity: pieceModel.entities.pawn},
	{id: 21, entity: pieceModel.entities.pawn},
	{id: 22, entity: pieceModel.entities.pawn},
	{id: 23, entity: pieceModel.entities.pawn},
];

