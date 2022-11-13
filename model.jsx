const Model = {};

Model.pieceEntities = {
	king: { names: ["王将", "　"], size: 4, isSingleFaced: true },
	queen: { names: ["酔象", "太子"], size: 4 },
	rook: { names: ["飛車", "龍王"], size: 3 },
	bishop: { names: ["角行", "龍馬"], size: 3 },
	silver: { names: ["銀将", "金"], size: 2 },
	pawn: { names: ["歩兵", "と"], size: 1, forcePromotion: 1 },
};

Model.pieceEntities.king.lines = [[
	[{dx: -1, dy: -1}], [{dx: -1, dy: 0}], [{dx: -1, dy: 1}], [{dx: 0, dy: -1}],
	[{dx: 0, dy: 1}], [{dx: 1, dy: -1}], [{dx: 1, dy: 0}], [{dx: 0, dy: 1}],
],[
]];
Model.pieceEntities.queen.lines = [[
	[{dx: -1, dy: -1}], [{dx: -1, dy: 0}], [{dx: -1, dy: 1}], [{dx: 0, dy: -1}],
	[{dx: 0, dy: 1}], [{dx: 1, dy: -1}], [{dx: 1, dy: 1}],
],[
	[{dx: -1, dy: -1}], [{dx: -1, dy: 0}], [{dx: -1, dy: 1}], [{dx: 0, dy: -1}],
	[{dx: 0, dy: 1}], [{dx: 1, dy: -1}], [{dx: 1, dy: 0}], [{dx: 1, dy: 1}],
]];
Model.pieceEntities.silver.lines = [[
	[{dx: -1, dy: -1}], [{dx: -1, dy: 0}], [{dx: -1, dy: 1}],
	[{dx: 1, dy: -1}], [{dx: 1, dy: 1}],
],[
	[{dx: -1, dy: -1}], [{dx: -1, dy: 0}], [{dx: -1, dy: 1}], [{dx: 0, dy: -1}],
	[{dx: 0, dy: 1}], [{dx: 1, dy: 0}],
]];
Model.pieceEntities.pawn.lines = [[
	[{dx: -1, dy: 0}]
],[
	[{dx: -1, dy: -1}], [{dx: -1, dy: 0}], [{dx: -1, dy: 1}], [{dx: 0, dy: -1}],
	[{dx: 0, dy: 1}], [{dx: 1, dy: 0}],
]];
Model.pieceEntities.rook.lines = [[
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
Model.pieceEntities.bishop.lines = [[
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

Model.pieces = [
	{id: 0, entity: Model.pieceEntities.king, position: { x: 0, y: 3, face: 0, player: 1, isOut: false }},
	{id: 1, entity: Model.pieceEntities.king, position: { x: 5, y: 2, face: 0, player: 0, isOut: false }},
	{id: 2, entity: Model.pieceEntities.queen, position: { x: 0, y: 2, face: 0, player: 1, isOut: false }},
	{id: 3, entity: Model.pieceEntities.queen, position: { x: 5, y: 3, face: 0, player: 0, isOut: false }},
	{id: 4, entity: Model.pieceEntities.rook, position: { x: 0, y: 1, face: 0, player: 1, isOut: false }},
	{id: 5, entity: Model.pieceEntities.rook, position: { x: 5, y: 4, face: 0, player: 0, isOut: false }},
	{id: 6, entity: Model.pieceEntities.bishop, position: { x: 0, y: 4, face: 0, player: 1, isOut: false }},
	{id: 7, entity: Model.pieceEntities.bishop, position: { x: 5, y: 1, face: 0, player: 0, isOut: false }},
	{id: 8, entity: Model.pieceEntities.silver, position: { x: 0, y: 0, face: 0, player: 1, isOut: false }},
	{id: 9, entity: Model.pieceEntities.silver, position: { x: 0, y: 5, face: 0, player: 1, isOut: false }},
	{id: 10, entity: Model.pieceEntities.silver, position: { x: 5, y: 0, face: 0, player: 0, isOut: false }},
	{id: 11, entity: Model.pieceEntities.silver, position: { x: 5, y: 5, face: 0, player: 0, isOut: false }},
	{id: 12, entity: Model.pieceEntities.pawn, position: { x: 1, y: 0, face: 0, player: 1, isOut: false }},
	{id: 13, entity: Model.pieceEntities.pawn, position: { x: 1, y: 1, face: 0, player: 1, isOut: false }},
	{id: 14, entity: Model.pieceEntities.pawn, position: { x: 1, y: 2, face: 0, player: 1, isOut: false }},
	{id: 15, entity: Model.pieceEntities.pawn, position: { x: 1, y: 3, face: 0, player: 1, isOut: false }},
	{id: 16, entity: Model.pieceEntities.pawn, position: { x: 1, y: 4, face: 0, player: 1, isOut: false }},
	{id: 17, entity: Model.pieceEntities.pawn, position: { x: 1, y: 5, face: 0, player: 1, isOut: false }},
	{id: 18, entity: Model.pieceEntities.pawn, position: { x: 4, y: 0, face: 0, player: 0, isOut: false }},
	{id: 19, entity: Model.pieceEntities.pawn, position: { x: 4, y: 1, face: 0, player: 0, isOut: false }},
	{id: 20, entity: Model.pieceEntities.pawn, position: { x: 4, y: 2, face: 0, player: 0, isOut: false }},
	{id: 21, entity: Model.pieceEntities.pawn, position: { x: 4, y: 3, face: 0, player: 0, isOut: false }},
	{id: 22, entity: Model.pieceEntities.pawn, position: { x: 4, y: 4, face: 0, player: 0, isOut: false }},
	{id: 23, entity: Model.pieceEntities.pawn, position: { x: 4, y: 5, face: 0, player: 0, isOut: false }},
];
