const Piece = function(props){
	return <div
		className={[
			"piece",
			"player" + props.position.player,
			"size" + props.piece.entity.size,
			"face" + props.position.face,
			(props.isFloating ? " floating" : ""),
			(props.isPickable ? " pickable" : "")
		].join(" ")}
		onClick={(ev) => (props.onClick(ev, props.piece))}
	>
		{props.piece.entity.names[props.position.face]}
	</div>
}