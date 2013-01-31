var express = require('express');
var app = express();
var server = require('http').createServer(app);

var io = require('socket.io').listen(server,{log: false});

server.listen(process.env.PORT || 1337);

// Client ( static )
var nodioClient = require('./client/nodio-client')({
  app: app,
  baseDirectory: __dirname+'/client'
});

// Server
var mpd = require('komponist');
var crypto = require('crypto');

mpd.createConnection(function(err, mpdClient) {
	if( err ) {
		throw new Error("Error connecting to MPD: "+err);
	}

	// Init music server here.
	var nodioServer = require('./server/nodio-server')({
		io: io,
		mpdClient: mpdClient,
		crypto: crypto,
		baseDirectory: __dirname+'/server'
	});

});
