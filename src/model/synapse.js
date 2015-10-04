var config = require('../config.js');
var bignum = require('bignum');

var Synapse = function(inputBit) {
	this.inputBit = inputBit;
	this.permanence = config.connectedPerm - config.initPermanenceRange +  (2 * Math.random() * config.initPermanenceRange);
}

Synapse.prototype.getPermanence = function() {
	return this.permanence;
}

Synapse.prototype.toString = function() {
	return "Synapse for input bit " + this.inputBit + " permanance = " + this.permanence;
}

Synapse.prototype.getInputValue = function(bigIntInput) {

	return (bigIntInput.shiftRight(this.inputBit)) & 1;
}

Synapse.prototype.learn = function(bigIntInput) {
	if (this.getInputValue(bigIntInput)) {
		//console.log("Inc : " + this.toString());
		this.permanence = this.permanence + config.permanenceInc;
		this.permanence = Math.min(1.0, this.permanence);
	} else {
		//console.log("Dec : " + this.toString());
		this.permanence = this.permanence - config.permanenceInc;
		this.permanence = Math.max(0.0, this.permanence);
	}
}

Synapse.prototype.increasePermanence = function(permInc){
	this.permanence = this.permanence + permInc;
}

module.exports = Synapse;