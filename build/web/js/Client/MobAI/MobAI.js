var localCardMoveObject = new Object();


var fighterArchetypeID = 1;
var rangedArchetypeID  = 2;
var healerArchetypeID  = 3;

//Action Types:
//* 1 - move
//* 2 - attack

function getNextAIMove(){
    //returns object with move information
    blindMoveFromStaging_NextMove();
    
    if(localCardMoveObject.cardID !== -1){
      localCardMoveObject.actionType = 1;   
    }else{
      localCardMoveObject.actionType = 0;  
    }

    return localCardMoveObject;
}

function getNextAIAction(){
 
    if(moveBackLineFighterToFrontLine()){ 
       return localCardMoveObject;
    }else
    if(moveFighterFromStagingToBackLine()){
       return localCardMoveObject; 
    }else
    if(moveRangedFromStagingToBackLine()){
       return localCardMoveObject; 
    }else
    if(selectNextFighterAttack()){
       return localCardMoveObject;
    }else
    if(selectNextRangedAttack()){
       return localCardMoveObject;
    }
     

    return getNextAIMove();
}

function moveRangedFromStagingToBackLine(){

    if(isAvailableSpaceOnLine(mobBackLineID) && isAvailableArchetypeOnLine(mobStagingLineID, rangedArchetypeID, 0)){
   
        //var frontLineFighters = getAllMobFightersOnFrontLine();
        var frontLineFighters = getMobArchetypesOnLine(mobFrontLineID, fighterArchetypeID, 0);
        
        var bestFighter = getBestFighter(mobFrontLineID, 0);
        var bestBackSlot = mobCards[bestFighter].slotID - frontRowLength;
        
        if(cardSlots[bestBackSlot].cardID === -1){
            localCardMoveObject.cardID = getBestRanged(mobStagingLineID, 0);
            localCardMoveObject.slotID = bestBackSlot;
            localCardMoveObject.actionType = 1;
            return true;
    
        }else{
            for(x=0; x < frontLineFighters.length; x++){ 
               
               alert("looping to find available slot behind fighter");

            }
        }
        
    }

    return false;
}



function moveBackLineFighterToFrontLine(){
    
    //if(availableSpacesOnMobFrontLine()){ 
     if(isAvailableSpaceOnLine(mobFrontLineID)){
          
        var availableSpaces = getAvailableSpacesOnMobFrontLine();
        var availableFightersOnBackLine = getMobArchetypesOnLine(mobBackLineID, fighterArchetypeID, 1); 
                
       
        if(availableFightersOnBackLine.length > 0){ 
            for(x=0; x < availableSpaces.length; x++){ 
                for(f=0; f < availableFightersOnBackLine.length; f++ ){
                    
                    if(mobCards[availableFightersOnBackLine[f]].slotID + 5 === availableSpaces[x]){
                            localCardMoveObject.cardID = availableFightersOnBackLine[f];
                            localCardMoveObject.slotID = availableSpaces[x];
                            localCardMoveObject.actionType = 1;
                            return true;
                    }
                }
            }
        }
    }  
    
    return false;
}


function moveFighterFromStagingToBackLine(){
    
    if(isAvailableSpaceOnLine(mobBackLineID)  && isAvailableArchetypeOnLine(mobStagingLineID, fighterArchetypeID, 0) && isAvailableSpaceOnLine(mobFrontLineID) ){
       
        var availableFrontLineSpaces   = reorderForSlotPriority(getAvailableSpacesOnMobFrontLine());

        //*************************************
        //* 1 - Check if any non fighters on back line need protecting
        //*         b. - check if possible to get to that slot to protect them.
        //* 2 - Check if path open to first available front line slot (Loop)
        //* 3 - Identify best fighter to move
         
          
            
        for(x=0; x < availableFrontLineSpaces.length; x++){
            
            if(cardSlots[availableFrontLineSpaces[x] - backRowLength].cardID === -1){
                var stagingSlot = availableFrontLineSpaces[x] - backRowLength;
                
                localCardMoveObject.cardID = getBestFighter(0, 0);
                localCardMoveObject.slotID = stagingSlot;
                localCardMoveObject.actionType = 1;
                return true;
            }           
        }     
    }
    
    return false;
}


