const SystemArea = function(props){

	const formatTime = (ms) => {
		const sec = Math.floor(ms / 1000);
		const min = Math.floor(sec / 60);
		const hour = Math.floor(min / 60);
		return [
			fill("00", min) + ":",
			fill("00", sec - min * 60)
		].join("");
	}

	const fill = (filler, text) => {
		const fillertext = "" + filler + text;
		return fillertext.substring(fillertext.length - filler.length);
	}

	return <div className={"systemarea" + (props.isActive ? " active" : "")}>
		<div className="timer">{formatTime(props.time)}</div>
		<div className={[
			"turn-indicator",
			"player" + props.player,
			].join(" ")} />
	</div>
}