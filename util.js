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

// 仮に双方向リストで実装　挿入O(n)、修正O(n)、トップ参照O(1)
// 双方向リストなのでメモリ解放が気になるかも
Util.PriorityQueue = function(){
	this.bidi = new Util.Bidi();
}
Util.PriorityQueue.prototype.push = function(item, id, value){
	this.bidi.popId(id);
	this.bidi.insert({ item, id, value });
}
Util.PriorityQueue.prototype.repush = function(id, value){
	const entry = this.bidi.popId(id);
	this.bidi.insert({ ...entry, value });
}
Util.PriorityQueue.prototype.pop = function(){
	return this.bidi.popRoot();
}
Util.PriorityQueue.prototype.peek = function(){
	return this.bidi.peekRoot();
}
Util.PriorityQueue.prototype.toArray = function(){
	return this.bidi.toArray();
}

Util.Bidi = function(){
	this.root = null;
}
Util.Bidi.prototype.insert = function(entry){
	const listItem = { entry, left: null, right: null};
	if( ! this.root) this.root = listItem;
	else if(entry.value < this.root.entry.value){
		listItem.right = this.root, this.root.left = listItem;
		this.root = listItem;
	}
	else{
		let left = this.root;
		while(left.right && left.right.entry.value < entry.value) left = left.right;
		if(left.right) left.right.left = listItem, listItem.right = left.right;
		left.right = listItem, listItem.left = left;
	}
}
Util.Bidi.prototype.popId = function(id){
	let listItem = this.root;
	while(listItem && listItem.entry.id != id) listItem = listItem.right;
	if(listItem) this.remove(listItem);
	return listItem?.entry;
}
Util.Bidi.prototype.popRoot = function(){
	let listItem = this.root;
	this.remove(listItem);
	return listItem.entry;
}
Util.Bidi.prototype.peekRoot = function(){
	return this.root.entry;
}
Util.Bidi.prototype.remove = function(listItem){
	if(listItem.left) listItem.left.right = listItem.right;
	if(listItem.right) listItem.right.left = listItem.left;
	if(this.root == listItem) this.root = listItem.right;
	listItem.left = null, listItem.right = null;
}
Util.Bidi.prototype.toArray = function(){
	const array = [];
	for(let listItem = this.root; listItem; listItem = listItem.right){
		array.push(listItem.entry);
	}
	return array;
}