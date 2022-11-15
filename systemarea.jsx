const SystemArea = function(props){
	return <div className="systemarea">
		<div className={[
			"turn-indicator",
			"player" + props.player,
			(props.isActive ? "active" : "")
			].join(" ")} />
	</div>
}