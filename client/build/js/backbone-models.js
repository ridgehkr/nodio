(function() {

  window.Nodio.models.Song = Backbone.Model.extend({
    defaults: {
      title: '',
      artist: '',
      length: 0
    },
    play: function() {
      return typeof console !== "undefined" && console !== null ? console.log('playing a song') : void 0;
    }
  });

  window.Nodio.models.Queue = Backbone.Collection.extend({
    model: window.Nodio.models.Song
  });

}).call(this);
