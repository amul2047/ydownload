var myType = process.argv[2];
var myId = process.argv[3];

if (!myType || myType.length === 0 || !myId || myId.length === 0) {
  console.log('USAGE:: node app.js <ONE | LIST> <VIDEO_URL_ID>');
  process.exit(1);
}


var http = require("http");
var path = require('path');
var fs   = require('fs');
var ytdl = require('youtube-dl');
 

function singleSong(singleId) {

  var video = ytdl('http://www.youtube.com/watch?v='+singleId);
  
  // Will be called when the download starts. 
  video.on('info', function(info) {
    console.log('Download started');
   size = info.size;
    name = info._filename;
    var output = path.join(__dirname + '/', name + '.mp4');
    video.pipe(fs.createWriteStream(output));
  });
  
}
function downloadMP3(url) {
  
  var url = 'https://www.youtube.com/watch?v=H7HmzwI67ec';

ytdl.exec(url, ['-x', '--audio-format', 'mp3'], {}, function exec(err, output) {
  'use strict';
  if (err) { throw err; }
  console.log(output.join('\n'));
});

}

function playlist(url) {
 
  'use strict';
  var video = ytdl(url);
 
  video.on('error', function error(err) {
    console.log('error 2:', err);
  });
 
  var size = 0;
  var name = 0;
  video.on('info', function(info) {
  console.log('Download started');
    size = info.size;
    name = info._filename;
    var output = path.join(__dirname + '/', name + '.mp4');
    video.pipe(fs.createWriteStream(output));
  });
 
  var pos = 0;
  video.on('data', function data(chunk) {
    pos += chunk.length;
    // `size` should not be 0 here. 
    if (size) {
      var percent = (pos / size * 100).toFixed(2);
      process.stdout.cursorTo(0);
      process.stdout.clearLine(1);
      process.stdout.write(percent + '%');
    }
  });
  video.on('next', playlist);
}

//call happens here

if( myType == "one" || myType == "One" || myType =="ONE") {
  singleSong(myId);
}
else if (myType == "list" || myType =="LIST" || myType =="List") {
  playlist('https://www.youtube.com/playlist?list='+myId);
}

else {
  console.log('Somethings wrong!!!');
  process.exit(1);
}