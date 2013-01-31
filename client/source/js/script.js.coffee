class Nodio

	constructor: () ->

		socket = io.connect();
		$song_list = $ '#song-list'
		song_list_html = ''
		socket.on 'serverItems', (data) ->
			song_titles = for items, song of data.items
				song if song.title?

			song_list_html += '<li class="row"><a class="row-action" href="#"><i class="icon-play-circle2 icon"></i>' + song.title + '</a></li>' for song in song_titles when song?

			$song_list.append song_list_html

$ ->
	nodio = new Nodio()