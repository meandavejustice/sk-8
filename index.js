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