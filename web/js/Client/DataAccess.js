var socketAddress = '73.4.67.71';
var socketPort    = '8124';

    var socket = io.connect(socketAddress+':'+socketPort);
        
       
    socket.emit('getDeckCards', {deckID: 1});  
    
    
    //Need to remove all nondataaccess functions out to "generatePlayer" function
    socket.on('DeckCards', function(data) {

        socket.emit('received cards', {data: 'card Object received'});

        socket.emit('getMobDeckCards', {mobDeckID: 1}); 
        
        convertJSONtoPlayerCardObject(data.cards);
        assignPlayerCardsToStaging();
         
        for(x=0; x < playerCards.length; x++){
            drawCard(x);       
        }

    });

    socket.on('MobDeckCards', function(data) {

        socket.emit('received mob cards', {data: 'mob card Object received'});

        socket.emit('getAllAbilities');  

        convertJSONtoMobCardObject(data.cards);
        assignMobCardsToStaging();
        
        //need to handle count greater than 1 for each card.
        for(x=0; x < mobCards.length; x++){
           drawMobCard(x);       
        }

    });


    socket.on('AllAbilities', function(data) {
 
 
        socket.emit('received abilities', {data: 'abilities received received'});
        
        convertJSONtoAbilitiesMap(data.abilities);
        drawCardActionOptions();

    });

        


