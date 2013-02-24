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
		res.sendfile(_baseDirectory+'/build-fork/css/'+req.params[0]);
	});

	_app.get('/js/*', function (req, res) {
		res.sendfile(_baseDirectory+'/build-fork/js/'+req.params[0]);
	});
	
	_app.get('/images/*', function (req, res) {
		res.sendfile(_baseDirectory+'/build-fork/images/'+req.params[0]);
	});

	_app.get('/fonts/*', function (req, res) {
		res.sendfile(_baseDirectory+'/build-fork/fonts/'+req.params[0]);
	});

	_app.get('/index_demo.html', function (req, res) {
	  res.sendfile(_baseDirectory + '/index_demo.html');
	});

	_app.get('/', function (req, res) {
	  res.sendfile(_baseDirectory + '/build-fork/index.html');
	});

}