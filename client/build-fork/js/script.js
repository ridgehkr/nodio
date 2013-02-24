
// This will need some major cleanup 
var items = {};
var playlist = [];
var socket = io.connect();
var playlistCurrentIndex = null;

socket.on('serverItems', function (data) {
  for( i in data.items ) {
    items[i] = {};
    for( k in data.items[i] ) {
      items[i][k] = data.items[i][k];
    }
    items[i].hash = i;
    addItemToList(items[i]);
  }
});

function refreshPlaylist() {
  $('#playlist').html('');
  for( i in playlist ) {
    addItemToPlaylist(i);
  }
  if( playlist.length == 0 ) {
    $('#playlist').append('<li class="m-song-queue-item-blank">No songs currently playing.</li>');
  }
}

socket.on('serverCurrentPlaylist', function (data) {
  playlist.length = 0;
  for( i in data.playlist ) {
    playlist[i] = data.playlist[i];
  }
  refreshPlaylist();
});

socket.on('serverPlayerStatus', function (data) {
  playlistCurrentIndex = parseInt(data.playerStatus.playlistCurrentItemIndex);
  if( data.playerStatus.state == "play" ) {
    $('#play').hide();
    $('#pause').show();
  } else {
    $('#pause').hide();
    $('#play').show();
  }
  refreshPlaylist();
});

function addItemToList(item) {
  var html = '';
  html += '<li class="row-action row" data-hash="' + item.hash +'" data-artist="'+ item.artist + '" data-title="'+ item.title +'" data-album="'+ item.album +'">';
  html += '<a class="song-link" href="#">';
  html += '<i class="icon-play-circle2 icon"></i>';
  html += item.artist + ' - ' + item.title;
  html += '</a>';
  html += '</li>';
  $('#song-list').append(html)
}

function addItemToPlaylist(index) {
  var html = '';
  html += '<li class="m-song-queue-item '+ ( parseInt(index) == parseInt(playlistCurrentIndex) ? 'current' : '' ) +'" data-playlist-index="'+ index +'" data-item-key="' + playlist[index] + '">';
  html += '<i class="icon-play"><a href="#"></a></i>';
  html += '<a href="#">';
  html += 'Play ' + items[playlist[index]].title;
  html += '</a>';
  html += '<span class="song">'+ items[playlist[index]].title +'</span>';
  html += '<span class="artist">'+ items[playlist[index]].artist +'</span>';
  html += '</li>';
 
  $('#playlist').append(html);
}

$(function () {
  // Couple of hackish listeners.
  $('#song-list a.song-link').live('click', function (e) {
    e.preventDefault();
    var hash = $(this).closest('li.row-action').attr('data-hash');
    socket.emit('clientPlaylistCurrentAddItem', {
      hash: hash
    });
    socket.emit('clientPlay',{});
  });

  $('#playlist li.m-song-queue-item a').live('click', function (e) {
    e.preventDefault();
    var index = $(this).closest('li.m-song-queue-item').attr('data-playlist-index');
    console.log(index);
    socket.emit('clientPlaylistSeek',{
      index: index
    });
  });

  $('#play').click(function() {
    socket.emit('clientPlay',{});
  });
  $('#pause').click(function() {
    socket.emit('clientPause',{});
  });
  $('#clear').click(function() {
    socket.emit('clientPlaylistCurrentClear',{});
  });

  // Basic Search
  $('#search').live('keyup', function (e) { 
    var search = $(this).val().toLowerCase();
    $('#song-list li.row-action').each(function() {
      if( search.length == 0 ||
          $(this).attr('data-artist').toLowerCase().indexOf(search) >= 0 ||
          $(this).attr('data-title').toLowerCase().indexOf(search) >= 0 ) {
        $(this).show();
      } else {
        $(this).hide();
      }
    });
  });

  $('#add-visible').click(function() {
    $('#song-list li.row-action').each(function() {
      if( $(this).is(':visible') ) {
        socket.emit('clientPlaylistCurrentAddItem', {
          hash: $(this).attr('data-hash')
        });
      }
      socket.emit('clientPlay',{});
    });
  });


});



/*
(function() {
  var Nodio, Song, SongCollection, SongLink, UI_Element,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  UI_Element = (function() {

    function UI_Element(element_html) {
      this.$element = $(element_html);
    }

    UI_Element.prototype.attach_event = function(nodio_event, callback, dom_event) {
      var _this = this;
      this.$element.bind(nodio_event, callback);
      if (dom_event != null) {
        return this.$element.on(dom_event, function() {
          return _this.$element.trigger(nodio_event);
        });
      }
    };

    return UI_Element;

  })();

  SongLink = (function(_super) {

    __extends(SongLink, _super);

    function SongLink(song) {
      var element_html;
      element_html = "<a class='song-link' href='#'><i class='icon-play-circle2 icon'></i>" + song.title + "</a>";
      SongLink.__super__.constructor.call(this, element_html);
    }

    SongLink.prototype.attach_event = function(nodio_event, callback, dom_event) {
      return SongLink.__super__.attach_event.call(this, nodio_event, callback, dom_event);
    };

    return SongLink;

  })(UI_Element);

  Song = (function() {

    function Song(title, artist, duration) {
      this.title = title;
      this.artist = artist;
      this.duration = duration;
    }

    return Song;

  })();

  SongCollection = (function() {

    function SongCollection(songs) {
      this.songs = songs;
    }

    SongCollection.prototype.add = function(song) {
      return this.songs.push(song);
    };

    return SongCollection;

  })();

  Nodio = (function() {

    function Nodio(app_ready) {
      var _library,
        _this = this;
      this.app_ready = app_ready;
      this.socket = io.connect();
      _library = new SongCollection();
      this.socket.on('serverItems', function(data) {
        var item, song;
        _library = (function() {
          var _ref, _results;
          _ref = data.items;
          _results = [];
          for (item in _ref) {
            song = _ref[item];
            if (song.title != null) {
              _results.push(new Song(song.title, song.artist, song.duration));
            }
          }
          return _results;
        })();
        _this.library = new SongCollection(_library);
        return typeof _this.app_ready === "function" ? _this.app_ready() : void 0;
      });
    }

    return Nodio;

  })();

  $(function() {
    var nodio;
    return nodio = new Nodio(function() {
      var song, _i, _len, _ref, _results;
      _ref = nodio.library.songs;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        song = _ref[_i];
        _results.push($('#song-list').append("<li class='row-action row'><a class='song-link' href='#'><i class='icon-play-circle2 icon'></i>" + song.title + "</a></li>"));
      }
      return _results;
    });
  });

}).call(this);
*/