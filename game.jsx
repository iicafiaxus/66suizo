"REQUIRE util.jsx";
"REQUIRE piece.jsx";
"REQUIRE board.jsx";

let Game = function(props){
	let cells = [];
	for(let x = 0; x < 6; x ++) for(let y = 0; y < 6; y ++){
		cells.push({ x, y });
	}
	let pieces = [
		{ x: 0, y: 0, name: "銀将", size: 2, player: 1 },
		{ x: 0, y: 1, name: "飛車", size: 3, player: 1 },
		{ x: 0, y: 2, name: "酔象", size: 4, player: 1 },
		{ x: 0, y: 3, name: "王将", size: 4, player: 1 },
		{ x: 0, y: 4, name: "角行", size: 3, player: 1 },
		{ x: 0, y: 5, name: "銀将", size: 2, player: 1 },
		{ x: 1, y: 0, name: "歩兵", size: 1, player: 1 },
		{ x: 1, y: 1, name: "歩兵", size: 1, player: 1 },
		{ x: 1, y: 2, name: "歩兵", size: 1, player: 1 },
		{ x: 1, y: 3, name: "歩兵", size: 1, player: 1 },
		{ x: 1, y: 4, name: "歩兵", size: 1, player: 1 },
		{ x: 1, y: 5, name: "歩兵", size: 1, player: 1 },
		{ x: 4, y: 0, name: "歩兵", size: 1, player: 0 },
		{ x: 4, y: 1, name: "歩兵", size: 1, player: 0 },
		{ x: 4, y: 2, name: "歩兵", size: 1, player: 0 },
		{ x: 4, y: 3, name: "歩兵", size: 1, player: 0 },
		{ x: 4, y: 4, name: "歩兵", size: 1, player: 0 },
		{ x: 4, y: 5, name: "歩兵", size: 1, player: 0 },
		{ x: 5, y: 0, name: "銀将", size: 2, player: 0 },
		{ x: 5, y: 1, name: "角行", size: 3, player: 0 },
		{ x: 5, y: 2, name: "王将", size: 4, player: 0 },
		{ x: 5, y: 3, name: "酔象", size: 4, player: 0 },
		{ x: 5, y: 4, name: "飛車", size: 3, player: 0 },
		{ x: 5, y: 5, name: "銀将", size: 2, player: 0 },
	];
	return (
		<div>
			<h1>6六酔象将棋</h1>
			<Board xSize="6" ySize="6" cells={cells} pieces={pieces} />
		</div>
	)
}
