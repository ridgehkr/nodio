# UI CLASSES

# A generic HTML element that is used to represent UI elements of Nodio
class UI_Element
	constructor: (element_html) ->
		@$element = $(element_html)

	# trigger an event and its callback to the UI element.
	# optionally specify a DOM event to trigger this event, too
	attach_event: (nodio_event, callback, dom_event) ->
		@$element.bind nodio_event, callback
		if dom_event?
			@$element.on dom_event, =>
				@$element.trigger nodio_event


# Builds a UI link that represents the song object passed in
# @param song: an instance of Song
class SongLink extends UI_Element
	constructor: (song) ->
		element_html = "<a class='song-link' href='#'><i class='icon-play-circle2 icon'></i>#{song.title}</a>"
		super element_html

	attach_event: (nodio_event, callback, dom_event) -> 
		super nodio_event, callback, dom_event

# end UI

# MEDIA ITEMS

# A single audio track with track meta data
class Song
	constructor: (title, artist, duration) ->
		@title = title
		@artist = artist
		@duration = duration

# A group of songs. Could represent any sequence of song items
# @param songs: an array of Song instances
class SongCollection
	constructor: (@songs) ->

	add: (song) ->
		@songs.push song

# end Media Items


# Application
class Nodio
	constructor: (@app_ready) ->
		@socket = io.connect()
		_library = new SongCollection()
		@socket.on 'serverItems', (data) =>
			_library = for item, song of data.items when song.title?
				new Song( song.title, song.artist, song.duration )

			@library = new SongCollection(_library)
			@app_ready?()

$ ->
	nodio = new Nodio ->
		# just testing out the shiny new collection and song objects
		$('#song-list').append("<li class='row-action row'><a class='song-link' href='#'><i class='icon-play-circle2 icon'></i>#{song.title}</a></li>") for song in nodio.library.songs
