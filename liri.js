require("dotenv").config();

var keys = require('./keys.js');

var Spotify = require('node-spotify-api');

var request = require('request');

var fs = require("fs");

var Twitter = require('twitter');
var client = new Twitter(keys.twitter);

function myTweets() {
  
  var twitterUsername = process.argv[3];
  params = {screen_name: twitterUsername};
  client.get("statuses/user_timeline/", params, function(error, data, response){
    if (!error) {
      for(var i = 0; i < data.length; i++) {
        var twitterResults = 
        "@" + data[i].user.screen_name + ": " + 
        data[i].text + "\r\n" + 
        data[i].created_at + "\r\n" + 
        "------------------------------ " + i + " ------------------------------" + "\r\n";
        console.log(twitterResults);
      }
    }  else {
      console.log("Error :"+ error);
      return;
    }
  });
}


var getArtistNames = function(artist) {
  return artist.name;
}

var spotifyThisSong = function(songName) {
  var spotify = new Spotify(keys.spotify);
  spotify.search({ 
    type: 'track', 
    query: songName }, 
    function(err, data) {
    if ( err ) {
        console.log('Error occurred: ' + err);
        return;
    }
    var songs = data.tracks.items;
    for(var i=0; i<songs.length; i++){
    console.log(i);
    console.log("artists: " + songs[i].artists.map(getArtistNames));
    console.log("song name: " + songs[i].name);
    console.log("preview song: " + songs[i].preview_url);
    console.log("album: " + songs[i].album.name);
    console.log("--------------")
    }
  });
}

var movieThis = function(movieName) {
  request('http://www.omdbapi.com/?t=' + movieName + '&y=plot=short&r=json&apikey=trilogy', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      
      var jsonData = JSON.parse(body);
        
        console.log('Title: ' + jsonData.Title);
        console.log('Year: ' + jsonData.Year);
        console.log('IMDB Rating: ' + jsonData.imdbRating);
        console.log('Rotten Tomatoes Rating: ' + jsonData.Ratings[1].Value);
        console.log('Country: ' + jsonData.Country);
        console.log('Language: ' + jsonData.Language);
        console.log('Plot: ' + jsonData.Plot);
        console.log('Actors: ' + jsonData.Actors);
    }
  })
}
var doWhatItSays = function(){
  fs.readFile('random.txt', 'utf8', function(err, data) {
    if (err) throw err;
    var doWhat = data.split(",");
    if (doWhat.length == 2) {
      liriCommand(doWhat[0],doWhat[1]);
    } else if (doWhat.length == 1) {
      liriCommand(doWhat[0]);
    }
  });
}
var liriCommand = function(par1,par2) {
  switch(par1) {
    case 'my-tweets' :
      myTweets();
      break;
    case 'spotify-this-song' :
      spotifyThisSong(par2);
      break;
    case 'movie-this' :
      movieThis(par2);
      break;
    case 'do-what-it-says' :
      doWhatItSays();
      break;
    default:
    console.log("Type 'node liri.js ' into the command line, then insert one of these commands:")
    console.log("my-tweets meowsavvy")
    console.log("my-tweets 'twitter username'")
    console.log("spotify-this-song 'song title (in quotes if more than one word)'")
    console.log("movie-this 'movie title (in quotes if more than one word)'")
    console.log("do-what-it-says")

  } 
}

var runLiri = function(argOne, argTwo) {
  liriCommand(argOne, argTwo);
};

runLiri(process.argv[2], process.argv[3]);
