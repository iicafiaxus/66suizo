"REQUIRE util.jsx";
"REQUIRE piece.jsx";
"REQUIRE board.jsx";

const Game = function(props){
	const cells = [];
	for(let x = 0; x < 6; x ++) for(let y = 0; y < 6; y ++){
		cells.push({ x, y });
	}
	const pieceEntities = {
		king: { names: ["王将", "　"], size: 4 },
		queen: { names: ["酔象", "太子"], size: 4 },
		rook: { names: ["飛車", "龍王"], size: 3 },
		bishop: { names: ["角行", "龍馬"], size: 3 },
		silver: { names: ["銀将", "金"], size: 2 },
		pawn: { names: ["歩兵", "と"], size: 1 },
	}
	const pieces = [
		{id: 0, entity: pieceEntities.king, position: { x: 0, y: 3, face: 0, player: 1, isOut: false }},
		{id: 1, entity: pieceEntities.king, position: { x: 5, y: 2, face: 0, player: 0, isOut: false }},
		{id: 2, entity: pieceEntities.queen, position: { x: 0, y: 2, face: 0, player: 1, isOut: false }},
		{id: 3, entity: pieceEntities.queen, position: { x: 5, y: 3, face: 0, player: 0, isOut: false }},
		{id: 4, entity: pieceEntities.rook, position: { x: 0, y: 1, face: 0, player: 1, isOut: false }},
		{id: 5, entity: pieceEntities.rook, position: { x: 5, y: 4, face: 0, player: 0, isOut: false }},
		{id: 6, entity: pieceEntities.bishop, position: { x: 0, y: 4, face: 0, player: 1, isOut: false }},
		{id: 7, entity: pieceEntities.bishop, position: { x: 5, y: 1, face: 0, player: 0, isOut: false }},
		{id: 8, entity: pieceEntities.silver, position: { x: 0, y: 0, face: 0, player: 1, isOut: false }},
		{id: 9, entity: pieceEntities.silver, position: { x: 0, y: 5, face: 0, player: 1, isOut: false }},
		{id: 10, entity: pieceEntities.silver, position: { x: 5, y: 0, face: 0, player: 0, isOut: false }},
		{id: 11, entity: pieceEntities.silver, position: { x: 5, y: 5, face: 0, player: 0, isOut: false }},
		{id: 12, entity: pieceEntities.pawn, position: { x: 1, y: 0, face: 0, player: 1, isOut: false }},
		{id: 13, entity: pieceEntities.pawn, position: { x: 1, y: 1, face: 0, player: 1, isOut: false }},
		{id: 14, entity: pieceEntities.pawn, position: { x: 1, y: 2, face: 0, player: 1, isOut: false }},
		{id: 15, entity: pieceEntities.pawn, position: { x: 1, y: 3, face: 0, player: 1, isOut: false }},
		{id: 16, entity: pieceEntities.pawn, position: { x: 1, y: 4, face: 0, player: 1, isOut: false }},
		{id: 17, entity: pieceEntities.pawn, position: { x: 1, y: 5, face: 0, player: 1, isOut: false }},
		{id: 18, entity: pieceEntities.pawn, position: { x: 4, y: 0, face: 0, player: 0, isOut: false }},
		{id: 19, entity: pieceEntities.pawn, position: { x: 4, y: 1, face: 0, player: 0, isOut: false }},
		{id: 20, entity: pieceEntities.pawn, position: { x: 4, y: 2, face: 0, player: 0, isOut: false }},
		{id: 21, entity: pieceEntities.pawn, position: { x: 4, y: 3, face: 0, player: 0, isOut: false }},
		{id: 22, entity: pieceEntities.pawn, position: { x: 4, y: 4, face: 0, player: 0, isOut: false }},
		{id: 23, entity: pieceEntities.pawn, position: { x: 4, y: 5, face: 0, player: 0, isOut: false }},
	];
	return (
		<div>
			<h1>6六酔象将棋</h1>
			<Board xSize="6" ySize="6" cells={cells} pieces={pieces} />
		</div>
	)
}
