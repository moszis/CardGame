    
    //This function returns card object
    function getCard(cardID, cardSide){
        
        var thisCard   = new Object();
        
        if(cardSide === playerSide){
           thisCard = playerCards[cardID]; 
        }else
        if(cardSide === enemySide){
           thisCard = mobCards[cardID];
        }
        
        return thisCard;
    }

    //This function calculates "base" attack based on card statistics and weapon
    //It does not consider ability modifier or target card defence reduction
    //************************TO DO********************************************
    //* - Need to perform actual calculation
    //*************************************************************************
    function getCardAttack(cardID, cardSide){
       
        var cardAttack = new Object();
        var thisCard   = getCard(cardID, cardSide);

        var minAttack = thisCard.attack;
        var maxAttack = thisCard.attack;
        
        cardAttack = {
            minAttack : minAttack,
            maxAttack : maxAttack
        };
        
        return cardAttack;      
    }

     
    //This function will identify cards max attackiing range
    //************************TO DO********************************************
    //* - Need to perform remMoves check to make sure card can peform the ability
    //*************************************************************************
    function getCardMaxAttackRange(cardID, cardSide){
        
        var thisCard           = getCard(cardID, cardSide);
        var cardMaxAttackRange = 0;
        var cardAbilities      = thisCard.abilityList.split(',');
        var x;

        for(x=0; x < cardAbilities.length; x++){
          if(abilitieMap[cardAbilities[x]].category === meleeAttackCategoryID || abilitieMap[cardAbilities[x]].category === rangedAttackCategoryID){
              if(abilitieMap[cardAbilities[x]].range_max > cardMaxAttackRange){
                  cardMaxAttackRange = abilitieMap[cardAbilities[x]].range_max;
              }
          }
        }
        
        return cardMaxAttackRange;
    }
    
    
    //This function will identify cards min attackiing range
    //************************TO DO********************************************
    //* - Need to perform remMoves check to make sure card can peform the ability
    //*************************************************************************
    function getCardMinAttackRange(cardID, cardSide){
        
        var thisCard           = getCard(cardID, cardSide);
        var cardMinAttackRange = 100;
        var cardAbilities      = thisCard.abilityList.split(','); 
        var x;

        for(x=0; x < cardAbilities.length; x++){
          if(abilitieMap[cardAbilities[x]].category === meleeAttackCategoryID || abilitieMap[cardAbilities[x]].category === rangedAttackCategoryID){
              if(abilitieMap[cardAbilities[x]].range_min < cardMinAttackRange){
                  cardMinAttackRange = abilitieMap[cardAbilities[x]].range_min;
              }
          }
        }
        
        return cardMinAttackRange;
    }
    
    //This function simply checks if card is alive and returns boolean
    function isCardAlive(cardID, cardSide){
        
        var thisCard           = getCard(cardID, cardSide);
        
        if(thisCard.alive === false || thisCard.health <= 0) return false;
        
        return true;
    }