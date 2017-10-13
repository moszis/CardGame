

var http       = require('http');
var mysql      = require('mysql');
var express    = require('express'); 		// call express
var app        = express(); 			// define our app using express
//var bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
//app.use(bodyParser());


var port = process.env.PORT || 8124; 		// set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); 				// get an instance of the express Router
//var cards;

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
        console.log('new request.. ');
        sendAllCards(res);
});

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
//REMEMBER THIS, test with:  app.use('/CardGame', router);
app.use('/', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);


function sendAllCards(res){
    var connection = mysql.createConnection({
       host: '127.0.0.1',
       user: 'root',
       password: 'mosmos',
       port: 3306,
       database: 'cardgame' });

    connection.connect();

    var query = 'SELECT * FROM CARDS';
    var cards = null;
    
    connection.query(query, function(err, result, fields){
        
       if(err){ throw err;}else{
          cards = JSON.stringify(result);
          res.send(cards);
       }
       
    });

    connection.end();
}