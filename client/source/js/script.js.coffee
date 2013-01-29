class Nodio

	constructor: () ->

		# @socket = io.connect()

		@song_queue = new window.Nodio.models.Queue()
		song = new window.Nodio.models.Song()
		@song_queue.add( song )

$ ->
	nodio = new Nodio()

	console?.log 'Application loaded.'