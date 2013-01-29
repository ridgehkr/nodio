#= require libs/yepnope-1.5.min.js

yepnope([
	{
		load: '//cdnjs.cloudflare.com/ajax/libs/jquery/1.9.0/jquery.min.js'
		complete: ->
			if !window.jQuery
				yepnope 'js/libs/jquery-1.9.0.min.js'
	},
	{
		load: ['js/libs/backbone-0.9.10.min.js', 'js/script.js']
		# add '/socket.io/socket.io.js' to load on deploy
	}
])