var bignum = require('bignum');

//Expecting all input data as bignum instances
var ScalarEncoder = function(minValue,maxValue,radius) {

	if (maxValue.le(minValue)) {
		throw "Expecting maxValue to be bigger than minValue";
	}

	if (radius.lt(minValue) || radius.gt(maxValue)) {
		throw "Expecting radius to be within minValue...maxValue range";
	}

	this.radius = radius;
	this.minValue = minValue;


	this.bucketCount 	 =	Math.ceil(maxValue.sub(minValue).div(radius));
	// bitsNumber = width + bucketCount - 1;
	
	// As found in Numenta video
	this.bitWidth = 21;

}

ScalarEncoder.prototype.getPerceptionFieldSize = function(){
	return this.bucketCount;
}

ScalarEncoder.prototype.encode = function(bigIntInput){

	counter = Math.ceil(bigIntInput.sub(this.minValue).div(this.radius));

	return bignum(2).pow(this.bitWidth).sub(1).shiftLeft(counter);

};

module.exports = ScalarEncoder;