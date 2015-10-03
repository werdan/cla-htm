var config = require ('../config.js');
var Synapse = require('./synapse.js');

var Column = function (id, inputVectorSize) {
	this.id = id;
	this.boost   = 1;
	this.active = false;
	this.synapses = [];


	for (var i = 0; i <= inputVectorSize; i++) {
		if (Math.random() >= config.columnConnectedness) {
			synapse = new Synapse(i);
			this.synapses.push(synapse);
		}
	}
}

Column.prototype.getOverlap = function(bigIntInput){

	overlap = 0;
	this.getConnectedSynapses().forEach(function(synapse){
		// console.log(synapse);
		// console.log(synapse.getInputValue(bigIntInput));
		overlap = overlap + synapse.getInputValue(bigIntInput);
	});

	if (overlap < config.minOverlap) {
		return 0;
	} else {
		return overlap * this.boost;
	}

}

Column.prototype.getConnectedSynapses = function() {
	var connectedSynapses = [];

	this.synapses.forEach(function(synapse){
		if (synapse.getPermanence() >= config.connectedPerm) {
			connectedSynapses.push(synapse);			
		}
	});

	return connectedSynapses;
}

Column.prototype.toString = function() {
	output = "";
	output = output + "Column " + this.id + "\n";

	this.synapses.forEach(function(synapse){
		output = output + this.synapse.toString() + "\n";
	}); 

	return output;
}

module.exports = Column;