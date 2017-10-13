    //Default Definition of slot layouts
    //May be overwritten in generateRelativeSizes function  
    var cardSlotHeight     = 140;
    var cardSlotWidth      = 90;
    var hSpaceBetweenCards = 10;
    var vSpaceBetweenCards = 10;
    var spaceFromTop       = 30;
    var spaceFromBottom    = 30;
    var spaceAboveStaging  = 60;

    //Need to improve, need settings to all rows.
    var playerFirstStagingSlotID  = 20;
    var mobFirstStagingSlotID     = 27;
    var playerFirstBackRowSlotID  = 15;
    var mobFirstBackRowSlotID     = 0;
    var playerFirstFrontRowSlotID = 10;
    var mobFirstFrontRowSlotID    = 5;
    
    var stagingLength   = 7;
    var backRowLength   = 5;
    var frontRowLength  = 5;
    
    var mobStagingLineID = 0;
    var mobBackLineID    = 1;
    var mobFrontLineID   = 2;
    
    var playerStagingLineID = 5;
    var playerBackLineID    = 4;
    var playerFrontLineID   = 3;

    //Initial card slot generation
    //************************TO DO********************************************
    //* - Add Mob/Opponent staging slots
    //* - Expend staging areas to 6 cards
    //* - Add support for visible/invisible slot indicator
    //* - Make "Create Slot Row" function and pass parameters to it from this function
    //*************************************************************************
    function genCardSlots(){

        /*****ROW TYPES******************WRONG!!!!!! - NEED TO CHANGE THE TYPES
         * 
         *  1 - Player Staging
         *  2 - Plyaer Defence
         *  3 - Player Attack
         *  4 - Oponnent Attack
         *  5 - Opponnet Defence
         *  6 - Opponnent Staging
         */

        var cardSlot = new Object();
        var slotX = windowWidth / 2 - (cardSlotWidth * 2.5 + hSpaceBetweenCards *2);
        var slotY = spaceFromTop;
        var row   = 1;
        var col   = 1;
        var id    = 0;
        var side  = "top";
        var cardID = -1;

        //Generate Opponent Def Row
        for(x=0; x < 5; x++){

            cardSlot = {
                x : slotX,
                y : slotY,
                name :side+"R"+row+"C"+col,
                id : id,
                row : row,
                col : col,
                type : 5,
                line : 1,
                visible : 1,
                cardID : cardID
            }
            cardSlots[id] = cardSlot;

            slotX = slotX + cardSlotWidth + hSpaceBetweenCards,
            id++;
            col++;
        }  



        //Generate Generate Opponent Attack Row
        slotX = cardSlots[0].x;
        slotY = slotY + cardSlotHeight + vSpaceBetweenCards;
        row   = 2;
        col   = 1;
        for(x=5; x < 10; x++){

            cardSlot = {
                x : slotX,
                y : slotY,
                name :side+"R"+row+"C"+col,
                id : id,
                row : row,
                col : col,
                type : 4,
                line : 2,
                visible : 1,
                cardID : cardID
            }
            cardSlots[id] = cardSlot;

            slotX = slotX + cardSlotWidth + hSpaceBetweenCards,
            id++;
            col++;
        }  


        //Generate Player Front Row
        slotX = cardSlots[0].x;
        slotY = windowHeight - cardSlotHeight*3 - spaceFromBottom - vSpaceBetweenCards - spaceAboveStaging;
        row   = 3;
        col   = 1;
        side  = "bottom";

        for(x=10; x < 15; x++){

            cardSlot = {
                x : slotX,
                y : slotY,
                name :side+"R"+row+"C"+col,
                id : id,
                row : row,
                col : col,
                type : 3,
                line : 3,
                visible : 1,
                cardID : cardID
            }
            cardSlots[id] = cardSlot;

            slotX = slotX + cardSlotWidth + hSpaceBetweenCards,
            id++;
            col++;
        } 


        //Generate Player Defence Row
        slotX = cardSlots[0].x;
        slotY = windowHeight - cardSlotHeight*2 - spaceFromBottom - spaceAboveStaging;
        row   = 4;
        col   = 1;


        for(x=15; x < 20; x++){

            cardSlot = {
                x : slotX,
                y : slotY,
                name :side+"R"+row+"C"+col,
                id : id,
                row : row,
                col : col,
                type : 2,
                line : 4,
                visible : 1,
                cardID : cardID
            }
            cardSlots[id] = cardSlot;

            slotX = slotX + cardSlotWidth + hSpaceBetweenCards,
            id++;
            col++;
        } 



        //Generate Player Staging Row
        slotX = cardSlots[0].x - cardSlotWidth - hSpaceBetweenCards;
        slotY = windowHeight - cardSlotHeight - spaceFromBottom;
        row   = 5;
        col   = 1;


        for(x=20; x < 27; x++){

            cardSlot = {
                x : slotX,
                y : slotY,
                name :side+"R"+row+"C"+col,
                id : id,
                row : row,
                col : col,
                type : 1,
                line : 5,
                visible : 1,
                cardID : cardID
            }
            cardSlots[id] = cardSlot;

            slotX = slotX + cardSlotWidth + hSpaceBetweenCards,
            id++;
            col++;
        } 

        //Generate Mob Staging Row
        slotX = 0;
        slotY = 0;
        row   = 0;
        col   = 1;
        side  = "hidden";


        for(x=27; x < 34; x++){
            
            cardSlot = {
                x : slotX,
                y : slotY,
                name :side+"R"+row+"C"+col,
                id : id,
                row : row,
                col : col,
                type : 6,
                line : 0,
                visible : 0,
                cardID : cardID
            }
            cardSlots[id] = cardSlot;
            
            id++;
            col++;
        } 


    }


    //This function draws all visible card slots
    //************************TO DO********************************************
    //* - Add support for visible
    //* - Adjust player staging area to center (in object generation)
    //* - Use settings parameters (for number of slots) instead of static numbers (27)
    //*************************************************************************
    function drawCardSlots() {

        for(x=0; x < 27; x++){  

            var graphics = new PIXI.Graphics();

            // set the line style to have a width of 5 and set the color to red
            graphics.lineStyle(10, 0x000000);
            graphics.buttonMode = true;
            //graphics.setInteractive(true);
            graphics.beginFill(0xFFFFFF);
            graphics.drawRect(cardSlots[x].x, cardSlots[x].y, cardSlotWidth, cardSlotHeight);

           // graphics.hitArea = new PIXI.Rectangle(cardSlots[x].x, cardSlots[x].y, cardSlotWidth, cardSlotHeight);
           // graphics.mouseover = function(e) {
                //Not useful at this moment.  Moving card over is not considered mouse over.
                //Possibly can utilize for tooltips about that slot.
                //But will need to figure out how to identify each of them separatelly
           // };

            graphics.alpha = 0.6;

            cardSlotObjects[x] = graphics;
            stage.addChild(graphics);
        }  


    }
        
    //This function highlights specific card slot
    //If color is not passed will highlight green
    function highlightCardSlot(slotID, fillColor, lineColor, flagHighlighted){

        if(!fillColor){
            fillColor = '0x00FF00';
        }
        if(!lineColor){
            lineColor = '0x000000';
        }

        if(slotID >=0 && cardSlots[slotID].cardID === -1){

            graphics = cardSlotObjects[slotID];

            graphics.beginFill(fillColor);
            graphics.lineStyle(5, lineColor);
            graphics.drawRect(cardSlots[slotID].x, cardSlots[slotID].y, cardSlotWidth, cardSlotHeight);
            graphics.alpha = 0.6;

            cardSlotObjects[slotID] = graphics;

            stage.addChild(graphics);

            if(flagHighlighted){
               highlightedSlot = slotID;
            }
        }
    }
              
    //This function removes highlighting from highlighted slot
    //************************TO DO********************************************
    //* - Add check for visible if needed
    //*************************************************************************
    function clearHighlightedSlot(slotID){

        if(slotID >= 0 && slotID < cardSlots.length && cardSlots[slotID].visible == 1) {
           graphics = cardSlotObjects[slotID];
           graphics.clear();
           drawCardSlot(slotID);
        } 
        highlightedSlot = -1; //may not need this anymore
    }

    //This function removes highlighting from all highlighted slots
    //If removeAllowed boolean is true and is passed it also removes this indicator from all slots
    function clearAllHighlightedSlots(removeAllowed){
        for(x=0; x < cardSlots.length; x++){
            clearHighlightedSlot(x);
            if(removeAllowed){
                cardSlots[x].allowed = false;
            }
        }
    }
    
    
    //This function identifies card slot where mouse is located
    //************************TO DO********************************************
    //* - See if can be rewritten to make it cleaner and more generic
    //*************************************************************************
    function identifyCardSlot(x, y){

        //NEED TO REWRITE THIS for estetics only.
        var mouseX = x;
        var mouseY = y;

        if (mouseY> cardSlots[0].y && mouseY < cardSlots[0].y + cardSlotHeight) {
          mouseRow = 1;
        }else
        if (mouseY > cardSlots[5].y && mouseY< cardSlots[5].y + cardSlotHeight) {
          mouseRow = 2;
        }else
        if (mouseY > cardSlots[10].y && mouseY< cardSlots[10].y + cardSlotHeight) {
          mouseRow = 3;
        }else
        if (mouseY> cardSlots[15].y && mouseY < cardSlots[15].y + cardSlotHeight) {
          mouseRow = 4;
        }else
        if (mouseY> cardSlots[20].y && mouseY < cardSlots[20].y + cardSlotHeight) {
          mouseRow = 5;
        }else{
          mouseRow = -1;
        }

        if(mouseRow === 5){
            if (mouseX > cardSlots[20].x && mouseX < cardSlots[20].x +cardSlotWidth){
              mouseCol = 0; 
            }else
            if (mouseX > cardSlots[21].x && mouseX < cardSlots[21].x +cardSlotWidth){
              mouseCol = 1; 
            }else
            if (mouseX > cardSlots[22].x && mouseX < cardSlots[22].x +cardSlotWidth){
              mouseCol = 2; 
            }else
            if (mouseX > cardSlots[23].x && mouseX < cardSlots[23].x +cardSlotWidth){
              mouseCol = 3; 
            }else
            if (mouseX > cardSlots[24].x && mouseX < cardSlots[24].x +cardSlotWidth){
              mouseCol = 4; 
            }else
            if (mouseX > cardSlots[25].x && mouseX < cardSlots[25].x +cardSlotWidth){
              mouseCol = 5; 
            }else
            if (mouseX > cardSlots[26].x && mouseX < cardSlots[26].x +cardSlotWidth){
              mouseCol = 6;
            }else{  mouseCol = -1;}

        }else{
            if (mouseX > cardSlots[0].x && mouseX < cardSlots[0].x +cardSlotWidth){
              mouseCol = 1;
            }else
            if (mouseX > cardSlots[1].x && mouseX < cardSlots[1].x +cardSlotWidth){
              mouseCol = 2;
            }else
            if (mouseX > cardSlots[2].x && mouseX < cardSlots[2].x +cardSlotWidth){
              mouseCol = 3;
            }else
            if (mouseX > cardSlots[3].x && mouseX < cardSlots[3].x +cardSlotWidth){
              mouseCol = 4;
            }else
            if (mouseX > cardSlots[4].x && mouseX < cardSlots[4].x +cardSlotWidth){
              mouseCol = 5;
            }else{
              mouseCol = -1;
            }
        }
    
        if (mouseRow != -1 && mouseCol != -1){
           if(mouseRow === 5){
              mouseAtSlot = playerFirstStagingSlotID + mouseCol;
           }else{
              mouseAtSlot = (mouseRow-1)*5+mouseCol-1;
           }
        }else{
           mouseAtSlot = -1;
        }
        
        return mouseAtSlot;
    }
    
    
    //This function calculates and returns the distance between two given slots
    //************************TO DO********************************************
    //*
    //*************************************************************************
    function getDistanceBetweenSlots(slotID1, slotID2){

        var slotType1    = cardSlots[slotID1].line;
        var slotType2    = cardSlots[slotID2].line;

        if(slotType1 === 0  || slotType2 === 0 || slotType1 === 5 || slotType2 === 5){
            return 0;
        }

        var lineDistance = slotType1 - slotType2;
        var oppositeSlot = slotID1 - backRowLength * lineDistance;;
        var distance     = Math.abs(oppositeSlot - slotID2)+ Math.abs(lineDistance);
        
        return distance;        
    }
    
    
    
    //This function will take in slotID and return slotID that is in front of it
    //************************TO DO********************************************
    //* - See if can be rewritten to make it cleaner and more generic
    //* - Need to make sure that staging is not considered.  Check to validate passed distance
    //*************************************************************************
    function getOpposingSlot(slotID, distance){

        var slotType    = cardSlots[slotID].line;

        if(slotType === 3 || slotType === 4){        
            return slotID - 5*distance;
        }

        if(slotType === 1 || slotType === 2){  
            return slotID + 5*distance;
        }
        
        return -1;
    }



    //This function will return center X of a slot
    function getSlotCenterX(slotID){
        
        return cardSlots[slotID].slotX + cardSlotWidth/2;
        
    } 
   
   
    //This function will return center Y of a slot
    function getSlotCenterY(slotID){
        
        return cardSlots[slotID].slotY + cardSlotWidth/2;
        
    }
    
    //This function returns array of ALL combat slots within specified range.
    //If side is specified only slots from that side is returned
    function getCombatSlotsWithInRange(slotID, minRange, maxRange, combatSide){
        
        var firstSlot  = mobFirstBackRowSlotID;
        var totalSlots = 2*(backRowLength + frontRowLength);
        var lastSlot   = firstSlot+totalSlots-1;
        
        if(combatSide !== null){
            
            totalSlots = backRowLength + frontRowLength;
            
            if(combatSide === playerSide){
                firstSlot  = playerFirstFrontRowSlotID;
            }   
        }        

        var slots = new Array();
        var s;
        
        for(s=firstSlot; s<=lastSlot; s++){ 
            if(isSlotInRange(slotID, s, minRange, maxRange)){
                slots[slots.length] = s;
            }
        }
        
        return slots;
    }
    
    
    //This slot returns boolean indicator if destinationSlot is within specified range.
    function isSlotInRange(sourceSlotID, destinationSlotID, minRange, maxRange){
        
        var distance = getDistanceBetweenSlots(sourceSlotID, destinationSlotID);

        if(distance >= minRange && distance <= maxRange){
            return true;
        }else{
            return false;
        }    
    }