const Sound = function (url) {
	this.audio = document.createElement("audio");
	this.audio.src = url;
};
Sound.prototype.play = function(){
	this.audio.currentTime = 0.0;
	this.audio.play();
}

const moveSound = new Sound("sound/place-glass-object-81857-modified.mp3");
const errorSound = new Sound("sound/error-126627-modified.mp3");
const pickUpSound = new Sound("sound/toothbrush_picking_up-39991-modified.mp3");
const alertSound = new Sound("sound/level-up-3-199576-modified.mp3");