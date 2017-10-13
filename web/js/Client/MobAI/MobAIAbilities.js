
function selectNextFighterAttack(){

    return getMobAttack(fighterArchetypeID, mobFrontLineID);
    
}

function selectNextRangedAttack(){

    return getMobAttack(rangedArchetypeID, mobBackLineID);
    
}


//THIS IS A DRAFT.  VERY FAR FROM GOOD
//************************TO DO********************************************
//* - get best attack in general, not just highest attack
//*************************************************************************
function getMobAttack(archetypeID, lineID){
    
    if(lineID !== null && lineID > 0){
        var cards = getMobArchetypesOnLine(lineID, archetypeID, 0);
        var cardAbility = -1;
        var targetCard  = -1;
        var opposingSlot = -1;

        for(x=0; x<cards.length; x++){
            
            if(mobCards[cards[x]].remMoves > 0){
                

                var targetCardID  = getBestTarget(cards[x], enemySide, playerSide);
                
                if(targetCardID != -1){
                    
                    cardAbility   = getHighestAttackAbility(cards[x], targetCardID);

                    if(cardAbility !== -1){   
                        
                        localCardMoveObject.cardID = cards[x];
                        localCardMoveObject.targetCardID = targetCardID;
                        localCardMoveObject.actionType = 2;
                        localCardMoveObject.abilityID = cardAbility;
                        return true;
                    }
                }
            }
        }
        
    }
    return false;
} 


//This function should loop through all available card abilities and return the one with highest damage modifier
//Considering available moves and ability action points.
function getHighestAttackAbility(attackerCardID, targetCardID){
    
    var highestAttack = 0;
    var bestAbilityID = -1;
    

    var cardAbilities = mobCards[attackerCardID].abilityList.split(',');
    var cardAttack = 0;
    var baseAttack = 0;
    
    for(a=0; a < cardAbilities.length; a++){
        baseAttack = getCardAttack(attackerCardID, enemySide);
        cardAttack = baseAttack.maxAttack * abilitieMap[cardAbilities[a]].dmg_modifier;
        
        if(mobCards[attackerCardID].remMoves >= abilitieMap[cardAbilities[a]].action_points){

            if(cardAttack > highestAttack){
                highestAttack = cardAttack;
                bestAbilityID = abilitieMap[cardAbilities[a]].id;
            }
        }
    }

    return bestAbilityID;
            
}



