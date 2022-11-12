"REQUIRE cell.jsx"
"REQUIRE piece.jsx"

let Board = function(props){
	return <div className="board" style={{
		gridTemplateColumns: "repeat(" + props.xSize + ", 1fr)",
		gridTemplateRows: "repeat(" + props.ySize + ", 1fr)",
	}}>
		{props.cells.map(cell =>
			<Cell x={cell.x} y={cell.y} key={cell.x + "/" + cell.y}>
				{props.pieces
					.filter( p => (p.x == cell.x && p.y == cell.y))
					.map(p =>
						<Piece
							name={p.name}
							player={p.player}
							size={p.size}
							key={cell.x + "/" + cell.y + "/" + p.name}
						/>
					)
				}
			</Cell>
		)}
	</div>
};