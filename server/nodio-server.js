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
				_playlist[i] = _generateItemHash(playlist[i].file);
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
			throw new Error("ERROR : COULD NOT listallinfo : "+err);
		}
		for( i in items ) {
			if( items[i].directory == null ) {
				var hash = _generateItemHash(items[i].file);
				_items[hash] = _objectFactory.Item(items[i]);
				_itemFiles[hash] = items[i].file;
			}
		}
	});

	_mpdClient.on('changed', function(updateEvent) {
		/*
		Update Events
		update: a database update has started or finished.
		database: the song database has been modified after update.
		stored_playlist: a stored playlist has been modified.
		playlist: the current playlist has been modified.
		output: an audio output has been enabled or disabled.
		sticker: the sticker database has been modified.
		subscription: a client has subscribed or unsubscribed to a channel.
		 */
		if( updateEvent == "player" || 
			updateEvent == "mixer" ||
			updateEvent == "options" ) {
			_updatePlayerStatus(function() {
				_socketEvents.serverPlayerStatus(_io.sockets,_playerStatus);
			});
		} else if ( updateEvent == "playlist" ) {
			_updatePlaylist(function() {
				_socketEvents.serverCurrentPlaylist(_io.sockets, _playlist);
			});
		}
	});

	_io.sockets.on('connection', function (socket) {

		_socketEvents.serverItems(socket, _items);

		_socketEvents.serverCurrentPlaylist(socket, _playlist);
		
		socket.on('clientVolume', function (data) {
			if( data.volume == null ) {
				_socketEvents.serverError(socket, "No volume provided.");
			}
			_playerStatus.volume = parseInt(data.volume);
			if( _playerStatus.state == "play" ) {
				_mpdClient.setvol(_playerStatus.volume, function (err) {
					if( err ) {
						_socketEvents.serverError(socket, "Error: setting volume not supported on this installation.");
					}
				});
			}
		});

		socket.on('clientPlay', function (data) {
			_mpdClient.play(function (err) {
				if( err ) {
					_socketEvents.serverError(socket, err);
				}
			});
		});

		socket.on('clientPause', function (data) {
			_mpdClient.toggle(function (err) {
				if( err ) {
					_socketEvents.serverError(socket, err);
				}
			});
		});

		socket.on('clientNext', function (data) {
			_mpdClient.next(function (err) {
				if( err ) {
					_socketEvents.serverError(socket, err);
				}
			});
		});

		socket.on('clientPrevious', function (data) {
			_mpdClient.previous(function (err) {
				if( err ) {
					_socketEvents.serverError(socket, err);
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

		socket.on('clientPlaylistCurrentMoveItem', function (data) {
			if( data.indexFrom == null || 
				data.indexTo == null ||
				_playlist[data.indexFrom] == null ) {
				_socketEvents.serverError(socket, "Missing required parameters or invalid index.");
				return;
			}
			_mpdClient.move([data.indexFrom, data.indexTo], function (err) {
				if( err ) {
					_socketEvents.serverError(socket, "Error moving item in playlist: "+err);
					return;
				}
				// Push entire playlist or move event ?
				// _socketEvents.serverPlaylistCurrentMoveItem(socket, data.indexFrom, data.indexTo);
				// _socketEvents.serverPlaylistCurrentMoveItem(socket.broadcast, data.indexFrom, data.indexTo);
			});
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
