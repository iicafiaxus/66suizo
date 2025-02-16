const Sound = function (url) {
	this.audio = document.createElement("audio");
	this.audio.src = url;
};
Sound.prototype.play = function(){
	this.audio.play();
}
