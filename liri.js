require("dotenv").config();
// var fs = require("fs");
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
// function Songs() {
//     this.title = title,
//     this.band = band,
//     this.album = album
// }   
  spotify
    .search({ type: 'track', query: 'I Found You' })
    .then(function(response) {
        // var artist = ;
        // var songName = ;
        // var spotifyLink = ;
        // var album = ;
        
      console.log(response);
      console.log(response.tracks.items[0].name);
      console.log(response.tracks.items[0].album.name);
      console.log(response.tracks.items[0].artists[0].name);
      console.log(response.tracks.items[0].preview_url);
    })
    .catch(function(err) {
      console.log(err);
    });