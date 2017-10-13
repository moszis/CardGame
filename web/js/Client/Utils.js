    //Bring sprite to front
    PIXI.Sprite.prototype.bringToFront = function() {
           if (this.parent) {
                   var parent = this.parent;
                   parent.removeChild(this);
                   parent.addChild(this);
           }
    };


    //This function will take in text and size of each character, 
    //than calculate X offset from center required to fit it centered.
    function getXOffsetFromCenterForText(txt, charSize){

        var text = ""+txt;
        var charNumber = text.length;
        var offset = charNumber * charSize / 2;

        return offset;
    }


    /**
    * Returns a random integer between min (inclusive) and max (inclusive)
    * Using Math.round() will give you a non-uniform distribution!
    */
    function getRandomInt(min, max) {
       return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    
    function getResourceObjectID (resourceName){
        for(x=0; x < resourceMap.length; x++){
            if(resourceMap[x].name === resourceName) return x;
        }
    }
    
    
    
   
    
        
    //this function will take in lineTypeID and return starting slotID in that line
    function getStartingSlotID(lineType){
        
        var startingSlotID = -1;
        
        switch(lineType){
            case 0:
                startingSlotID = mobFirstStagingSlotID;
                break;
            case 1:
                startingSlotID = mobFirstBackRowSlotID; 
                break;
            case 2:
                startingSlotID = mobFirstFrontRowSlotID;
                break;
            case 3:
                startingSlotID = playerFirstFrontRowSlotID;
                break;
            case 4:
                startingSlotID = playerFirstBackRowSlotID;  
                break;
            case 5:
                startingSlotID = playerFirstStagingSlotID;
                break;
            default: 
                break;
        }
        
        return startingSlotID;
    }
    
    
    
    //this function will take in lineTypeID and return ending slotID in that line
    function getEndingSlotID(lineType){
        
        var endingSlotID = -1;
        
        switch(lineType){
            case 0:
                endingSlotID   = mobFirstStagingSlotID+stagingLength;
                break;
            case 1:
                endingSlotID   = mobFirstBackRowSlotID+backRowLength;   
                break;
            case 2:
                endingSlotID   = mobFirstFrontRowSlotID+frontRowLength; 
                break;
            case 3:
                endingSlotID   = playerFirstFrontRowSlotID+frontRowLength;
                break;
            case 4:
                endingSlotID   = playerFirstBackRowSlotID+backRowLength;   
                break;
            case 5:
                endingSlotID   = playerFirstStagingSlotID+stagingLength; 
                break;
            default: 
                break;
        }
        
        return endingSlotID;
    }
 
    
    
    //this function will take in one slotID and determine/return lineTypeID
    function getLineType(slotID){
        
        if(slotID >= mobFirstStagingSlotID && slotID < mobFirstStagingSlotID+stagingLength){
            return mobStagingLineID;
        }
        if(slotID >= mobFirstBackRowSlotID && slotID < mobFirstBackRowSlotID+backRowLength){
            return mobBackLineID;
        }
        if(slotID >= mobFirstFrontRowSlotID && slotID < mobFirstFrontRowSlotID+frontRowLength){
            return mobFrontLineID;
        }
        
        if(slotID >= playerFirstFrontRowSlotID && slotID < playerFirstFrontRowSlotID+frontRowLength){
            return playerFrontLineID;
        }
        if(slotID >= playerFirstBackRowSlotID && slotID < playerFirstBackRowSlotID+backRowLength){
            return playerBackLineID;
        }
        if(slotID >= playerFirstStagingSlotID && slotID < playerFirstStagingSlotID+stagingLength){
            return playerStagingLineID;
        }
    }
    
    
    
    
    //this function shuffles the array
    function shuffleArray(array) {
        var tmp, current, top = array.length;

        if(top) while(--top) {
            current = Math.floor(Math.random() * (top + 1));
            tmp = array[current];
            array[current] = array[top];
            array[top] = tmp;
        }

        return array;
    }