/**
 * nodio
 * Library models
 */

exports.FileItem = (function (item) {
	var fileItem = {};

	fileItem.type = "file";
	fileItem.artist = item.Artist;
	fileItem.album = item.Album;
	fileItem.title = item.Title;
	fileItem.duration = item.Time;

	return fileItem;
});
