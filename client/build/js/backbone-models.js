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

  window.Nodio.models.SongList = Backbone.View.extend({
    tagName: 'ul',
    className: 'm-list',
    events: {
      'click .row-action': 'play-song'
    },
    initialize: function() {
      return this.listenTo(this.model, 'change', this.render);
    },
    render: function() {}
  });

}).call(this);
