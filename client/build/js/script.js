(function() {
  var Nodio;

  Nodio = (function() {

    function Nodio() {
      var $song_list, socket, song_list_html;
      socket = io.connect();
      $song_list = $('#song-list');
      song_list_html = '';
      socket.on('serverItems', function(data) {
        var items, song, song_titles, _i, _len;
        song_titles = (function() {
          var _ref, _results;
          _ref = data.items;
          _results = [];
          for (items in _ref) {
            song = _ref[items];
            if (song.title != null) {
              _results.push(song);
            } else {
              _results.push(void 0);
            }
          }
          return _results;
        })();
        for (_i = 0, _len = song_titles.length; _i < _len; _i++) {
          song = song_titles[_i];
          if (song != null) {
            song_list_html += '<li class="row"><a class="row-action" href="#"><i class="icon-play-circle2 icon"></i>' + song.title + '</a></li>';
          }
        }
        return $song_list.append(song_list_html);
      });
    }

    return Nodio;

  })();

  $(function() {
    var nodio;
    return nodio = new Nodio();
  });

}).call(this);
