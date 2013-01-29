class Nodio
	constructor: () ->
		console?.log 'app constructor'
		# @socket = io.connect('hostname here')

		# @socket.on 'serverEvent', (data) ->
			# Do something;

$ ->
	app = new Nodio()
