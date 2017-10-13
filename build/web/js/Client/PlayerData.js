

    //This function convets player JSON object from server to playerCards array
    //************************TO DO********************************************
    //* - Most likelly slot assignment needs to be done separatelly (do not assign slots here)
    //* - This should just create an array with all player cards and car attributes.
    //* - Make sure there is no dependance between array "id" and card id.
    //* - Need to replace speed with action points (DB changes also)
    //* - Move to card file
    //*************************************************************************
    function convertJSONtoPlayerCardObject(cardsJSON){

        var cards = $.parseJSON(cardsJSON);
        cards = shuffleArray(cards);
        
        for(var i =0;i<cards.length;i++){
            cardInfo = {
                id : cards[i].card_id,
                name : cards[i].card_name,
                slotID : -1,
                alive : 1,
                attack: cards[i].card_base_atk,
                defence : 5,
                health : cards[i].card_base_hp,
                speed  : cards[i].card_base_speed,
                remMoves : cards[i].card_base_speed,
                imgSrc : "assets/images/cards/"+cards[i].card_image,
                abilityList : cards[i].abilityList
            };  
            playerCards[i] = cardInfo;

        }   
        
    }

    //This function is ran during load one time
    //This function assign for batch of staging cards
    function assignPlayerCardsToStaging(){
        
       for(var i =0;i<stagingLength;i++){
           
          if(playerCards.length <= i) break;
            
          playerCards[i].slotID = playerFirstStagingSlotID + i;
        }
    }
    