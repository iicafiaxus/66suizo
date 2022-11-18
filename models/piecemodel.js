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
	{id: 0, entity: pieceModel.entities.king, position: { x: 0, y: 3, face: 0, player: 1, isOut: false }},
	{id: 1, entity: pieceModel.entities.king, position: { x: 5, y: 2, face: 0, player: 0, isOut: false }},
	{id: 2, entity: pieceModel.entities.queen, position: { x: 0, y: 2, face: 0, player: 1, isOut: false }},
	{id: 3, entity: pieceModel.entities.queen, position: { x: 5, y: 3, face: 0, player: 0, isOut: false }},
	{id: 4, entity: pieceModel.entities.rook, position: { x: 0, y: 1, face: 0, player: 1, isOut: false }},
	{id: 5, entity: pieceModel.entities.rook, position: { x: 5, y: 4, face: 0, player: 0, isOut: false }},
	{id: 6, entity: pieceModel.entities.bishop, position: { x: 0, y: 4, face: 0, player: 1, isOut: false }},
	{id: 7, entity: pieceModel.entities.bishop, position: { x: 5, y: 1, face: 0, player: 0, isOut: false }},
	{id: 8, entity: pieceModel.entities.silver, position: { x: 0, y: 0, face: 0, player: 1, isOut: false }},
	{id: 9, entity: pieceModel.entities.silver, position: { x: 0, y: 5, face: 0, player: 1, isOut: false }},
	{id: 10, entity: pieceModel.entities.silver, position: { x: 5, y: 0, face: 0, player: 0, isOut: false }},
	{id: 11, entity: pieceModel.entities.silver, position: { x: 5, y: 5, face: 0, player: 0, isOut: false }},
	{id: 12, entity: pieceModel.entities.pawn, position: { x: 1, y: 0, face: 0, player: 1, isOut: false }},
	{id: 13, entity: pieceModel.entities.pawn, position: { x: 1, y: 1, face: 0, player: 1, isOut: false }},
	{id: 14, entity: pieceModel.entities.pawn, position: { x: 1, y: 2, face: 0, player: 1, isOut: false }},
	{id: 15, entity: pieceModel.entities.pawn, position: { x: 1, y: 3, face: 0, player: 1, isOut: false }},
	{id: 16, entity: pieceModel.entities.pawn, position: { x: 1, y: 4, face: 0, player: 1, isOut: false }},
	{id: 17, entity: pieceModel.entities.pawn, position: { x: 1, y: 5, face: 0, player: 1, isOut: false }},
	{id: 18, entity: pieceModel.entities.pawn, position: { x: 4, y: 0, face: 0, player: 0, isOut: false }},
	{id: 19, entity: pieceModel.entities.pawn, position: { x: 4, y: 1, face: 0, player: 0, isOut: false }},
	{id: 20, entity: pieceModel.entities.pawn, position: { x: 4, y: 2, face: 0, player: 0, isOut: false }},
	{id: 21, entity: pieceModel.entities.pawn, position: { x: 4, y: 3, face: 0, player: 0, isOut: false }},
	{id: 22, entity: pieceModel.entities.pawn, position: { x: 4, y: 4, face: 0, player: 0, isOut: false }},
	{id: 23, entity: pieceModel.entities.pawn, position: { x: 4, y: 5, face: 0, player: 0, isOut: false }},
];
