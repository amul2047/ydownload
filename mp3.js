var path = require('path');
var fs   = require('fs');
var ytdl = require('youtube-dl');
 
var url = 'https://www.youtube.com/watch?v=H7HmzwI67ec';

ytdl.exec(url, ['-x', '--audio-format', 'mp3'], {}, function exec(err, output) {
  'use strict';
  if (err) { throw err; }
  console.log(output.join('\n'));
});