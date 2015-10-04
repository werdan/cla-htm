var bignum = require('bignum');
var Brain = require ('./model/brain.js');

var Column = require ('./model/column.js');

brainConfig = {
	minValue : 1,
	maxValue : 1000,
	radius   : 10
}

brain = new Brain(brainConfig);

for (cycle = 0; cycle < 30; cycle++) {

	brain.process(bignum(22));

	var	count = 0;
	var activeColumns = [];

	brain.columns.forEach(function(col){
		if (col.active == true) {
			count = count + 1;
			activeColumns.push(col.id);
		}
	})
		console.log(activeColumns);
		console.log(count);

}