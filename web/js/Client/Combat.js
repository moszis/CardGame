var playerSide = 1;
var enemySide  = 0;


    //This function will identify and flag all slots where selected card can move
    function identifyAllowedMoves(cardID){

        var startSlotID = playerCards[cardID].slotID;
        var slotType    = cardSlots[startSlotID].type;
        var cardMoves   = playerCards[cardID].remMoves;

        if(cardMoves === null || cardMoves <= 0)
            return;

        switch(slotType) {
            case 1:
                for(x=15; x < 27; x++){
                   highlightCardSlot(x, '0x00FF00', '0x000000');
                   cardSlots[x].allowed = true;
                }
                break;
            case 2:
                var maxLeftSlot  = startSlotID - cardMoves;
                var maxRightSlot = startSlotID + cardMoves;
                for(x=maxLeftSlot; x <= maxRightSlot; x++){
                   if(cardSlots[x].type === 2){
                     highlightCardSlot(x, '0x00FF00', '0x000000');
                     cardSlots[x].allowed = true;
                   }
                }
                var maxTopLeftSlot = startSlotID - 5 - cardMoves + 1;
                var maxTopRightSlot = startSlotID - 5 + cardMoves - 1;
                for(x=maxTopLeftSlot; x <= maxTopRightSlot; x++){
                   if(cardSlots[x].type === 3){
                     highlightCardSlot(x, '0x00FF00', '0x000000');
                     cardSlots[x].allowed = true;
                   }
                }
                break;
            case 3:
                var maxLeftSlot  = startSlotID - cardMoves;
                var maxRightSlot = startSlotID + cardMoves;
                for(x=maxLeftSlot; x <= maxRightSlot; x++){
                   if(cardSlots[x].type === 3){
                     highlightCardSlot(x, '0x00FF00', '0x000000');
                     cardSlots[x].allowed = true;
                   }
                }
                var maxBotLeftSlot = startSlotID + 5 - cardMoves + 1;
                var maxBotRightSlot = startSlotID + 5 + cardMoves - 1;
                for(x=maxBotLeftSlot; x <= maxBotRightSlot; x++){
                   if(cardSlots[x].type === 2){
                     highlightCardSlot(x, '0x00FF00', '0x000000');
                     cardSlots[x].allowed = true;
                   }
                }
                break;
            default:
                return;
        }
    }
    
    
    
    //This is the function to use
    //This function will update cards APs
    function updateCardActionPoints(cardID, usedMoves, cardSide){

        if(cardSide === playerSide){
            playerCards[cardID].remMoves = playerCards[cardID].remMoves - usedMoves;
            cardReDrawPCActionPointsAttribute(cardID);
        }
       
        if(cardSide === enemySide){
            mobCards[cardID].remMoves = mobCards[cardID].remMoves - usedMoves;
            cardReDrawMobActionPointsAttribute(cardID);
        }      
    }
    
    function updateCardHealth(cardID, healthChange, cardSide){
        
        var health = 0;
        
        if(cardSide === playerSide){
            health = playerCards[cardID].health + healthChange;
            playerCards[cardID].health = health;
        }else
        if(cardSide === enemySide){
            health = mobCards[cardID].health + healthChange;
            mobCards[cardID].health = health; 
        }
        
        cardReDrawHPAttribute(cardID, cardSide);
                   
        if(health <= 0){
            
            setTimeout(function(){
                killCard(cardID, cardSide);
            }, 1000); 
        }
    }
    
  
    
    //This function will facilitate all high level steps that need to be taken when player ends turn
    function endTurn(){
        //* 1 - Remove ALL action points from player cards [make sure player cant do anything until end of mobturn
        //* 2 - Reset mob action points
        //* 3 - Mob moves
        //* 4 - Reset player action points
        
        resetAllMobCardsActionPoints();
        
        //setplayer action points to 0;

        runAITurn();
        
        resetAllPlayerCardsActionPoints(); 

        //**************************//
    }
    
    
    function runAITurn(){

        setTimeout(function () {   

            //****************************//
            var mobActionObject = getNextAIAction();

            switch(mobActionObject.actionType) {
                case 0:
                    //END MOB TURN
                    break;
                case 1:
                    //CARD MOVE  
                    updateCardActionPoints(mobActionObject.cardID, getDistanceBetweenSlots(mobCards[mobActionObject.cardID].slotID, mobActionObject.slotID), enemySide);
                    moveMobCard(mobActionObject.cardID, mobActionObject.slotID);
                    break;
                case 2:
                    performTargetedAbility(mobActionObject.abilityID, mobActionObject.cardID, mobActionObject.targetCardID, enemySide);
                    break;       
                default:
                    //END MOB TURN
            }
            
            //****************************//
  
            if (mobActionObject.actionType !== 0) { 
                 runAITurn();  
            }  
        }, 500);
    }
    
    //this funnction is used to reset all cards action points
    function resetAllActionPoints(){

        resetAllPlayerCardsActionPoints();      
        resetAllMobCardsActionPoints();
    }


    //This function will reset all Player Card Action Points
    function resetAllPlayerCardsActionPoints(){
        
        for(x=0; x < playerCards.length; x++){
            playerCards[x].remMoves = playerCards[x].speed;
            cardReDrawPCActionPointsAttribute(x);
        }
    }
    
    
    //This function will reset all Player Card Action Points
    function resetAllMobCardsActionPoints(){
        for(x=0; x < mobCards.length; x++){
            mobCards[x].remMoves = mobCards[x].speed; 
            cardReDrawMobActionPointsAttribute(x);
        }
    }
    
    
    //This function will take in card and side its on and..kill it.
    function killCard(cardID, side){
        
        if(side === enemySide){
            
            mobCards[cardID].alive = 0;
            cardSlots[mobCards[cardID].slotID].cardID = -1;
            var card = mobCardOjbects[cardID];
            if (card.parent) {
                   var parent = card.parent;
                   parent.removeChild(card);
            }
            
        }
        
        if(side === playerSide){
            
            playerCards[cardID].alive = 0;
            cardSlots[playerCards[cardID].slotID].cardID = -1;
            var card = playerCardOjbects[cardID];
            if (card.parent) {
                   var parent = card.parent;
                   parent.removeChild(card);
            }
        }
    }
    
    
    //This function checks if two passed slots are on opposite territories
    //It ignores all staging slots
    function isEnemieSlots(slotID1, slotID2){

        var slotID1Line = cardSlots[slotID1].line;
        var slotID2Line = cardSlots[slotID2].line;

        if(slotID1Line === 3 || slotID1Line === 4)
            if(slotID2Line === 1 || slotID2Line === 2 ) return true;

        if(slotID1Line === 1 || slotID1Line === 2)         
            if(slotID2Line === 3 || slotID2Line === 4) return true;
        
        return false;
    }
    
    
    function isEnemyAtRange(slotID, distance){

        var slotAtRange = getOpposingSlot(slotID, distance);  
        
        if(cardSlots[slotAtRange].cardID !== -1)
            return isEnemieSlots(slotID, slotAtRange);
    
        return false;
    }
    

    // This function identifies if performing selected ability on card is allowed
    //************************TO DO********************************************
    //* - Check if attacking card has sufficient moves to perform ability
    //* - Check if attacked card is within range of ability
    //* - Check if any buffs/debuffs preventing the ability to be used.
    //*************************************************************************
    function attackCardAllowed(attackerCardID, abilityID, targetCardID, attackerSide){
        

        var abilityActionPoinsReq = abilitieMap[abilityID].action_points;
        var cardActionPointsRem   = 0;
        var attackerSlotID        = -1;
        var targetSlotID          = -1;
        
        if(attackerSide === playerSide){
            cardActionPointsRem   = playerCards[attackerCardID].remMoves;
            attackerSlotID        = playerCards[attackerCardID].slotID;
            targetSlotID          = mobCards[targetCardID].slotID;
        }else{
            cardActionPointsRem   = mobCards[attackerCardID].remMoves;
            attackerSlotID        = mobCards[attackerCardID].slotID;
            targetSlotID          = playerCards[targetCardID].slotID;
        }
        
        if(cardActionPointsRem < abilityActionPoinsReq) return false;

        
        var distanceBetweenCards  = getDistanceBetweenSlots(attackerSlotID, targetSlotID);

        if(distanceBetweenCards > abilitieMap[abilityID].range_max || distanceBetweenCards < abilitieMap[abilityID].range_min)
            return false;
        
        return true;
        
    }

    
    function getDamage(sourceCardID, targetCardID, cardSide){
        
        if(cardSide === playerSide){
            return playerCards[sourceCardID].attack;
        }else
        if(cardSide === enemySide){
            return mobCards[sourceCardID].attack;
        }
    }