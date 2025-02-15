const Piece = function(props){
	const name = props.piece.entity.names[props.position.face];
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
		<div class="piece-image">
			<img src={`images/${name}.png`} />
		</div>
	</div>
}