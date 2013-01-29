(function() {
  var Application, _ref;

  if ((_ref = window.Nodio) == null) {
    window.Nodio = {};
  }

  Application = (function() {

    function Application() {
      var song, song_queue;
      song_queue = new window.Nodio.Queue();
      song = new window.Nodio.Song();
      song_queue.add(song);
      if (typeof console !== "undefined" && console !== null) {
        console.log(song_queue);
      }
    }

    return Application;

  })();

  $(function() {
    var nodio;
    return nodio = new Application();
  });

}).call(this);
