/**
 * nodio
 * nodio-server
 */

exports = module.exports = function(params) {
	var _baseDirectory = params.baseDirectory != undefined ? params.baseDirectory : null;
	var _app = params.app != undefined ? params.app : null;

	if( _baseDirectory == null || 
		_app == null ) {
		throw new Error("Client module could not be started - missing required parameters.");
	}

	_app.get('/css/*', function (req, res) {
		res.sendfile(_baseDirectory+'/css/'+req.params[0]);
	});

	_app.get('/js/*', function (req, res) {
		res.sendfile(_baseDirectory+'/js/'+req.params[0]);
	});
	
	_app.get('/images/*', function (req, res) {
		res.sendfile(_baseDirectory+'/images/'+req.params[0]);
	});

	_app.get('/', function (req, res) {
	  res.sendfile(_baseDirectory + '/index.html');
	});
}