function moveFighterOnFrontLineToBlock(){
    
    if(isAvailableArchetypeOnLine(mobFrontLineID, fighterArchetypeID, 1)){
        
        if(isUnprotectedMobArchetypesOnLine(mobBackLineID, rangedArchetypeID, 0)){

            var availableFightersOnFrontLine = getMobArchetypesOnLine(mobFrontLineID, fighterArchetypeID, 1); 


            if(availableFightersOnFrontLine.length > 0){ 
                for(x=0; x < availableSpaces.length; x++){ 
                    for(f=0; f < availableFightersOnBackLine.length; f++ ){

                        if(mobCards[availableFightersOnBackLine[f]].slotID + 5 === availableSpaces[x]){
                                localCardMoveObject.cardID = availableFightersOnBackLine[f];
                                localCardMoveObject.slotID = availableSpaces[x];
                                localCardMoveObject.actionType = 1;
                                return true;
                        }
                    }
                }
            }
        }  
    }    
    return false;
    
}




///*********USELESS????**************************//
//***THI IS BLIND MOVES STRATEGY.. Just moves cards from staging to next slot available on back mob row
function blindMoveFromStaging_NextMove(){

    var openMobBackSlot = -1;
    var nextAvailableMobStagingCard = -1;
    


    for(x=mobFirstStagingSlotID; x < mobFirstStagingSlotID+stagingLength; x++){
        
        if(cardSlots[x].cardID >= 0){
            nextAvailableMobStagingCard = cardSlots[x].cardID; break;
        }
    }
    
    for(x=mobFirstBackRowSlotID; x < mobFirstBackRowSlotID+backRowLength; x++){
        if(cardSlots[x].cardID === -1){
            openMobBackSlot = x; break;
        }
    }
    localCardMoveObject.cardID = nextAvailableMobStagingCard;
    localCardMoveObject.slotID = openMobBackSlot;
}


function getNextFighterMove(){
    //returns:
    //* 1 - next fighter move object
    //* 2 - no moves available
    //* 3 - some indicator to first defer to other archetypes before coming back to fighters.  For example front line is full, so may need to move ranged/healer in the back first.
}





function getAvailableSpacesOnMobFrontLine(){
    var tempArray = new Array();
    var i = 0;
    
    for(x=mobFirstFrontRowSlotID; x < mobFirstFrontRowSlotID+frontRowLength; x++){
        if(cardSlots[x].cardID === -1){
            tempArray[i] = x;
            i++;
        }
        
    }
    return tempArray;
}

function getAvailableSpacesOnMobBackLine(){
    var tempArray = new Array();
    var i = 0;
    
    for(x=mobFirstBackRowSlotID; x < mobFirstBackRowSlotID+backRowLength; x++){
        if(cardSlots[x].cardID === -1){
            tempArray[i] = x;
            i++;
        }
        
    }
    return tempArray;
}




//**************TO CREATE*********************//





function getAvailableSpacesOnLine(lineType){}



function getLowHealthMobArchetypesOnLine(lineType, archetypeID, requiredMoves){}


//This function will take in slotID and return the next occupies slotin front of it
//Should rename the function to something better
//Support "distance" from slot passed indicator?
//Support "opponnent only" passed indicator?
//Ability to return bultiple occupied slots?  aka ballista shot
function getOccupiedOpposingSlot(slotID, distance, isPlayer, enemyOnly){

        var slotType     = cardSlots[slotID].line;
        var opposingSlot = getOpposingSlot(slotID, distance);

}

//This function will find the closest archetype that meets required parameters.
//Must add support for not opening up protected archetypes to protect this one.
function getClosestArchetype(slotID, archetypeID, lineTypeID, requiredMoves, notProtecting){
    // - Need to check if mob or player to calculate other line - Need.. getDistanceBetweenSlots function
    // - Need to check if archetype and line is passed
    // - Need to check if required moves is true, and if card has required moves
    // - If on front line, need to check if its blocking any non-fighters
    
    
    
    
    
}

