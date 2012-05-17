
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , arduino = require('duino');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});


var board = new arduino.Board({
  debug: true
});

var led = new arduino.Led({
  board: board,
  pin: "12"
});

for (var i = 2; i < 10;i++)
{
  board.pinMode(i, 'out');
}


var socketio = require('socket.io');
var io = socketio.listen(app);
var count = 0;
io.sockets.on('connection', function(socket){
  socket.on('handClose', function(){ board.digitalWrite(3, board.HIGH); setTimeout(function(){ board.digitalWrite(3, board.LOW); }, 1000); });
  socket.on('handOpen', function(){ board.digitalWrite(2, board.HIGH); setTimeout(function(){ board.digitalWrite(2, board.LOW); }, 1000); });
  socket.on('1stUp', function(){ board.digitalWrite(4, board.HIGH); setTimeout(function(){ board.digitalWrite(4, board.LOW); }, 1000); });
  socket.on('1stDown', function(){ board.digitalWrite(5, board.HIGH); setTimeout(function(){ board.digitalWrite(5, board.LOW); }, 1000); });
  socket.on('2ndUp', function(){ board.digitalWrite(7, board.HIGH); setTimeout(function(){ board.digitalWrite(7, board.LOW); }, 1000); });
  socket.on('2ndDown', function(){ board.digitalWrite(6, board.HIGH); setTimeout(function(){ board.digitalWrite(6, board.LOW); }, 1000); });
  socket.on('turnLeft', function(){ board.digitalWrite(9, board.HIGH); setTimeout(function(){ board.digitalWrite(9, board.LOW); }, 1000); });
  socket.on('turnRight', function(){ board.digitalWrite(8, board.HIGH); setTimeout(function(){ board.digitalWrite(8, board.LOW); }, 1000); });
});
/*
setInterval(function() {
  var date = new Date();
  count++;
  io.sockets.emit('tick', date, count);
  console.log('AFTER: emit(): ' + date + ',' + count);
  if (count % 2 == 0) { led.on(); }
  else { led.off(); }
}, 1000);
*/
