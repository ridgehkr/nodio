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

exports.serverPlaylistCurrentAddItem = (function (socket, hash) {
	socket.emit('serverPlaylistCurrentAddItem', {
		hash: hash
	});
});

exports.serverPlayerStatus = (function (socket, playerStatus) {
	socket.emit('serverPlayerStatus', {
		playerStatus: playerStatus
	});
});