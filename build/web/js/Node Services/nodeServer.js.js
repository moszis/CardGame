
/* global require, index */

//node.js services
var http      = require('http');
var mysql     = require('mysql');
var express   = require('express');
var socketIO  = require('socket.io');
var fs        = require('fs');

//custom app includes
var mysqlPool = require('mysqlPool').pool;

//var index = fs.readFileSync(__dirname + '/nodejsTest.html');



var app = http.createServer(function (req, res) {  
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(index);
});

var io = require('socket.io').listen(app);


console.log('Server running at http://127.0.0.1:8124/');


// Emit welcome message on connection
io.sockets.on('connection', function(socket) {
    
    console.log('new connection..'+socket.id);
    
    socket.emit('welcome', { message: 'Welcome!'});
    
    socket.on('received cards', console.log);
    socket.on('received mob cards', console.log);
    socket.on('received abilities', console.log);


    socket.on('getAllCards', function(){ 
        console.log('received request for cards..'); 
        sendAllCards(socket); 
    });

    socket.on('getDeckCards', function(data){ 
        console.log('received request for deck cards, deck_id: '+data.deckID); 
        sendDeckCards(socket, data.deckID); 
    });
    
    socket.on('getMobDeckCards', function(data){ 
        console.log('received request for mob deck cards, deck_id: '+data.mobDeckID); 
        sendMobDeckCards(socket, data.mobDeckID); 
    });
    
    socket.on('getAllAbilities', function(){ 
        console.log('received request for all card abilities '); 
        sendAllAbilities(socket); 
    });
});

    
app.listen(8124);


//*******************************SERVICE FUNCTIONS***************************//


function sendAllCards(socket){
    
    var query = 'SELECT * FROM CARDS';
    
    mysqlPool.getConnection(function(err, connection){   
        connection.query(query, function(err, result, fields){
           if(err){ throw err;}else{
              cards = JSON.stringify(result);
              socket.emit('AllCards', { cards: JSON.stringify(result)});
              console.log('cards sent..'); 
           }
           connection.release();
        });
    });

}

function sendDeckCards(socket, deckID){
  
    var query = "SELECT ca.card_id, c.card_name, c.card_base_atk, c.card_base_hp, c.card_base_speed,      \n\
                        c.card_image, pc.card_level,  GROUP_CONCAT(ability_id) as abilityList             \n\
                FROM cards c                                                                              \n\
                JOIN player_cards pc                                                                      \n\
                ON c.card_id = pc.card_id                                                                 \n\
                JOIN card_abilities ca                                                                    \n\
                ON c.card_id = ca.card_id                                                                 \n\
                where ca.card_id in                                                                       \n\
                                 (Select distinct(pc.card_id)                                             \n\
                                 FROM player_cards pc                                                     \n\
                                 JOIN deck_cards dc                                                       \n\
                                 ON dc.player_card_rel_id = pc.player_card_rel_id                         \n\
                                 WHERE dc.deck_id = "+deckID+"                                            \n\
                )                                                                                         \n\
                GROUP BY c.card_id";                                                            

    mysqlPool.getConnection(function(err, connection){
            connection.query(query, function(err, result, fields){
                if(err){ throw err;}else{
                  cards = JSON.stringify(result);
                  socket.emit('DeckCards', { cards: JSON.stringify(result)});
                  console.log('deck cards sent..'); 
                }
                connection.release();
            });
    });
}

function sendMobDeckCards(socket, mobDeckID){
                                                        
    var query = "SELECT c.card_id, c.card_name, c.card_base_atk, c.card_base_hp, c.card_base_speed, c.card_archetype_id,            \n\
                        c.card_image, mdc.card_level, c.card_type_id,                                                               \n\
                       (Select  GROUP_CONCAT(ability_id)  from card_abilities ca where ca.card_id = mdc.card_id) as abilityList     \n\
                FROM cards c                                                                                                        \n\
                JOIN mob_deck_cards mdc                                                                                             \n\
                ON c.card_id = mdc.card_id                                                                                          \n\
                WHERE mdc.mob_deck_id = "+mobDeckID+"";                                                  
    
    mysqlPool.getConnection(function(err, connection){
            connection.query(query, function(err, result, fields){
                if(err){ throw err;}else{
                  cards = JSON.stringify(result);
                  socket.emit('MobDeckCards', { cards: JSON.stringify(result)});
                  console.log('mob deck cards sent..'); 
                }
                connection.release();
            });
    });
}

function sendAllAbilities(socket){
    
    var query = 'Select * from Abilities, icons  Where abilities.ability_icon_id = icons.icon_id';
    
    mysqlPool.getConnection(function(err, connection){   
        connection.query(query, function(err, result, fields){
           if(err){ throw err;}else{
              cards = JSON.stringify(result);
              socket.emit('AllAbilities', { abilities: JSON.stringify(result)});
              console.log('abilities sent..'); 
           }
           connection.release();
        });
    });
}
