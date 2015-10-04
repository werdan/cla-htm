var config = require ('../config.js');
var Synapse = require('./synapse.js');
var bignum = require('bignum');

var Column = function (id, inputVectorSize) {
	this.id = id;
	this.boost   = 1;
	this.active = false;
	this.synapses = [];
	this.neighbors = [];
	//bitmask used to limit dutyCycleMemory
	this.dutyCycleLimiter = bignum(2).pow(config.dutyCycleMemoryLength).sub(1);
	this.dutyCycle = bignum(0);
	this.overlapDutyCycle = bignum(0);


	for (var i = 0; i <= inputVectorSize; i++) {
		if (Math.random() >= config.columnConnectedness) {
			synapse = new Synapse(i);
			this.synapses.push(synapse);
		}
	}
}

Column.prototype.setActive = function(active) {
	this.active = active;
	//Maintain dutyCycle moving average
	dutyCycleBit = 0; 
	if (active) {
		dutyCycleBit = 1;
	}
	this.dutyCycle = this.dutyCycle.shiftLeft(1).add(dutyCycleBit).and(this.dutyCycleLimiter);
}

Column.prototype.getOverlap = function(bigIntInput){

	overlap = 0;
	this.getConnectedSynapses().forEach(function(synapse){
		// console.log(synapse);
		// console.log(synapse.getInputValue(bigIntInput));
		overlap = overlap + synapse.getInputValue(bigIntInput);
	});

	if (overlap < config.minOverlap) {
		this.overlapDutyCycle = this.overlapDutyCycle.shiftLeft(1).add(0).and(this.dutyCycleLimiter);
		return 0;
	} else {
		this.overlapDutyCycle = this.overlapDutyCycle.shiftLeft(1).add(1).and(this.dutyCycleLimiter);
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

Column.prototype.learn = function(bigIntInput) {

	if (this.active) {
		this.synapses.forEach(function(s){
			s.learn(bigIntInput);
		});		
	}

	var maxNeighborDutyCycle = 0;

	this.neighbors.forEach(function(neighborColumn) {
		maxNeighborDutyCycle = Math.max(neighborColumn.dutyCycle, maxNeighborDutyCycle);
	});

	var minDutyCycle = config.minColumnActivity * maxNeighborDutyCycle;
	var activeDutyCycle = this.getActiveDutyCycle();
	this.boost = this.boostFunction(activeDutyCycle, minDutyCycle);

	if (this.getOverlapDutyCycle() < minDutyCycle) {
		this.increasePermanence(0.1 * config.connectedPerm);
	}

}

Column.prototype.getActiveDutyCycle = function(dc) {
	dc = typeof dc !== 'undefined' ? dc : this.dutyCycle;

	var activeDutyCycle = 0;
	for (di = 0; di <= (config.dutyCycleMemoryLength); di++) {
		activeDutyCycle = activeDutyCycle + dc.shiftRight(di).and(1).toNumber();
	}
	return activeDutyCycle; 
}

Column.prototype.getOverlapDutyCycle = function() {
	return this.getActiveDutyCycle(this.overlapDutyCycle);
}

Column.prototype.boostFunction = function(activeDutyCycle, minDutyCycle) {
	if (activeDutyCycle > minDutyCycle) {
		return 1;
	} else {
		return 1 + (minDutyCycle - activeDutyCycle)/2;
	}
}

Column.prototype.increasePermanence = function(permInc) {
	this.synapses.forEach(function(s){
		s.increasePermanence(permInc); 
	})
}

module.exports = Column;