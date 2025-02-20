void function(){
	const onResize = function(ev){
		const width = document.documentElement.clientWidth;
		const height = document.documentElement.clientHeight;
		const magnitudeNormal = Math.min(width / 1060, height / 2006);
		const magnitudeWide = Math.min(width / 1628, height / (1146 + 190));
		const magnitude = Math.max(magnitudeNormal, magnitudeWide);
		const widthOriginal = (magnitude == magnitudeNormal) ? 1060 : 1628;
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