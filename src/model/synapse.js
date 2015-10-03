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
	return "Synapse for input bit " + this.inputBit + " permanance =" + this.permanence;
}

Synapse.prototype.getInputValue = function(bigIntInput) {
	return (bigIntInput.shiftRight(this.inputBit)) & 1;
}

module.exports = Synapse;