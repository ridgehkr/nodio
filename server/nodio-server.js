/**
 * nodio
 * nodio-server
 */

exports = module.exports = function(params) {
	
	var _baseDirectory = params.baseDirectory != undefined ? params.baseDirectory : null;
	var _io = params.io != undefined ? params.io : null;
	var _mpdClient = params.mpdClient != undefined ? params.mpdClient : null;
	var _crypto = params.crypto != undefined ? params.crypto : null;

	var _objectFactory = require(_baseDirectory+'/libs/object-factory');
	var _socketEvents = require(_baseDirectory+'/libs/socket-events');

	if( _io == null ||
		_mpdClient == null ||
		_crypto == null ) {
		throw new Error("Server module could not be started - missing required parameters.");
	}

	_mpdClient.clear();
	
	var _items = {};		// Key = _generateItemHash(file)
	var _itemFiles = {};	// Key = _items Key
	var _playlists = {};	// TODO - Load from cache
	var _playerStatus = {};	
	var _playlist = [];		

	_generateItemHash = function (file) {
		return _crypto.createHash('md5').update(file).digest("hex");
	}
	
	_updatePlayerStatus = function (callback) {
		_mpdClient.status(function (err, status) {
			if( err ) {
				throw new Error(err);
			}
			// Debugger
			// console.log(status);
			_playerStatus.state = status.state != null ? status.state : "pause";
			_playerStatus.repeat = status.repeat != null && status.repeat == "1" ? true : false;
			_playerStatus.random = status.random != null && status.random == "1" ? true : false;
			_playerStatus.volume = status.volume != null && status.volume >= 0 ? status.volume : 50;
			_playerStatus.elapsed = status.elapsed != null ? parseInt(status.elapsed) : 0;
			_mpdClient.currentsong(function (err, item) {
				if( item.file != null ) {
					_playerStatus.currentItem = _generateItemHash(item.file);
					callback();
				}
			});
		});
	}

	_updatePlaylist = function (callback) {
		_mpdClient.playlist(function (err, playlist) {
			if( err ) {
				throw new Error(err);
			}
			_playlist.length = 0;
			for( i in playlist ) {
				_playlist[i] = _generateItemHash(playlist[i]);
			}
			if( callback ) {
				callback();
			}
		});
	}

	_updatePlaylist();

	_mpdClient.currentsong(function (err, item) {
		if( err ) {
			throw new Error(err);
		}
		if( item.file != null ) {
			_currentItem = _generateItemHash(item.file);
		}
	});

	// Load up our database.
	_mpdClient.listallinfo('/',function(err,items) {
		if( err ) {
			console.log("ERROR : COULD NOT listallinfo : "+err);
		}
		for( i in items ) {
			if( items[i].directory == null ) {
				var hash = _generateItemHash(items[i].file);
				_items[hash] = _objectFactory.Item(items[i]);
				_itemFiles[hash] = items[i].file;
			}
		}
	});

	_io.sockets.on('connection', function (socket) {

		_socketEvents.serverItems(socket, _items);
		
		socket.on('clientVolume', function (data) {
			if( data.volume == null ) {
				_socketEvents.serverError(socket, "No volume provided.");
			}
			_playerStatus.volume = parseInt(data.volume);
			if( _playerStatus.state == "play" ) {
				_mpdClient.setvol(_playerStatus.volume, function (err) {
					if( err ) {
						_socketEvents.serverError(socket, "Error setting volume: "+err);
						console.log(err);
					}
					_updatePlayerStatus(function () {
						_socketEvents.serverPlayerStatus(socket,_playerStatus);
						_socketEvents.serverPlayerStatus(socket.broadcast,_playerStatus);
					});
				});
			}
		});

		socket.on('clientPlay', function (data) {
			_mpdClient.play(function (err) {
				if( err ) {
					_socketEvents.serverError(socket, err);
				} else {
					_updatePlayerStatus(function () {
						_socketEvents.serverPlayerStatus(socket,_playerStatus);
						_socketEvents.serverPlayerStatus(socket.broadcast,_playerStatus);
					});
				}
			});
		});

		socket.on('clientPause', function (data) {
			_mpdClient.toggle(function (err) {
				if( err ) {
					_socketEvents.serverError(socket, err);
				} else {
					_updatePlayerStatus(function () {
						_socketEvents.serverPlayerStatus(socket,_playerStatus);
						_socketEvents.serverPlayerStatus(socket.broadcast,_playerStatus);
					});
				}
			});
		});

		socket.on('clientNext', function (data) {
			_mpdClient.next(function (err) {
				if( err ) {
					_socketEvents.serverError(socket, err);
				} else {
					_updatePlayerStatus(function () {
						_socketEvents.serverPlayerStatus(socket,_playerStatus);
						_socketEvents.serverPlayerStatus(socket.broadcast,_playerStatus);
					});
				}
			});
		});

		socket.on('clientPrevious', function (data) {
			_mpdClient.previous(function (err) {
				if( err ) {
					_socketEvents.serverError(socket, err);
				} else {
					_updatePlayerStatus(function () {
						_socketEvents.serverPlayerStatus(socket,_playerStatus);
						_socketEvents.serverPlayerStatus(socket.broadcast,_playerStatus);
					});
				}
			});
		});

		socket.on('clientPlaylistCurrentAddItem', function (data) {
			if( data.hash != null &&
				_itemFiles[data.hash] != null ) {
				_mpdClient.add(_itemFiles[data.hash], function (err) {
					if( err ) {
						_socketEvents.serverError(socket, "Error adding item to playlist: "+err);
					} else {
						_socketEvents.serverPlaylistCurrentAddItem(socket,data.hash);
						_socketEvents.serverPlaylistCurrentAddItem(socket.broadcast,data.hash);
					}
				});
			}
		});

		// clientPlaylistSaveCurrent
		// 
		// clientPlaylistCreate
		// 
		// clientPlaylistAddItem
		// 
		// clientPlaylistLoad

	});

};
