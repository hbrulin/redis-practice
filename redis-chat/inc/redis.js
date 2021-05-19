var redis = require('redis');

var pub = redis.createClient();
var sub = redis.createClient();

var persister = redis.createClient(); //persister will used to store published messages, so that they are available after the broadcast.

exports.pub = pub;
exports.sub = sub;
exports.persister = persister;