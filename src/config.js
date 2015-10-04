var config = {};

config.minOverlap = 0;
config.connectedPerm = 0.2;

//Ration of input regions (bits) out of input vector connected single column
//Based on Numenta video it is 50%, meaning that every column is connected to 50% of inputs
config.columnConnectedness = 0.5;
config.initPermanenceRange = 0.1;

module.exports = config;

config.columnCount = 1000;

config.desiredLocalActivity = 3;
config.inbitionRadius = 25;

config.permanenceInc  = 0.1;

config.dutyCycleMemoryLength = 100;

config.minColumnActivity = 0.01;