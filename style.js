void function(){
	const onResize = function(ev){
		const width = document.documentElement.clientWidth;
		const height = document.documentElement.clientHeight;
		const magnitude = Math.max(
			Math.min(width / 980, height / 1760)
		);
		const widthOffset = (width / magnitude - 980) / 2;
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