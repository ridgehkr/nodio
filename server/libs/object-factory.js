/**
 * nodio
 * Library models
 */

exports.Playlist = (function (name) {
	var playlist = {};

	playlist.name = name;
	playlist.items = [];

	return playlist;
});

exports.Item = (function (item) {
	var fileItem = {};

	fileItem.type = "file";
	fileItem.artist = item.Artist;
	fileItem.album = item.Album;
	fileItem.title = item.Title;
	fileItem.duration = item.Time;

	return fileItem;
});

/*
exports.StreamItem = (function (item) {
	var streamItem = {};

	streamItem.type = "stream";
	streamItem.title = item.title;

	return streamItem;
});
*/