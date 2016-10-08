var Twitter = require('twitter');
var spotify = require('spotify');
var omdb = require('omdb');
var keys = require('./keys.js');
var fs = require('fs');



var input = process.argv[2];

console.log("process length = " + process.argv.length)
var testArray = [];
for(var i = 3; i < process.argv.length; i++)
{
  testArray[i-3] = process.argv[i]; 
}
var input2 = testArray.join(" ");

console.log('input  ' + input);
console.log('input2  ' + input2);

 var client = new Twitter({
  consumer_key: keys.twitterKeys.consumer_key,
  consumer_secret: keys.twitterKeys.consumer_secret,
  access_token_key: keys.twitterKeys.access_token_key,
  access_token_secret: keys.twitterKeys.access_token_secret
});

function getTweets(tweetName)
{
	if(input2 === "")
	{
	 tweetName = 'TacoMikee';
	}

	var params = {screen_name: tweetName, count:20};
	client.get('statuses/user_timeline', params, function(error, tweets, response) 
	{
	  var tweetArray = [];	
	  if (!error) 
	  { 
	  
	  	for(var i = 0; i < tweets.length; i++)
	  	{
	  		console.log('tweet '+ i + ' ' + tweets[i].text);
	  		tweetArray.push(tweets[i].text);
	  		console.log(tweetArray[i] + "  this array");
	  	}

	  	appendFile(tweetArray);
	  }
	  else {console.log('Error occurred: ' + error);}
	});
}

function getSpotify(song)
{
	if(input2 === "")
	{
		song = 'lets dance';
	}

		spotify.search({ type: 'track', query: song }, function(err, data) 
		{
		    if ( err ) {
		        console.log('Error occurred: ' + err);
		        return;
		 }
		     console.log('Artist Name:  ' + data.tracks.items[0].artists[0].name);
		     console.log('Song Name:    ' + data.tracks.items[0].name);
		     console.log('Album :       ' + data.tracks.items[0].album.name);
		     console.log('Preview URL:  ' + data.tracks.items[0].preview_url);
		     var fileArray = [data.tracks.items[0].artists[0].name, data.tracks.items[0].name, 
		                      data.tracks.items[0].album.name, data.tracks.items[0].preview_url]
		     appendFile(fileArray);

		});		
}

function getOmdb(movie)
{
	console.log("first line of getOmd " + movie);
	omdb.get({ title: movie, }, true, function(err, movie) 
	{
	    if(err) {
	        return console.error(err);
	    }
	 
	    if(!movie) {
	        return console.log('Movie not found!');
	    }
	    
	    console.log('%s (%d) %d/10', movie.title, movie.year, movie.imdb.rating);
	    console.log(movie.plot);
	    var fileArray = [movie.title,movie.year,movie.imdb.rating,movie.plot];
        appendFile(fileArray);
	});
}

 function getFile()
 {   
	fs.readFile("random.txt","utf8",function(error, data)
	{
	   var dataArry = data.split(',');

       console.log(dataArry[0]);
        console.log(dataArry[1]);
       if(dataArry[0] === "spotify-this-song"){getSpotify(dataArry[1]);}
       if(dataArry[0] === "my-tweets")        {getTweets(dataArry[1]);}
       if(dataArry[0] === "movie-this")       {getOmdb(dataArry[1]);}

	});
 }

function appendFile(input)
{
   fs.appendFile('log.txt', input, function (err) 
   {
        
   });
}

switch(input)
{
	case 'my-tweets':
	      getTweets(input2);   
	      break;

	case 'spotify-this-song':
	      getSpotify(input2);
	      //appendFile();
	      break;

	case 'movie-this':
	      if(input2 === "")getOmdb("Mr. Nobody");
	      else getOmdb(input2);
	      break;

	case 'do-what-it-says':
	      getFile();
	      break;     

}
