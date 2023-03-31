const pieceModel = {};

pieceModel.entities = {
	king: { id: 0, names: ["王将", "　"], size: 4, life: [1, 0], isSingleFaced: true, isSingleUse: true },
	queen: { id: 1, names: ["酔象", "太子"], size: 4, life: [0, 1], forcePromotion: 0 },
	rook: { id: 2, names: ["飛車", "龍王"], size: 3, life: [0, 0], forcePromotion: 0 },
	bishop: { id: 3, names: ["角行", "龍馬"], size: 3, life: [0, 0], forcePromotion: 0 },
	silver: { id: 4, names: ["銀将", "金"], size: 2, life: [0, 0], forcePromotion: 0 },
	pawn: { id: 5, names: ["歩兵", "と"], size: 1, life: [0, 0], forcePromotion: 1, occupiesColumn: true },
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
	{id: 0, entity: pieceModel.entities.king, position: { x: 0, y: 3, face: 0, player: 1, isOut: false, isExcluded: false }},
	{id: 1, entity: pieceModel.entities.king, position: { x: 5, y: 2, face: 0, player: 0, isOut: false, isExcluded: false }},
	{id: 2, entity: pieceModel.entities.queen, position: { x: 0, y: 2, face: 0, player: 1, isOut: false, isExcluded: false }},
	{id: 3, entity: pieceModel.entities.queen, position: { x: 5, y: 3, face: 0, player: 0, isOut: false, isExcluded: false }},
	{id: 4, entity: pieceModel.entities.rook, position: { x: 0, y: 1, face: 0, player: 1, isOut: false, isExcluded: false }},
	{id: 5, entity: pieceModel.entities.rook, position: { x: 5, y: 4, face: 0, player: 0, isOut: false, isExcluded: false }},
	{id: 6, entity: pieceModel.entities.bishop, position: { x: 0, y: 4, face: 0, player: 1, isOut: false, isExcluded: false }},
	{id: 7, entity: pieceModel.entities.bishop, position: { x: 5, y: 1, face: 0, player: 0, isOut: false, isExcluded: false }},
	{id: 8, entity: pieceModel.entities.silver, position: { x: 0, y: 0, face: 0, player: 1, isOut: false, isExcluded: false }},
	{id: 9, entity: pieceModel.entities.silver, position: { x: 0, y: 5, face: 0, player: 1, isOut: false, isExcluded: false }},
	{id: 10, entity: pieceModel.entities.silver, position: { x: 5, y: 0, face: 0, player: 0, isOut: false, isExcluded: false }},
	{id: 11, entity: pieceModel.entities.silver, position: { x: 5, y: 5, face: 0, player: 0, isOut: false, isExcluded: false }},
	{id: 12, entity: pieceModel.entities.pawn, position: { x: 1, y: 0, face: 0, player: 1, isOut: false, isExcluded: false }},
	{id: 13, entity: pieceModel.entities.pawn, position: { x: 1, y: 1, face: 0, player: 1, isOut: false, isExcluded: false }},
	{id: 14, entity: pieceModel.entities.pawn, position: { x: 1, y: 2, face: 0, player: 1, isOut: false, isExcluded: false }},
	{id: 15, entity: pieceModel.entities.pawn, position: { x: 1, y: 3, face: 0, player: 1, isOut: false, isExcluded: false }},
	{id: 16, entity: pieceModel.entities.pawn, position: { x: 1, y: 4, face: 0, player: 1, isOut: false, isExcluded: false }},
	{id: 17, entity: pieceModel.entities.pawn, position: { x: 1, y: 5, face: 0, player: 1, isOut: false, isExcluded: false }},
	{id: 18, entity: pieceModel.entities.pawn, position: { x: 4, y: 0, face: 0, player: 0, isOut: false, isExcluded: false }},
	{id: 19, entity: pieceModel.entities.pawn, position: { x: 4, y: 1, face: 0, player: 0, isOut: false, isExcluded: false }},
	{id: 20, entity: pieceModel.entities.pawn, position: { x: 4, y: 2, face: 0, player: 0, isOut: false, isExcluded: false }},
	{id: 21, entity: pieceModel.entities.pawn, position: { x: 4, y: 3, face: 0, player: 0, isOut: false, isExcluded: false }},
	{id: 22, entity: pieceModel.entities.pawn, position: { x: 4, y: 4, face: 0, player: 0, isOut: false, isExcluded: false }},
	{id: 23, entity: pieceModel.entities.pawn, position: { x: 4, y: 5, face: 0, player: 0, isOut: false, isExcluded: false }},
];
