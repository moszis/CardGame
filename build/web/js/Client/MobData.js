
    //Creates Mob Card List Object.
    //************************TO DO********************************************
    //* - Need to add support for mob "invisible" staging area
    //* - Most likelly slot assignment needs to be done separatelly (do not assign slots here)
    //* - This should just create an array with all mob cards and car attributes.
    //* - Make sure there is no dependance between array "id" and card id.
    //* - Move out imgSrc root path to settings
    //* - Add all card information
    //* - Add shuffle.
    //* - Move to Card file.
    //* - Possibl make this and player function one generic one.
    //*************************************************************************
    function convertJSONtoMobCardObject(cardsJSON){

        var cards = $.parseJSON(cardsJSON);

        for(var i =0;i<cards.length;i++){
            cardInfo = {
                id : cards[i].card_id,
                name : cards[i].card_name,
                type : cards[i].card_type_id,
                archetype: cards[i].card_archetype_id,
                slotID : -1,
                alive  : 1,
                attack: cards[i].card_base_atk,
                defence : 5,
                health : cards[i].card_base_hp,
                speed  : cards[i].card_base_speed,
                remMoves : cards[i].card_base_speed,
                imgSrc : "assets/images/cards/"+cards[i].card_image,
                abilityList : cards[i].abilityList
            };  
            mobCards[i] = cardInfo;
        }           
    }


    //This function is ran during load one time
    //This function assign for batch of staging cards
    function assignMobCardsToStaging(){
        
       for(var i =0;i<stagingLength;i++){
           
          if(mobCards.length <= i) break;
            
          mobCards[i].slotID = mobFirstStagingSlotID + i;
        }
    }
    