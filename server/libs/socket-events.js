/**
 * Nodio
 * Socket Events.
 */

exports.serverError = (function (socket, error) {
	socket.emit('serverError', {
		error: error
	});
});

exports.serverItems = (function (socket, items) {
	socket.emit('serverItems', {
		items: items
	});
});

exports.serverCurrentPlaylist = (function (socket, playlist) {
	socket.emit('serverCurrentPlaylist', {
		playlist: playlist
	});
});

exports.serverPlaylistCurrentAddItem = (function (socket, hash) {
	socket.emit('serverPlaylistCurrentAddItem', {
		hash: hash
	});
});

exports.serverPlaylistCurrentMoveItem = (function (socket, indexFrom, indexTo) {
	socket.emit('serverPlaylistCurrentMoveItem', {
		indexFrom: indexFrom,
		indexTo: indexTo
	});
});

exports.serverPlayerStatus = (function (socket, playerStatus) {
	socket.emit('serverPlayerStatus', {
		playerStatus: playerStatus
	});
});

