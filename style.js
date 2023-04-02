void function(){
	const onResize = function(ev){
		const width = document.documentElement.clientWidth;
		const height = document.documentElement.clientHeight;
		const magnitudeNormal = Math.min(width / 980, height / 1760);
		const magnitudeWide = Math.min(width / 1548, height / 1106);
		const magnitude = Math.max(magnitudeNormal, magnitudeWide);
		const widthOriginal = (magnitude == magnitudeNormal) ? 980 : 1548;
		const widthOffset = (width / magnitude - widthOriginal) / 2;
		document.body.classList[(magnitude == magnitudeWide) ? "add" : "remove"]("wide");

		if( ! document.getElementById("style-all-magnitude")){
			const style = document.createElement("style");
			style.id = "style-all-magnitude";
			document.head.appendChild(style);
		}
		document.getElementById("style-all-magnitude").innerHTML = [
			`.game { `,
			`	transform: scale(${magnitude}) translate(${widthOffset}px, 0%);`,
			`	transform-origin: 0% 0%;`,
			`}`
		].join("\n");
	};
	window.addEventListener("resize", onResize);
	onResize();
}();