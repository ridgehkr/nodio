window.Nodio.models.Song = Backbone.Model.extend
	defaults:
		title: ''
		artist: ''
		length: 0

	play: ->
		console?.log 'playing a song'

window.Nodio.models.Queue = Backbone.Collection.extend
	model: window.Nodio.models.Song