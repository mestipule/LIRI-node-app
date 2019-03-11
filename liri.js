require("dotenv").config();
var axios = require("axios");
var moment = require('moment');
var fs = require("fs");
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var command = process.argv[2];
var searchTerm = process.argv.slice(3).join(" ");
console.log(searchTerm);
const runSpotify = async (searchTerm) => {
  spotify
    .search({
      type: 'track',
      query: searchTerm
    })
    .then(function(response) {
      // console.log(response);
      if (response.tracks.items) {
        for (var i = 0; i < response.tracks.items.length; i++) {
          console.log("Title: " + response.tracks.items[i].name);
          console.log("Album Name: " + response.tracks.items[i].album.name);
          console.log("Name of the Artist: " + response.tracks.items[i].artists[0].name);
          console.log("Link: " + response.tracks.items[i].preview_url);
          console.log("-----------------------------------------------------------");
        }
      }
      else {
        console.log("Result not Found!");
      }
    })
    .catch(function(err) {
      console.log(err);
    });
};
const getOmdb = async (searchTerm) => {
  console.log('OMDB search for: ' + searchTerm);
  try {
    return await axios.get('http://www.omdbapi.com/?t=' + searchTerm  + '&y=&plot=short&apikey=trilogy'  )

  } catch (error) {
    console.error(error)
  }
}
const runOmdb = async (searchTerm) => {
  const results = await getOmdb(searchTerm);
  console.log(results.data);
  if (results.data) {
    //console.log(results.data);
    // * Title of the movie.
    console.log(results.data.Title);
    //   * Year the movie came out.
    console.log(results.data.Year);
    //   * IMDB Rating of the movie.
    console.log(results.data.imdbRating);
    //   * Rotten Tomatoes Rating of the movie.
    for (var i=0; i< results.data.Ratings.length;i++){
      if (results.data.Ratings[i].Source == 'Rotten Tomatoes'){
        console.log("Rotten Tomatoes Rating:" + results.data.Ratings[i].Value);
      }
    }
    //   * Country where the movie was produced.
    console.log(results.data.Country);
    //   * Language of the movie.
    console.log(results.data.Language);
    //   * Plot of the movie.
    console.log(results.data.Plot);
    //   * Actors in the movie.
    console.log(results.data.Actors);
  }
}

const getBandsInTown = async (searchTerm) => {
  console.log('Looking for concerts for "' + searchTerm + '"');
  try {
    return await axios.get("https://rest.bandsintown.com/artists/" + searchTerm + "/events?app_id=codingbootcamp");
  } catch (error) {
    console.error(error);
  }
}
const runBandsInTown = async (searchTerm) => {
  const results = await getBandsInTown(searchTerm);
  if (results) {
    for (var i = 0; i < results.data.length; i++) {
      var currentEvent = results.data[i];

      //currentEvent.datetime needs to be formated using moment
      console.log('Playing at ' + currentEvent.venue.name + ' in ' + currentEvent.venue.city + ', ' +
        currentEvent.venue.region + ", " + currentEvent.venue.country + ' on ' + moment(currentEvent.datetime).format("MM/DD/YYYY"));
    }
  } else {
    console.log("Band Not Found!!!")
  }
}
var myArgs = process.argv.slice(2);
console.log('myArgs: ', myArgs);
var help = 'This application will search accepting the following commands: spotify, omdb, and bandsintown. ' +
  'Then the name of the concert, song or movie can be entered';
if (myArgs && myArgs.length > 0) {
  var service = myArgs[0];
  var search = "";
  for (var i = 1; i < myArgs.length; i++) {
    search += myArgs[i];
    if (i < myArgs.length - 1) {
      search += " ";
    }
  }
  switch (service) {
    case 'spotify':
    case 'song':
    case 'spotify-this-song':
    if (search === ""){
      search = "The Sign Ace of Base";
    }
      runSpotify(search);
      break;
    case 'omdb':
    case 'movie':
    case 'movie-this':
      runOmdb(search);
      break;
    case 'bandsintown':
    case 'concert':
    case 'concert-this':
      runBandsInTown(search);
      break;
    default:
      console.log(help);
  }
} else {
  console.log(help);
}
