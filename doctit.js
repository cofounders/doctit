(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['underscore'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('underscore'));
  } else {
    root.doctit = factory(root._);
  }
}(this, function (_) {
  var document = this.document || {title: '', hidden: false};

  // Title components
  var _message = document.title;
  var _divider = ' - ';
  var _sitename = '';

  // Updates the <title> element
  var _setTitle = function (message) {
    var title = message === undefined ? _message : message;
    if (_sitename.length > 0) {
      if (title.length > 0) {
        title += _divider;
      }
      title += _sitename;
    }
    document.title = title;
  };

  // Timeout references
  var _showFlash = null;
  var _showDefault = null;

  // Browser compatibility for document.hidden
  var _hidden = _.find(
    ['hidden', 'mozHidden', 'msHidden', 'webkitHidden'],
    function (vendor) {
      return typeof document[vendor] !== 'undefined';
    }
  );

  var self = {

    get divider () {
      return _divider;
    },

    set divider (divider) {
      _divider = divider;
      _setTitle();
    },

    get sitename () {
      return _sitename;
    },

    set sitename (sitename) {
      _sitename = sitename;
      _setTitle();
    },

    get message () {
      return _message;
    },

    set message (message) {
      _message = message;
      _setTitle();
    },

    flash: function (message, options) {
      if (!options) {
        options = {};
      }

      _.defaults(options, {
        // Duration in milliseconds of each on/off cycle
        // Does not work in some browsers (Chrome) below 1000ms,
        // when the tab is inactive.
        speed: 2000,
        // Flash even if the page is visible
        visible: true,
        // Flash even if the page is hidden
        hidden: true,
        // Maximum number of times to flash the message
        // Set to any negative number to flash forever
        times: 3,
        // Callback that checks if the message should keep flashing
        // The callback must return `true` to stop the flashing
        until: function () {},
        // Callback for when the flashing ends
        done: function () {}
      });

      // Prevent multiple concurrent flashing messages
      _showFlash = clearTimeout(_showFlash);
      _showDefault = clearTimeout(_showDefault);

      // Don't show the message if the page is visible
      if (!options.visible && document[_hidden] === false) {
        options.done();
        return;
      }

      // Don't show the message if the page is hidden
      if (!options.hidden && document[_hidden] === true) {
        options.done();
        return;
      }

      // Show the message until this callback returns true
      if (options.until.apply(this, arguments)) {
        options.done();
        return;
      }

      // Flash a limited number of times
      if (options.times === 0) {
        options.done();
        return;
      }

      // Flash the message immediately
      _message = document.title;
      _setTitle(message);

      // Hide the message when half the period has elapsed
      _showDefault = setTimeout(function () {
        _showDefault = undefined;
        _setTitle();
      }, options.speed / 2);

      // Count down the number of times to flash the message
      options.times -= 1;

      // "Recurse" to the next flash
      _showFlash = setTimeout(function () {
        self.flash(message, options);
      }, options.speed);
    }

  };

  return self;
}));
