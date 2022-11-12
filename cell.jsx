let Cell = function(props){
	return <div
		className="cell"
		style={{
			gridRow: (props.x + 1),
			gridColumn: (props.y + 1),
		}}
	>{props.children}</div>
}