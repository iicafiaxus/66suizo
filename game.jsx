"REQUIRE util.jsx";
"REQUIRE piece.jsx";
"REQUIRE board.jsx";
"REQUIRE model.jsx";

const Game = function(props){
	const cells = [];
	for(let x = 0; x < 6; x ++) for(let y = 0; y < 6; y ++){
		cells.push({ x, y });
	}
	return (
		<div>
			<h1>6六酔象将棋</h1>
			<Board xSize="6" ySize="6" cells={cells} pieces={Model.pieces} />
		</div>
	)
}
