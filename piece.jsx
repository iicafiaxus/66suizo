const Piece = function(props){
	return <div
		className={[
			"piece",
			"player" + props.position.player,
			"size" + props.piece.entity.size,
			"face" + props.position.face,
			(props.position.isFloating ? " floating" : ""),
			(props.isPickable ? " pickable" : "")
		].join(" ")}
		onClick={() => props.onClick(props.piece)}
		onDoubleClick={() => props.onDoubleClick(props.piece)}
	>
		{props.piece.entity.names[props.position.face]}
	</div>
}