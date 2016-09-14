var express = require('express');
var bodyParser = require('body-parser');

var http = require("http");
var path = require('path');
var fs   = require('fs');
var ytdl = require('youtube-dl');

var app = express();

//Note that in version 4 of express, express.bodyParser() was
//deprecated in favor of a separate 'body-parser' module.
app.use(bodyParser.urlencoded({ extended: true })); 

//app.use(express.bodyParser());

app.post('/', function(req, res) {
  //res.send('You sent the name "' + req.body.link + '".');
  var link = req.body.link;
  var listType = req.body.listType;
  var format = req.body.format;

  //parse url to get video ID
  var yId = getIDfromURL(link);

  if(listType="single" && format=="video")
  {
  	singleSong(yId);
  }else if(listType="list" && format=="video")
  {
  	playlist(link);
  }else if(listType="single" && format=="audio")
  {
  	downloadMP3(link);
  }else if(listType="list" && format=="audio")
  {
  	console.log("Functionality in progress");
  }else{
  	console.log("Nothing to do here");
  }

});

app.listen(8080, function() {
  console.log('Server running at http://127.0.0.1:8080/');
});


function singleSong(singleId) {

  var video = ytdl('http://www.youtube.com/watch?v='+singleId);
  
  // Will be called when the download starts. 
  video.on('info', function(info) {
    console.log('Download started');
   size = info.size;
    name = info._filename;
    var output = path.join(__dirname + '/files/video/', name);
    video.pipe(fs.createWriteStream(output));
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
function downloadMP3(url) {
  
  var url = 'https://www.youtube.com/watch?v=H7HmzwI67ec';

ytdl.exec(url, ['-x', '--audio-format', 'mp3'], {}, function exec(err, output) {
  'use strict';
  if (err) { throw err; }
  console.log(output.join('\n'));
});

}

function getIDfromURL(url)
{
	var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
	var match = url.match(regExp);
	if (match && match[2].length == 11) {
	  return match[2];
	} else {
	  console.log("Wrong ID");
	}
}