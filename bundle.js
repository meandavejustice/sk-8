(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var AudioSource = require('audiosource');
var AudioContext = require('audiocontext');
var context = new AudioContext();

var indicator = document.querySelector('.indicator');

var gainNode = context.createGain();
var input = document.querySelector('input');
var mySource;
var keys = [].slice.call(document.querySelectorAll('ul li'));

keys.forEach(function(key, i) {
  key.setAttribute('data-index', i);
  key.addEventListener('click', onKeyClick);
});

function onKeyClick(ev) {
  mySource.pause();
  mySource.currentTime = 0;
  var playback, index = ev.target.getAttribute('data-index');
  mySource.playbackRate = 16 / (16 + (16 - index));
  mySource.play();
}


input.addEventListener('change', function(ev) {
  var file = ev.target.files[0];
  if (!file) return;

  var reader = new FileReader();
  reader.onloadend = function(ev) {
    mySource = document.createElement('audio');
    mySource.src = ev.target.result;
    indicator.innerText = 'ready';
  };

  reader.readAsDataURL(file);
});
},{"audiocontext":2,"audiosource":3}],2:[function(require,module,exports){
/*
 * Web Audio API AudioContext shim
 */
(function (definition) {
    if (typeof exports === "object") {
        module.exports = definition();
    }
})(function () {
  return window.AudioContext || window.webkitAudioContext;
});

},{}],3:[function(require,module,exports){
/*
 * AudioSource
 *
 * * MUST pass an audio context
 *
 */
function AudioSource (context, opts) {
  if (!context) {
    throw new Error('You must pass an audio context to use this module');
  }
  if (opts === undefined) opts = {};

  this.context = context;
  this.buffer = undefined;
  this.url = opts.url ? opts.url : undefined;
  this.ffts = opts.ffts ? opts.ffts : [];
  this.gainNode = opts.gainNode ? opts.gainNode : undefined;
}

AudioSource.prototype = {
  needBuffer: function() {
    return this.buffer === undefined;
  },
  loadSound: function(url, cb) {
    var req = new XMLHttpRequest();
    req.open('GET', url, true);
    req.responseType = 'arraybuffer';
    var self = this;
    req.onloadend = function() {
      self.decode.call(self, req.response, cb);
    };
    req.send();
  },
  getBuffer: function(cb) {
    if (!this.needBuffer()) return;
    var self = this;
    this.loadSound(this.url, function(data) {
      self.onLoaded.call(self, data, true);
    });
  },
  getSource: function(cb) {
    if (this.source) {
      cb(this.source);
    } else {
      var self = this;
      this.disconnect();
      this.loadSound(this.url, function(data) {
        this.source = self.createSource.call(self, data, true);
        cb(this.source);
      });
    }
  },

  onLoaded: function(source, silent) {
    this.buffer = source;
    this.disconnect();
    this.source = this.context.createBufferSource();
    this.source.buffer = this.buffer;
    this.source.connect(this.gainNode);
    this.ffts.forEach(function(fft) {
      this.gainNode.connect(fft.input);
    }, this);
    this.gainNode.connect(this.context.destination);
    this.ffts.forEach(function(fft) {
      fft.connect(this.context.destination);
    }, this);
    if (!silent) this.playSound();
  },
  disconnect: function() {
    if (this.source) {
      this.source.disconnect(this.context.destination);
    }
  },
  playSound: function() {
    if (this.playTime) {
      this.source.start(0, this.offset);
    }

    this.playTime = this.context.currentTime;
  },
  loadSilent: function() {
    if (!this.needBuffer()) return;
    var self = this;
    this.loadSound(this.url, function(data) {
      self.onLoaded.call(self, data, true);
    });
  },
  play: function(starttime, offset) {
    this.playTime = starttime ? starttime : this.context.currentTime;
    this.offset = offset ? offset : 0;

    if (this.needBuffer()) {
      var self = this;
      this.loadSound(this.url, function(data) {
        self.onLoaded.call(self, data);
      });
    } else {
      this.onLoaded(this.buffer);
    }
  },
  stop: function() {
    this.source.stop(this.context.currentTime);
  },
  decode: function(data, success, error) {
    this.context.decodeAudioData(data, success, error);
  }
};

module.exports = AudioSource;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiaW5kZXguanMiLCJub2RlX21vZHVsZXMvYXVkaW9jb250ZXh0L3NyYy9hdWRpb2NvbnRleHQuanMiLCJub2RlX21vZHVsZXMvYXVkaW9zb3VyY2UvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIEF1ZGlvU291cmNlID0gcmVxdWlyZSgnYXVkaW9zb3VyY2UnKTtcbnZhciBBdWRpb0NvbnRleHQgPSByZXF1aXJlKCdhdWRpb2NvbnRleHQnKTtcbnZhciBjb250ZXh0ID0gbmV3IEF1ZGlvQ29udGV4dCgpO1xuXG52YXIgaW5kaWNhdG9yID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmluZGljYXRvcicpO1xuXG52YXIgZ2Fpbk5vZGUgPSBjb250ZXh0LmNyZWF0ZUdhaW4oKTtcbnZhciBpbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0Jyk7XG52YXIgbXlTb3VyY2U7XG52YXIga2V5cyA9IFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgndWwgbGknKSk7XG5cbmtleXMuZm9yRWFjaChmdW5jdGlvbihrZXksIGkpIHtcbiAga2V5LnNldEF0dHJpYnV0ZSgnZGF0YS1pbmRleCcsIGkpO1xuICBrZXkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbktleUNsaWNrKTtcbn0pO1xuXG5mdW5jdGlvbiBvbktleUNsaWNrKGV2KSB7XG4gIG15U291cmNlLnBhdXNlKCk7XG4gIG15U291cmNlLmN1cnJlbnRUaW1lID0gMDtcbiAgdmFyIHBsYXliYWNrLCBpbmRleCA9IGV2LnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtaW5kZXgnKTtcbiAgbXlTb3VyY2UucGxheWJhY2tSYXRlID0gMTYgLyAoMTYgKyAoMTYgLSBpbmRleCkpO1xuICBteVNvdXJjZS5wbGF5KCk7XG59XG5cblxuaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZnVuY3Rpb24oZXYpIHtcbiAgdmFyIGZpbGUgPSBldi50YXJnZXQuZmlsZXNbMF07XG4gIGlmICghZmlsZSkgcmV0dXJuO1xuXG4gIHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuICByZWFkZXIub25sb2FkZW5kID0gZnVuY3Rpb24oZXYpIHtcbiAgICBteVNvdXJjZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2F1ZGlvJyk7XG4gICAgbXlTb3VyY2Uuc3JjID0gZXYudGFyZ2V0LnJlc3VsdDtcbiAgICBpbmRpY2F0b3IuaW5uZXJUZXh0ID0gJ3JlYWR5JztcbiAgfTtcblxuICByZWFkZXIucmVhZEFzRGF0YVVSTChmaWxlKTtcbn0pOyIsIi8qXG4gKiBXZWIgQXVkaW8gQVBJIEF1ZGlvQ29udGV4dCBzaGltXG4gKi9cbihmdW5jdGlvbiAoZGVmaW5pdGlvbikge1xuICAgIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gXCJvYmplY3RcIikge1xuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IGRlZmluaXRpb24oKTtcbiAgICB9XG59KShmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB3aW5kb3cuQXVkaW9Db250ZXh0IHx8IHdpbmRvdy53ZWJraXRBdWRpb0NvbnRleHQ7XG59KTtcbiIsIi8qXG4gKiBBdWRpb1NvdXJjZVxuICpcbiAqICogTVVTVCBwYXNzIGFuIGF1ZGlvIGNvbnRleHRcbiAqXG4gKi9cbmZ1bmN0aW9uIEF1ZGlvU291cmNlIChjb250ZXh0LCBvcHRzKSB7XG4gIGlmICghY29udGV4dCkge1xuICAgIHRocm93IG5ldyBFcnJvcignWW91IG11c3QgcGFzcyBhbiBhdWRpbyBjb250ZXh0IHRvIHVzZSB0aGlzIG1vZHVsZScpO1xuICB9XG4gIGlmIChvcHRzID09PSB1bmRlZmluZWQpIG9wdHMgPSB7fTtcblxuICB0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xuICB0aGlzLmJ1ZmZlciA9IHVuZGVmaW5lZDtcbiAgdGhpcy51cmwgPSBvcHRzLnVybCA/IG9wdHMudXJsIDogdW5kZWZpbmVkO1xuICB0aGlzLmZmdHMgPSBvcHRzLmZmdHMgPyBvcHRzLmZmdHMgOiBbXTtcbiAgdGhpcy5nYWluTm9kZSA9IG9wdHMuZ2Fpbk5vZGUgPyBvcHRzLmdhaW5Ob2RlIDogdW5kZWZpbmVkO1xufVxuXG5BdWRpb1NvdXJjZS5wcm90b3R5cGUgPSB7XG4gIG5lZWRCdWZmZXI6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmJ1ZmZlciA9PT0gdW5kZWZpbmVkO1xuICB9LFxuICBsb2FkU291bmQ6IGZ1bmN0aW9uKHVybCwgY2IpIHtcbiAgICB2YXIgcmVxID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgcmVxLm9wZW4oJ0dFVCcsIHVybCwgdHJ1ZSk7XG4gICAgcmVxLnJlc3BvbnNlVHlwZSA9ICdhcnJheWJ1ZmZlcic7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHJlcS5vbmxvYWRlbmQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHNlbGYuZGVjb2RlLmNhbGwoc2VsZiwgcmVxLnJlc3BvbnNlLCBjYik7XG4gICAgfTtcbiAgICByZXEuc2VuZCgpO1xuICB9LFxuICBnZXRCdWZmZXI6IGZ1bmN0aW9uKGNiKSB7XG4gICAgaWYgKCF0aGlzLm5lZWRCdWZmZXIoKSkgcmV0dXJuO1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB0aGlzLmxvYWRTb3VuZCh0aGlzLnVybCwgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgc2VsZi5vbkxvYWRlZC5jYWxsKHNlbGYsIGRhdGEsIHRydWUpO1xuICAgIH0pO1xuICB9LFxuICBnZXRTb3VyY2U6IGZ1bmN0aW9uKGNiKSB7XG4gICAgaWYgKHRoaXMuc291cmNlKSB7XG4gICAgICBjYih0aGlzLnNvdXJjZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIHRoaXMuZGlzY29ubmVjdCgpO1xuICAgICAgdGhpcy5sb2FkU291bmQodGhpcy51cmwsIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgdGhpcy5zb3VyY2UgPSBzZWxmLmNyZWF0ZVNvdXJjZS5jYWxsKHNlbGYsIGRhdGEsIHRydWUpO1xuICAgICAgICBjYih0aGlzLnNvdXJjZSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH0sXG5cbiAgb25Mb2FkZWQ6IGZ1bmN0aW9uKHNvdXJjZSwgc2lsZW50KSB7XG4gICAgdGhpcy5idWZmZXIgPSBzb3VyY2U7XG4gICAgdGhpcy5kaXNjb25uZWN0KCk7XG4gICAgdGhpcy5zb3VyY2UgPSB0aGlzLmNvbnRleHQuY3JlYXRlQnVmZmVyU291cmNlKCk7XG4gICAgdGhpcy5zb3VyY2UuYnVmZmVyID0gdGhpcy5idWZmZXI7XG4gICAgdGhpcy5zb3VyY2UuY29ubmVjdCh0aGlzLmdhaW5Ob2RlKTtcbiAgICB0aGlzLmZmdHMuZm9yRWFjaChmdW5jdGlvbihmZnQpIHtcbiAgICAgIHRoaXMuZ2Fpbk5vZGUuY29ubmVjdChmZnQuaW5wdXQpO1xuICAgIH0sIHRoaXMpO1xuICAgIHRoaXMuZ2Fpbk5vZGUuY29ubmVjdCh0aGlzLmNvbnRleHQuZGVzdGluYXRpb24pO1xuICAgIHRoaXMuZmZ0cy5mb3JFYWNoKGZ1bmN0aW9uKGZmdCkge1xuICAgICAgZmZ0LmNvbm5lY3QodGhpcy5jb250ZXh0LmRlc3RpbmF0aW9uKTtcbiAgICB9LCB0aGlzKTtcbiAgICBpZiAoIXNpbGVudCkgdGhpcy5wbGF5U291bmQoKTtcbiAgfSxcbiAgZGlzY29ubmVjdDogZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMuc291cmNlKSB7XG4gICAgICB0aGlzLnNvdXJjZS5kaXNjb25uZWN0KHRoaXMuY29udGV4dC5kZXN0aW5hdGlvbik7XG4gICAgfVxuICB9LFxuICBwbGF5U291bmQ6IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aGlzLnBsYXlUaW1lKSB7XG4gICAgICB0aGlzLnNvdXJjZS5zdGFydCgwLCB0aGlzLm9mZnNldCk7XG4gICAgfVxuXG4gICAgdGhpcy5wbGF5VGltZSA9IHRoaXMuY29udGV4dC5jdXJyZW50VGltZTtcbiAgfSxcbiAgbG9hZFNpbGVudDogZnVuY3Rpb24oKSB7XG4gICAgaWYgKCF0aGlzLm5lZWRCdWZmZXIoKSkgcmV0dXJuO1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB0aGlzLmxvYWRTb3VuZCh0aGlzLnVybCwgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgc2VsZi5vbkxvYWRlZC5jYWxsKHNlbGYsIGRhdGEsIHRydWUpO1xuICAgIH0pO1xuICB9LFxuICBwbGF5OiBmdW5jdGlvbihzdGFydHRpbWUsIG9mZnNldCkge1xuICAgIHRoaXMucGxheVRpbWUgPSBzdGFydHRpbWUgPyBzdGFydHRpbWUgOiB0aGlzLmNvbnRleHQuY3VycmVudFRpbWU7XG4gICAgdGhpcy5vZmZzZXQgPSBvZmZzZXQgPyBvZmZzZXQgOiAwO1xuXG4gICAgaWYgKHRoaXMubmVlZEJ1ZmZlcigpKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICB0aGlzLmxvYWRTb3VuZCh0aGlzLnVybCwgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICBzZWxmLm9uTG9hZGVkLmNhbGwoc2VsZiwgZGF0YSk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5vbkxvYWRlZCh0aGlzLmJ1ZmZlcik7XG4gICAgfVxuICB9LFxuICBzdG9wOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnNvdXJjZS5zdG9wKHRoaXMuY29udGV4dC5jdXJyZW50VGltZSk7XG4gIH0sXG4gIGRlY29kZTogZnVuY3Rpb24oZGF0YSwgc3VjY2VzcywgZXJyb3IpIHtcbiAgICB0aGlzLmNvbnRleHQuZGVjb2RlQXVkaW9EYXRhKGRhdGEsIHN1Y2Nlc3MsIGVycm9yKTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBBdWRpb1NvdXJjZTtcbiJdfQ==
