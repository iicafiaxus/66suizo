const SystemArea = function(props){

	const formatTime = (ms) => {
		const sec = Math.floor(ms / 1000);
		const min = Math.floor(sec / 60);
		return [
			fill("00", min) + ":",
			fill("00", sec - min * 60)
		].join("");
	}

	const fill = (filler, text) => {
		const fillertext = "" + filler + text;
		return fillertext.substring(fillertext.length - filler.length);
	}

	return <React.Fragment>
		<div className="systemarea">
			{props.buttons && <div className="system-buttons">
				{props.buttons.map((button, i) => <span key={i}>{button}</span>)}
			</div>}
			<div className="status">
				{props.status}
			</div>
			<div className="timers">
				<div className={"timer player1" + (props.turn == 1 ? " active" : "")}>
					{formatTime(props.times[1])}
				</div>
				<div className={"timer player0" + (props.turn == 0 ? " active" : "")}>
					{formatTime(props.times[0])}
				</div>
			</div>
		</div>
	</React.Fragment>
}