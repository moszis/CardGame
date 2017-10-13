//Card look related global attributes

    var cardFrameOriginalHeight = 890;
    var cardFrameOriginalWidth = 600;
    var cardImageHeight = 580;
    
    //frame is 430
    var cardImageWidth  = 600;
    
    var cardAttributeFont       = "Arial Black";
    var cardAttributeFontColor  = "white";
    var cardAttributeFontSize   = 70;
    
    //approximation.. need to figure out
    var cardAttributeFontCharSize = 50;
    
    var cardTitleFont           = "Arial Black";
    var cardTitleFontColor      = "white";
    var cardTitleFontSize       = 70;
    
    //approximation.. need to figure out
    var cardTitleFontCharSize = 50;
    
    //TEMP, may make it more dinemic or change the values and variable names
    var topLeftAttributeSlotXOffset = 100;
    var botLeftAttributeSlotXOffset = 100;
    var topRightAttributeSlotXOffset = cardFrameOriginalWidth - 100;
    var botRightAttributeSlotXOffset = cardFrameOriginalWidth - 100;
    
    var topLeftAttributeSlotYOffset  = 60;
    var topRightAttributeSlotYOffset = 60;
    var botLeftAttributeSlotYOffset  = cardFrameOriginalHeight - 55;
    var botRightAttributeSlotYOffset = cardFrameOriginalHeight - 55;
    
    var playerCardFrameSrc = "assets/images/cards/Card2Frame.png";
    var mobCardFrameSrc    = "assets/images/cards/Card2Frame.png";
    
    
    
      
    //Main Player Card Draw Function that calls everything else
    //************************TO DO********************************************
    //* - Make more generic, remove arbitrary numbers
    //* - Make card Frame dynamic
    //* - Move card event actions to separate methods in appropriate player files
    //* - 
    //*************************************************************************
    function drawCard(cardID){

        var slot = playerCards[cardID].slotID;

        if (slot !== null) {
            var card = PIXI.Sprite.fromImage(playerCardFrameSrc);

            card.interactive = true;
            card.buttonMode = true;

            card.height = cardSlotHeight;
            card.width  = cardSlotWidth;
            card.position.x = cardSlots[slot].x;
            card.position.y = cardSlots[slot].y;
            card.id  = cardID;


            // use the mousedown and touchstart
            card.mousedown = card.touchstart = function(data)
            {
                    // data.originalEvent.preventDefault()
                    // store a refference to the data
                    // The reason for this is because of multitouch
                    // we want to track the movement of this particular touch
                    identifyAllowedMoves(this.id);
                    this.bringToFront();
                    this.data = data;
                    this.alpha = 1;
                    this.dragging = true;

                    hideAllCardAbilities();

            };

            // set the events for when the mouse is released or a touch is released
            card.mouseup = card.mouseupoutside = card.touchend = card.touchendoutside = function(data)
            {     

                    this.anchor.x = 0;
                    this.anchor.y = 0;        
                    cardChildrenAdjustForAnchor(card, this.anchor.x, this.anchor.y);

                    this.alpha = 1;
                    this.dragging = false;
                    // set the interaction data to null
                    this.data = null;

                    identifyCardSlot(this.position.x, this.position.y);

                    if(mouseAtSlot >= 0 && slotAllowed(mouseAtSlot)){
                       if(cardSlots[mouseAtSlot].cardID !== -1){  
                           if (cardSlots[mouseAtSlot].type === 1 && cardSlots[playerCards[this.id].slotID].type === 1){
                               switchCardSlots(this.id, cardSlots[mouseAtSlot].cardID);
                           }else{
                               //Play ERROR sound here
                               snapCardtoSlot(playerCards[this.id].slotID, this);
                           };
                       }else{
                           updateCardActionPoints(this.id, getDistanceBetweenSlots(playerCards[this.id].slotID, mouseAtSlot), playerSide);
                           snapCardtoSlot(mouseAtSlot, this);
                       };
                    }else{
                       //Play ERROR sound here
                       snapCardtoSlot(playerCards[this.id].slotID, this);
                    }                        

                    clearAllHighlightedSlots(true); 
                    bringAllCardsToFront();                   

            };

            // set the callbacks for when the mouse or a touch moves
            card.mousemove = card.touchmove = function(data)
            {
                if(this.dragging)
                {

                    identifyCardSlot(this.position.x, this.position.y);

                    //Highlighting with red
                    if(mouseAtSlot >= 0 && !slotAllowed(mouseAtSlot, this)){
                        clearHighlightedSlot(highlightedSlot);
                        highlightCardSlot(mouseAtSlot, '0xFF0000', '0x000000', true);
                    }else if(mouseAtSlot === -1){
                        clearHighlightedSlot(highlightedSlot);
                    }

                    this.anchor.x = 0.5;
                    this.anchor.y = 0.5;

                    cardChildrenAdjustForAnchor(this, this.anchor.x, this.anchor.y);

                    // need to get parent coords..
                    var newPosition = this.data.getLocalPosition(this.parent);
                    this.position.x = newPosition.x;
                    this.position.y = newPosition.y;

                    this.bringToFront();
                }
            };

            card.mouseover = card.touchstart = function (data){
                //Here goes code to display card actions (attack, defend, abilities, etc..)
                hideAllCardAbilities();
                displayCardActionOptions(this);
            };

            card.mouseout = card.touchend = function(data){
                //Here goes code to remove action options (but keep selected options)
                ///hideCardActionOptions(this.id);
                //hideAllCardAbilities();

            };

            stage.addChild(card);

            cardDrawAllAttributes(card, true);
            cardDrawImage(card, true);
            cardDrawTitle(card, true);

            playerCardOjbects[cardID] = card;
            cardSlots[slot].cardID    = cardID;
            
        }
    } 


    //This will draw card Name or Title.
    //************************TO DO********************************************
    //* - Make more generic, remove arbitrary numbers
    //* - Support parent card Anchor offset (get from card object!!!!)
    //* - Adjust for text length to make it centered (still need to do Y)
    //* - Calculate proper font size so it stays static regardless of length
    //* - Get good font style
    //* - Replace static Y offset with formula
    //*************************************************************************
    function cardDrawTitle(card, isPlayerCard){

        var font      = cardTitleFont;
        var fontSize  = cardTitleFontSize; 
        var fontColor = cardTitleFontColor;

        if(isPlayerCard){
           var cardTitle = playerCards[card.id].name;
        }else{
           var cardTitle = mobCards[card.id].name;
        }
        
        var cardName  = new PIXI.Text(cardTitle);

        cardName.setStyle({font:""+fontSize+"px "+font, fill:fontColor});
 
        cardName.position.x = cardFrameOriginalWidth/2 - getXOffsetFromCenterForText(cardTitle, cardTitleFontCharSize);
        cardName.position.y = 100;
        
        card.addChildAt(cardName, 4);
    }


    //This draws the characted or item image in the middle of the card
    //************************TO DO********************************************
    //* - Make more generic, remove arbitrary numbers (possibly good enough)
    //* - Support parent card Anchor offset (get from card object!!!!)
    //* - Remove offset code from offset function
    //* - Bring cardImageHeight/Width global attributes a little closer(probably into this fie and/or generic generateRelativeSizes() function in main file
    //* - Replace static Y offset with formula
    //*************************************************************************
    function cardDrawImage(card, isPlayerCard){
        
        if(isPlayerCard){
           var cardImageSrc = playerCards[card.id].imgSrc;
        }else{
           var cardImageSrc = mobCards[card.id].imgSrc;
        }
        
        var cardImage = PIXI.Sprite.fromImage(cardImageSrc);

        cardImage.height = cardImageHeight;
        cardImage.width  = cardImageWidth;
        cardImage.position.x = cardFrameOriginalWidth/2 - cardImageWidth /2 ;
        cardImage.position.y = 200 ;
        
        card.addChildAt(cardImage, 3);
    }

    
    
    //Parent function to call each attribute to be drawn for the first time
    //************************TO DO********************************************
    //* - Support parent card Anchor offset (get from card object!!!!)
    //* - Remove offset code from offset function (may not be right thing to do)
    //* - Possibly move stat size, width and height to generic generateRelativeSizes() function in main file
    //* - Possibly move font and fontColor to higher level card setup function and/or global variable in this file
    //* - Calculate for number of numbers in the stat
    //* - Completelly remove height and width
    //*************************************************************************
    function cardDrawAllAttributes(card, isPlayerCard){
        
        var font      = cardAttributeFont;
        var fontSize  = cardAttributeFontSize; 
        var fontColor = cardAttributeFontColor;
        
        cardDrawAttackAttribute(card, font, fontColor, fontSize, isPlayerCard);
        cardDrawHealthAttribute(card, font, fontColor, fontSize, isPlayerCard);
        cardDrawActionPointsAttribute(card, font, fontColor, fontSize, isPlayerCard);

    }


    //Moves card children based on card Anchor
    //Only applicable to player cards
    //************************TO DO********************************************
    //* - Make more generic, remove arbitrary numbers
    //* - Calculate X/Y or pull it from a generic function
    //* - Support parent card Anchor offset (get from card object!!!!)
    //* - Replace Title static Y offset with formula
    //* - Replace Image static Y offset with formula
    //*************************************************************************    
    function cardChildrenAdjustForAnchor(card, anchorX, anchorY){

        //****CARD CHILD LOCATION*****
        // 0 - TOP LEFT CORNER - ATTACK
        // 1 - TOP RIGHT CORNER - HP
        // 2 - BOTTOM LEFT CORNER - ACTION POINTS
        // 3 - CARD TITLE (will need to move to 4 or 5)
        // 4 - CARD IMAGE

        var rectangle = card.getLocalBounds();

        var child = card.getChildAt(0);
        child.position.x = topLeftAttributeSlotXOffset - getXOffsetFromCenterForText(playerCards[card.id].attack, cardAttributeFontCharSize) - (rectangle.width * anchorX);
        child.position.y = topLeftAttributeSlotYOffset - cardAttributeFontCharSize - (rectangle.height * anchorY);


        var child = card.getChildAt(1);
        child.position.x = topRightAttributeSlotXOffset - getXOffsetFromCenterForText(playerCards[card.id].health, cardAttributeFontCharSize) - (rectangle.width * anchorX);
        child.position.y = topRightAttributeSlotYOffset - cardAttributeFontCharSize - (rectangle.height * anchorY);


        var child = card.getChildAt(2);  
        child.position.x = botLeftAttributeSlotXOffset - getXOffsetFromCenterForText(playerCards[card.id].remMoves, cardAttributeFontCharSize) - (rectangle.width * anchorX);
        child.position.y = botLeftAttributeSlotYOffset - cardAttributeFontCharSize - (rectangle.height * anchorX);
 

        var child = card.getChildAt(3);  
        child.position.x = cardFrameOriginalWidth/2 - cardImageWidth / 2  - (rectangle.width * anchorX);
        child.position.y = 0 - (rectangle.height * anchorY) + 200;


        var child = card.getChildAt(4);  
        child.position.x = cardFrameOriginalWidth/2 - getXOffsetFromCenterForText(playerCards[card.id].name, cardTitleFontCharSize)  - (rectangle.width * anchorX);
        child.position.y = 0 - (rectangle.height * anchorY) + 100;
    }
     


    //Draws attack value on the card
    //************************TO DO********************************************
    //* - Make more generic, remove arbitrary numbers
    //* - Calculate X/Y or pull it from a generic function
    //* - Support parent card Anchor offset (get from card object!!!!)
    //* - Remove offset code from offset function
    //*************************************************************************
    function cardDrawAttackAttribute(card, font, fontColor, fontSize, isPlayerCard){
        
        if(isPlayerCard){
           var cardAttack   = playerCards[card.id].attack;
        }else{
           var cardAttack   = mobCards[card.id].attack;
        }
        
        var atkNumber     = new PIXI.Text(cardAttack);
        
        atkNumber.setStyle({font:""+fontSize+"px "+font, fill:fontColor});
               
        //TOP LEFT 
        atkNumber.position.x = topLeftAttributeSlotXOffset - getXOffsetFromCenterForText(cardAttack, cardAttributeFontCharSize);
        atkNumber.position.y = topLeftAttributeSlotYOffset - cardAttributeFontCharSize;
                
        card.addChildAt(atkNumber, 0);
                               
    }
    
    
    //Draws Health value on the card
    //************************TO DO********************************************
    //* - Make more generic, remove arbitrary numbers
    //* - Calculate X/Y or pull it from a generic function
    //* - Support parent card Anchor offset (get from card object!!!!)
    //* - Remove offset code from offset function
    //*************************************************************************
    function cardDrawHealthAttribute(card, font, fontColor, fontSize, isPlayerCard){
        
        if(isPlayerCard){
           var cardHealth   = playerCards[card.id].health;
        }else{
           var cardHealth   = mobCards[card.id].health;
        }
        
        var hpNumber     = new PIXI.Text(cardHealth);
        
        //TOP RIGHT
        hpNumber.position.x = topRightAttributeSlotXOffset - getXOffsetFromCenterForText(cardHealth, cardAttributeFontCharSize);
        hpNumber.position.y = topRightAttributeSlotYOffset - cardAttributeFontCharSize;
        
        hpNumber.setStyle({font:""+fontSize+"px "+font, fill:fontColor});
                
        card.addChildAt(hpNumber, 1);
                               
    }
    
    
    //Draws Action Points value on the card
    //************************TO DO********************************************
    //* - Make more generic, remove arbitrary numbers
    //* - Calculate X/Y or pull it from a generic function
    //* - Support parent card Anchor offset (get from card object!!!!)
    //* - Remove offset code from offset function
    //*************************************************************************
    function cardDrawActionPointsAttribute(card, font, fontColor, fontSize, isPlayerCard){
              
        if(isPlayerCard){
           var cardMoves   = playerCards[card.id].remMoves;
        }else{
           var cardMoves   = mobCards[card.id].remMoves;
        }
               
        var actionPoints     = new PIXI.Text(cardMoves);
        
        //BOTTOM LEFT
        actionPoints.position.x = botLeftAttributeSlotXOffset - getXOffsetFromCenterForText(cardMoves, cardAttributeFontCharSize);
        actionPoints.position.y = botLeftAttributeSlotYOffset - cardAttributeFontCharSize;
        
        actionPoints.setStyle({font:""+fontSize+"px "+font, fill:fontColor});
                
        card.addChildAt(actionPoints, 2);
                               
    }
  
    //this function redraws action points on the player card based on cardID
    //************************TO DO********************************************
    //* - Need to make sure that cardID is the same as array key id.
    //*************************************************************************
    function cardReDrawPCActionPointsAttribute(cardID){
        var card         = playerCardOjbects[cardID];
        var actionPoints = card.getChildAt(2);
        actionPoints.setText(playerCards[cardID].remMoves);
    }

    
    //this function redraws action points on the mob card based on cardID
    //************************TO DO********************************************
    //* - Need to make sure that cardID is the same as array key id.
    //* - Have attribute child IDs as global variables and not static
    //*************************************************************************
    function cardReDrawMobActionPointsAttribute(cardID){
        var card         = mobCardOjbects[cardID];
        var actionPoints = card.getChildAt(2);
        actionPoints.setText(mobCards[cardID].remMoves);
    }
    
    
    
    function snapCardtoSlot(slotID, card){   

         //Old card slot is set to empty
         cardSlots[playerCards[card.id].slotID].cardID = -1;
         //New slot is set to hold this card
         cardSlots[slotID].cardID = card.id;
         //This card is set to be in this slot id
         playerCards[card.id].slotID = slotID; 

         card.position.x = cardSlots[slotID].x;
         card.position.y = cardSlots[slotID].y;

         displayCardActionOptions(card);
         
    }
        
        
    
    
            
    //this function redraws action points on the card based on cardID
    //************************TO DO********************************************
    //* - Need to make sure that cardID is the same as array key id.
    //* - Have attribute child IDs as global variables and not static
    //*************************************************************************   
    function cardReDrawHPAttribute(cardID, cardSide){

        if(cardSide === playerSide){
            var card         = playerCardOjbects[cardID];
            var actionPoints = card.getChildAt(1);
            actionPoints.setText(playerCards[cardID].health);
        }else
        if(cardSide === enemySide){
            var card         = mobCardOjbects[cardID];
            var actionPoints = card.getChildAt(1);
            actionPoints.setText(mobCards[cardID].health);
        }
    }
    
    
    
    
    //Main draw mod card function
    //************************TO DO********************************************
    //* - Only Draw Visible cards, ignore staging
    //* - Add mouse over support to display larger card
    //*************************************************************************
    function drawMobCard(mobCardId){
        var slot           = mobCards[mobCardId].slotID;
        
        if (slot !== null) {
            var card = PIXI.Sprite.fromImage(mobCardFrameSrc);

            card.interactive = true;
            card.buttonMode = true;

            card.height = cardSlotHeight;
            card.width  = cardSlotWidth;
            card.position.x = cardSlots[slot].x;
            card.position.y = cardSlots[slot].y;
            card.id  = mobCardId;

            stage.addChild(card);

            cardDrawAllAttributes(card, false);
            cardDrawImage(card, false);
            cardDrawTitle(card, false);
            
            mobCardOjbects[mobCardId] = card;
            cardSlots[slot].cardID    = mobCardId;
            
            card.mouseover = card.touchstart = function (data){
                //* - Add display larger card popup
            };             


        }
    }
    
    
        
    //Move mob card function
    //************************TO DO********************************************
    //* - Only Draw Visible cards, ignore staging
    //* - Add slow motion to make each move visible
    //* - Add sound affect
    //* - Move slot change identifiers to separate recordCardSlotChange(card(object), fromSlotID, toSlotID, isPlayerCard) function that returns true/false
    //* - Add if statement based on true/false function above
    //*************************************************************************
    function moveMobCard(mobCardId, slotID){

        var mobCard     = mobCardOjbects[mobCardId];

        //Old card slot is set to empty
         cardSlots[mobCards[mobCard.id].slotID].cardID = -1;
         //New slot is set to hold this card
         cardSlots[slotID].cardID = mobCard.id;
         //This card is set to be in this slot id
         mobCards[mobCard.id].slotID = slotID; 

         mobCard.position.x = cardSlots[slotID].x;
         mobCard.position.y = cardSlots[slotID].y;
         

    }
    
    
    
    //Utility function that brings all cards to front layer 
    //************************TO DO********************************************
    //* - Will need to add check for visible(Drawn) cards if needed
    //*************************************************************************
    function bringAllCardsToFront(){

        for(x=0; x < playerCardOjbects.length; x++){
            sprite = playerCardOjbects[x];
            sprite.bringToFront();
        }  
        
        for(x=0; x < mobCardOjbects.length; x++){
            sprite = mobCardOjbects[x];
            sprite.bringToFront();
        }  
    }