function getArchetypeInRange(slotID, archetypeID, lineTypeID, additionalMoves){
    
    if(archetypeID !== -1 && lineTypeID !== -1 && isAvailableArchetypeOnLine(lineTypeID, archetypeID, 0)){
        
        
    }
}




    //This function will calculate the best space on the front line where next fighter should go.
    //************************TO DO********************************************
    //* - Check if avatar is in danger, put fighter in blocking position (middle columns)
    //* - Check if any healers need protecting on spot with access
    //* - Check if any ranged need protecting on spot with access
    //* - Check if any class need protecting on spot with access
    //* - If noone to protect consider putting fighter in front of a unit that can attack Avatar
    //* - Get most center spot available with access
    //* - Use sourceSlotID or Staging indicator as an input for access path
    //*************************************************************************
    function getBestSpaceOnMobFrontLine(mobCardID, sourceLineType, sourceSlotID){
        
        
        //* 1 - Check if any healers on back line
        //* 2 - Check if slot open in front of any healers
        //* 3 - Check if this card can move in front of it (remMoves)
        //* 4 - Repeat for Ranged
        
        if(isUnprotectedMobArchetypesOnLine(mobBackLineID, healerArchetypeID, 0)){
            alert("HEED TO WRITE CODE TO PROTECT UNPROTECTED HEALER");
            var backLineHealers = getUnprotectedMobArchetypesOnLine(mobBackLineID, healerArchetypeID, 0);
            
        }
        
        if(isUnprotectedMobArchetypesOnLine(mobBackLineID, rangedArchetypeID, 0)){
            alert("HEED TO WRITE CODE TO PROTECT UNPROTECTED RANGED");
            var backLineRanged = getUnprotectedMobArchetypesOnLine(mobBackLineID, rangedArchetypeID, 0);
            
        }
        
        
    }




