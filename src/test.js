

var num = bignum(4);

for (i=1;i<100;i++) {
	num = num.shiftRight(1);
	val = num & 1;
	console.log(val.toString(2));
}

