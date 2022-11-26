const Cell = function(props){
	return <div
		className={[
			"cell",
			(props.canAccept ? "accepting" : ""),
			(props.isLastCell ? "last-move-cell" : "")
		].join(" ")}
		style={{
			gridRow: (props.cell.x + 1),
			gridColumn: (props.cell.y + 1),
		}}
		onClick={() => props.onClick(props.cell)}
	>
		{props.children}
	</div>
}