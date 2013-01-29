(function() {
  var _ref;

  if ((_ref = window.Nodio) == null) {
    window.Nodio = {};
  }

  window.Nodio.Song = Backbone.Model.extend({
    defaults: {
      title: '',
      artist: '',
      length: 0
    },
    play: function() {
      return typeof console !== "undefined" && console !== null ? console.log('playing a song') : void 0;
    }
  });

  window.Nodio.Queue = Backbone.Collection.extend({
    model: window.Nodio.Song
  });

}).call(this);
