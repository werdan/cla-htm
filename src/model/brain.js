var config = require('../config.js');
var ScalarEncoder = require('../encoders/scalar.js');
var Column = require('./column.js');
var bignum = require('bignum');

var Brain = function(perceptionFieldBitSize) {

	this.columns = [];
	this.inputEncoder = new ScalarEncoder(bignum(1),bignum(1000),bignum(10));

	for (var i = 0; i <= config.columnCount; i++) {
			column = new Column(i,perceptionFieldBitSize);
			this.columns.push(column);
	}
}

Brain.prototype.process = function(bigIntInput){
	
	encodedInput = this.inputEncoder.encode(bigIntInput);
	overlapMap = this.calculateOverlap(encodedInput);
	this.inhibit(overlapMap, this.columns);	
}


Brain.prototype.calculateOverlap = function(bigIntInput){
	
	var overlapMap = {};

	this.columns.forEach(function(column){
		overlap = column.getOverlap(bigIntInput);
		if (overlap>0) {
			overlapMap[column.id] = overlap;			
		}
	});

	return overlapMap;
}


Brain.prototype.kthScore = function(arrayNeighborColumns, desiredLocalActivity, overlapMap) {
	
	neighborsOverlapArray = [];

	arrayNeighborColumns.forEach(function(column){
		neighborsOverlapArray.push(overlapMap[column.id]);
	});

	compareFunction = function compareNumbers(a, b) {
  		return b-a;
	}

	neighborsOverlapArray.sort(compareFunction);

	return neighborsOverlapArray[desiredLocalActivity-1] || neighborsOverlapArray[neighborsOverlapArray.length-1];

}

Brain.prototype.neighbors = function(centralColumn, columns) {
	
	var arrayNeighborColumns = [];
	var leftBorderId = centralColumn.id - config.inbitionRadius;
	var rightBorderId = centralColumn.id + config.inbitionRadius;

	columns.forEach(function(column){
		if (column.id >= leftBorderId && 
			column.id <= rightBorderId) {
			
			arrayNeighborColumns.push(column);
		}  		
	});


	return arrayNeighborColumns;

}

Brain.prototype.inhibit = function(overlapMap, columns) {
	
	var thisbrain = this;

	this.columns.forEach(function(column){

		minLocalActivity = thisbrain.kthScore(thisbrain.neighbors(column, columns), config.desiredLocalActivity, overlapMap);

		if (overlapMap[column.id] > 0 && overlapMap[column.id] > minLocalActivity) {
			column.active = true;
		} 

	});
}



module.exports = Brain;