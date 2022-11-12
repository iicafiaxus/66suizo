let Piece = function(props){
	return <div className={"piece player" + props.player + " size" + props.size}>
		{props.name}
	</div>
}