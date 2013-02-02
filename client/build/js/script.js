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