//******************************************************************************************//
//******************************************************************************************//
//******************************************************************************************//
//*******************************QUALITY****************************************************//



    // This function will take in lineType and archetypeID and return array of all cards of that archetype on this line
    //************************TO DO********************************************
    //* - check for passed attributes and default requiredMoves if necessary
    //*************************************************************************
    function getMobArchetypesOnLine(lineType, archetypeID, requiredMoves){
        var tempArray = new Array();
        var startingSlot = getStartingSlotID(lineType);
        var endingSlot   = getEndingSlotID(lineType);

        var i = 0;

        for(x=startingSlot; x < endingSlot; x++){
         
            if(cardSlots[x].cardID !== -1 && mobCards[cardSlots[x].cardID].archetype === archetypeID && mobCards[cardSlots[x].cardID].remMoves >= requiredMoves){
                tempArray[i] = cardSlots[x].cardID;
                i++; 
            }

        }
        return tempArray;
    }


    // This function will take in lineType and archetypeID and return array of all cards of that archetype on this line
    //************************TO DO********************************************
    //* - check for passed attributes and default requiredMoves if necessary
    //* - Should only be used for Back Line - need to add a check for that.
    //*************************************************************************
    function getUnprotectedMobArchetypesOnLine(lineType, archetypeID, requiredMoves){
        
        var tempArray    = new Array();
        var startingSlot = getStartingSlotID(lineType);
        var endingSlot   = getEndingSlotID(lineType);

        var i = 0;

        for(x=startingSlot; x < endingSlot; x++){

            if(cardSlots[x].cardID !== -1 && mobCards[cardSlots[x].cardID].archetype === archetypeID && mobCards[cardSlots[x].cardID].remMoves >= requiredMoves){
                var blockingSlot = x + backRowLength;

                if(cardSlots[blockingSlot].cardID === -1){
                    tempArray[i] = cardSlots[x].cardID;
                    i++; 
                    alert("card on slot "+x+" is unprotected"); 
                }
            }
        }
        return tempArray; 

    }
    


    // This function will take in lineType and archetypeID and return boolean indicating if unprotected archetype is available on that line
    //************************TO DO********************************************
    //* - check for passed attributes and default requiredMoves if necessary
    //* - Should only be used for Back Line - need to add a check for that.
    //* - Need to fix the calculation of blocking slot location (+) should only work for mobslots, need to support player slot
    //*************************************************************************
    function isUnprotectedMobArchetypesOnLine(lineType, archetypeID, requiredMoves){

        var startingSlot = getStartingSlotID(lineType);
        var endingSlot   = getEndingSlotID(lineType);

        for(x=startingSlot; x < endingSlot; x++){

            if(cardSlots[x].cardID !== -1 && mobCards[cardSlots[x].cardID].archetype === archetypeID && mobCards[cardSlots[x].cardID].remMoves >= requiredMoves){
                var blockingSlot = x + backRowLength;

                if(cardSlots[blockingSlot].cardID === -1){
                    return true;
                }
            }
        }
        return false; 
    }
    


    //This function will return boolean indicator signifying existance of archetype on specified line with required moves
    //************************TO DO********************************************
    //* - check for passed attributes and default requiredMoves if necessary
    //*************************************************************************
    function isAvailableArchetypeOnLine(lineType, archetypeID, requiredMoves){

        var tempArray = new Array();
        var startingSlot = getStartingSlotID(lineType);
        var endingSlot   = getEndingSlotID(lineType);

        var i = 0;

        for(x=startingSlot; x < endingSlot; x++){
         
            if(cardSlots[x].cardID !== -1 && mobCards[cardSlots[x].cardID].archetype === archetypeID && mobCards[cardSlots[x].cardID].remMoves >= requiredMoves){
                return true; 
            }

        }
        return false;
    }


    //This funciton checks if any slots open on specified line
    function isAvailableSpaceOnLine(lineType){

        var startingSlot = getStartingSlotID(lineType);
        var endingSlot   = getEndingSlotID(lineType);  

        for(x=startingSlot; x < endingSlot; x++){
            if(cardSlots[x].cardID === -1) return true;
        }
        return false;   
    }
    
    
    //This function returns the fighter with the highest HP on specified line with required moves
    //************************TO DO********************************************
    //* - check for passed attributes and default requiredMoves if necessary
    //*************************************************************************
    function getBestFighter(lineType, requiredMoves){

        var availableFighters = getMobArchetypesOnLine(lineType, fighterArchetypeID, 0); 

        var bestFighter = -1;
        var highestHP = 0;
        var highestAC = 0;

        for(x=0; x < availableFighters.length; x++){

            if(mobCards[availableFighters[x]].health > highestHP && mobCards[availableFighters[x]].remMoves >= requiredMoves){
                bestFighter = availableFighters[x];
                highestHP = mobCards[availableFighters[x]].health;
            }
        }
        return bestFighter;
    }
    
    
    
    
    //This function returns Ranged with the highest ATK on specified line with required moves
    //************************TO DO********************************************
    //* - check for passed attributes and default requiredMoves if necessary
    //*************************************************************************
    function getBestRanged(lineType, requiredMoves){


        var availableRnged = getMobArchetypesOnLine(lineType, rangedArchetypeID, requiredMoves); 


        var bestRanged = -1;
        var highestATK = 0;

        for(x=0; x < availableRnged.length; x++){
            if(mobCards[availableRnged[x]].health > highestATK){
                bestRanged = availableRnged[x];
                highestATK = mobCards[availableRnged[x]].attack;
            }
        }

        return bestRanged;
    }


    //This function takes in array of slots (with slot ids as only values.
    //All slots must be on the same line.
    //************************TO DO********************************************
    //* - Add support for all line types (excluding staging).
    //* - Dont have to use getLineType function, can just get it from slot object
    //*************************************************************************
    function reorderForSlotPriority(arr){

        var originalArray = arr;
        var orderedArray  = new Array();
        //var lineTypeID    = getLineType(arr[0]);
        var lineTypeID    = cardSlots[arr[0]].line;
        var startingSlot  = getStartingSlotID(lineTypeID);
        var endingSlot    = getEndingSlotID(lineTypeID);
        var middleSlot    = Math.floor(startingSlot + (endingSlot - startingSlot) / 2);

        if(originalArray.length > 1){

            for(x=0; x < originalArray.length; x++){ 

                if(originalArray[x] === middleSlot){                    
                    orderedArray[0] = originalArray[x]; 
                    break;
                }
            }

            for(x=0; x < originalArray.length; x++){ 

                if(originalArray[x] === middleSlot - 1 || originalArray[x] === middleSlot + 1)
                    orderedArray[orderedArray.length] = originalArray[x];
            }

            for(x=0; x < originalArray.length; x++){ 

                if(originalArray[x] === middleSlot - 2 || originalArray[x] === middleSlot + 2)
                    orderedArray[orderedArray.length] = originalArray[x];
            }
        }else{
            return originalArray;
        }

        return orderedArray;
    }