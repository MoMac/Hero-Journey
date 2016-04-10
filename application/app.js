// Import the Express module
var express = require('express');

// Create a new instance of Express
global.app = express();
 
//Serve static client files
// app.use(express.static('client'));

app.configure(function(){
	// statische Dateien ausliefern
	app.use(express.static(__dirname + '/public'));
});

app.get('/', function (req, res) {
	// so wird die Datei index.html ausgegeben
	res.sendfile(__dirname + '/public/index.html');
});

// Create a http server on port 8080
app.listen(8080, function () {
  console.log("Listening on port 8080!");
});