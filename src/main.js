var bignum = require('bignum');
var Brain = require ('./model/brain.js');

var Column = require ('./model/column.js');

perceptionFieldSize = 100;

brain = new Brain(perceptionFieldSize)

brain.process(bignum(22));

var	count = 0;

brain.columns.forEach(function(col){
	if (col.active == true)
		count = count + 1;
})
	console.log(count);
