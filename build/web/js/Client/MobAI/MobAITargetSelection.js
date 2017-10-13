//**************************************************************************
//This function will calculate and return threat level of a card.
//************************TO DO********************************************
//* - add threat level rules instead of static 1
//*************************************************************************
function getCardThreatLevel(cardID, side){
    
    var threatLevel = 0;
    var card = playerCards[cardID];
    
    if(side === enemySide){
      var card = mobCards[cardID];
    }
    
    return 1;
}
//************************************************************************



////This function identifies the best target
//************************TO DO********************************************
//* - Need to check if card is alive for inRangeEnemies.
//* - user "attackerSide" input variable to make the function generic
//* - select best target not just opposing slot
//* 1 - choose best killable card
//* 2 - choose best not-killable card
//*************************************************************************
function getBestTarget(attackerCardID, attackerSide, opponentSide){

    var thisCard        = getCard(attackerCardID, attackerSide);
    var cardAttack      = getCardAttack(attackerCardID, attackerSide);
    var cardMaxAttack   = cardAttack.maxAttack;
    var cardMinRange    = getCardMinAttackRange(attackerCardID, attackerSide);
    var cardMaxRange    = getCardMaxAttackRange(attackerCardID, attackerSide);
    var maxThreatLevel  = 0;
    var maxThreatCardID = -1;
    var x;
    var thisThreat;
   
    var killableEnemies = getKillableEnemiesWithInRange(thisCard.slotID, cardMinRange, cardMaxRange, opponentSide, cardMaxAttack);
    
    if(killableEnemies.length > 0){   
        if(killableEnemies.length === 1) return killableEnemies[0];
        
        for(x=0; x<killableEnemies.length; x++){
            thisThreat = getCardThreatLevel(killableEnemies[x], opponentSide);
            if(thisThreat > maxThreatLevel){
                maxThreatLevel  = thisThreat;
                maxThreatCardID = killableEnemies[x];
            }
        }

        return maxThreatCardID;
    }

    var inRangeEnemies = getAllEnemiesWithInRange(thisCard.slotID, cardMinRange, cardMaxRange, opponentSide);
    
    if(inRangeEnemies.length > 0){       
        if(inRangeEnemies.length === 1) return inRangeEnemies[0];
        
        for(x=0; x<inRangeEnemies.length; x++){
            thisThreat = getCardThreatLevel(inRangeEnemies[x], opponentSide);
            if(thisThreat > maxThreatLevel){
                maxThreatLevel  = thisThreat;
                maxThreatCardID = inRangeEnemies[x];
            }
        }
        
        return maxThreatCardID;
    }
    
   return -1;
}


//This function generates array of enemie cards that are wihin specified range from slotID.
function getAllEnemiesWithInRange(slotID, minRange, maxRange, opponentSide){
    
    var enemyCards   = new Array();
    var slotsInRange = getCombatSlotsWithInRange(slotID, minRange, maxRange, opponentSide);
    var x;

    for(x=0; x<slotsInRange.length; x++){ 
        
        if(cardSlots[slotsInRange[x]].cardID !== -1 && isCardAlive(cardSlots[slotsInRange[x]].cardID, opponentSide)){
            enemyCards[enemyCards.length] = cardSlots[slotsInRange[x]].cardID;
        }
    }    
    return enemyCards;
}


//This function generates array of enemie cards that are wihin specified range from slotID.
function getKillableEnemiesWithInRange(slotID, minRange, maxRange, opponentSide, maxHealth){
    
    var enemiesInRange = getAllEnemiesWithInRange(slotID, minRange, maxRange, opponentSide);
    var killableEnemyCards = new Array();
    var e;
    
    if(opponentSide === playerSide){
        for(e=0; e<enemiesInRange.length; e++){
            if(playerCards[enemiesInRange[e]].health <= maxHealth && isCardAlive(enemiesInRange[e], opponentSide)){
                killableEnemyCards[killableEnemyCards.length] = enemiesInRange[e];
            }
        }  
    }else
    if(opponentSide === enemySide){
        for(e=0; e<enemiesInRange.length; e++){
            if(mobCards[enemiesInRange[e]].health <= maxHealth && isCardAlive(enemiesInRange[e], opponentSide)){
                killableEnemyCards[killableEnemyCards.length] = enemiesInRange[e];
            }
        } 
    }

    return killableEnemyCards;
}
