const Util = {};

Util.Queue = function(){
	this.array = [];
	this.index = 0;
}
Util.Queue.prototype.push = function(item){
	this.array.push(item);
}
Util.Queue.prototype.pop = function(){
	const res = this.array[this.index];
	this.array[this.index] = void 0;
	this.index ++;
	return res;
}
Util.Queue.prototype.peek = function(){
	return this.array[this.index];
}
Util.Queue.prototype.getLength = function(){
	return this.array.length - this.index;
}
Util.Queue.prototype.getHasItem = function(){
	return this.array.length > this.lndex;
}
