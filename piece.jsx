const Piece = function(props){
	return <div
		className={[
			"piece",
			"player" + props.piece.player,
			"size" + props.piece.size,
			(props.isFloating ? " floating" : ""),
			(props.isPickable ? " pickable" : "")
		].join(" ")}
		onClick={() => props.onClick(props.piece)}
	>
		{props.piece.name}
	</div>
}