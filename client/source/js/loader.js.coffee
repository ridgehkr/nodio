#= require libs/yepnope-1.5.min.js

# the Nodio packaging object
window.Nodio ?=
	models: {}

# load all required scripts in order
# NOTE: the backbone script includes Underscore via Sprockets
yepnope([
	{
	# load the application
	load: ['js/backbone-loader.js', '//cdnjs.cloudflare.com/ajax/libs/jquery/1.9.0/jquery.min.js']
	complete: ->
		if !window.jQuery
			yepnope 'js/libs/jquery-1.9.0.min.js'
	},
	{
		load: ['/socket.io/socket.io.js', 'js/script.js']
	}
])