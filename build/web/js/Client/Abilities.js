    var meleeAttackCategoryID  = 1;
    var rangedAttackCategoryID = 3;
    
    function convertJSONtoAbilitiesMap(abilitiesJSON){

        var abilities = $.parseJSON(abilitiesJSON);

        for(var i =0;i<abilities.length;i++){
            abilityInfo = {
                id : abilities[i].ability_id,
                name : abilities[i].ability_name,
                category: abilities[i].ability_category,
                levelReq : abilities[i].level_available,
                action_points: abilities[i].action_points_req,
                range_min : abilities[i].ability_range_min,
                range_max : abilities[i].ability_range_max,
                dmg_modifier : abilities[i].ability_damagemodifier,
                animation_id : abilities[i].ability_animation_id,
                imgSrc : "assets/images/icons/"+abilities[i].icon_image
            };  
            abilitieMap[abilities[i].ability_id] = abilityInfo; 

            loadAbilityIcon(abilities[i].ability_id);

        }           
    }
        
        

    //This functions draws abilities of the card
    //************************TO DO********************************************
    //* - Does this need to support mob?
    //*************************************************************************
    function displayCardActionOptions(card){

        var slotID   = playerCards[card.id].slotID;
        var slotType = cardSlots[slotID].line;
        if(slotType === 5 || slotType === 0) return;

        //Need to perform checks on which abilities are appropriate to display
        // 1. not on staging slot - DONE
        // 2. enough moves remaining - DONE
        // 3. enemy within range - TO DO
        // 4. enemy too close to use ability?  "abstractable"? - TO THINK ABOUT

        var cardAbilities = playerCards[card.id].abilityList.split(',');

        for(x=0; x < cardAbilities.length; x++){

            //Checking if enough action points remaining to use ability
            //In the future instead of not displaying may need to just gray the ability out and/or provide tooltip with reason
            if(abilitieMap[cardAbilities[x]].action_points <= playerCards[card.id].remMoves){

                var icon = abilitieMap[cardAbilities[x]].obj;

                icon.abilityID = cardAbilities[x];
                icon.cardID = card.id;
                icon.slotID = slotID;
                
                icon.position.x = card.position.x + abilitieIconWidth*x;
                icon.position.y = card.position.y - abilitieIconHeight;
                icon.visible = true;
                icon.interactive = true;
                icon.buttonMode = true;
                icon.bringToFront();
                

                icon.mousedown = icon.touchstart = function(data)
                {
                    this.data = data;
                    this.alpha = 1;
                    this.dragging = false; 

                    switch(abilitieMap[this.abilityID].animation_id){
                        case 1:
                           //arrowShot(this.slotID, 2);
                       default:
                           //nothing
                    }
                    
                    abilityTargeting(this.cardID, this.abilityID);

                };

            }

            //Checking if ther eare enemies within ability range
            //alert("range " + abilitieMap[cardAbilities[x]].range_min+" to "+abilitieMap[cardAbilities[x]].range_max);
            //need enemy 

        }
    }

    //************************TO DO********************************************
    //* - Consider ability range
    //* - Consider ability AOE
    //* - Calculate damage (call another function)
    //* - Need to get ability completed indicator before initiating card health update.. or figure out how to time the ability 
    //*************************************************************************
    function performMobAbility(abilityID, cardID){
        
        //alert("ability "+abilityID+" activated for cardID "+cardID);
        
        var abilityMinRange = abilitieMap[abilityID].range_min;
        var abilityMaxRange = abilitieMap[abilityID].range_max;
        
        for(x=abilityMinRange; x <= abilityMaxRange; x++){

            if(isEnemyAtRange(playerCards[cardID].slotID, x)){
                
                var opposingSlot = getOpposingSlot(playerCards[cardID].slotID, x);
                
                arrowShot(playerCards[cardID].slotID, opposingSlot);
                
                
                var tempDamage   = 0 - playerCards[cardID].attack;
                
                setTimeout(function(){
                    
                    updateMobCardHealth(cardSlots[opposingSlot].cardID, tempDamage);
                    
                }, 2000);
                
                return;
            }else{}
            
        }
        /*
        var opposingSlot = getOpposingSlot(playerCards[cardID].slotID, abilitieMap[abilityID].range_min);
        
        if(cardSlots[opposingSlot].cardID !== -1){
           // alert("attacking card: "+cardSlots[opposingSlot].cardID);
            var tempDamage = 0 - playerCards[cardID].attack;
            updateMobCardHealth(cardSlots[opposingSlot].cardID, tempDamage);
            
        }else{
            alert("nothing to attack at min range");
        }
        */
    }
    
    
    
    //************************TO DO********************************************
    //* - Support Mob attacks!  or not..
    //* - Consider ability range
    //* - Consider ability AOE
    //* - Calculate damage (call another function)
    //* - Might need to tweak timing for when target card starts updating
    //* - Floating health damage??
    //*************************************************************************
    function performTargetedAbility(abilityID, sourceCardID, targetCardID, cardSide){
     

        
        if(cardSide === enemySide){
            var targetSlotID    = playerCards[targetCardID].slotID;
            var sourceSlotID    = mobCards[sourceCardID].slotID;
            var attackerSide    = enemySide;
            var targetSide      = playerSide;
        }else{
            var targetSlotID    = mobCards[targetCardID].slotID;
            var sourceSlotID    = playerCards[sourceCardID].slotID;
            var attackerSide    = playerSide;
            var targetSide      = enemySide;
        }
         
        var animationTime = 200;
        
        var abilityActionPoints = abilitieMap[abilityID].action_points;
     
        updateCardActionPoints(sourceCardID, abilityActionPoints, attackerSide);
        
        alert("Card: "+mobCards[sourceCardID].name+" is performing ability "+abilityID+" on "+playerCards[targetCardID].name);
        
            switch(abilitieMap[abilityID].animation_id){
                    case 1:
                       animationTime = arrowShot(sourceSlotID, targetSlotID);
                    default:
                       //nothing

            }

            var tempDamage   = 0 - getDamage(sourceCardID, targetCardID, attackerSide);

            setTimeout(function(){
                
                updateCardHealth(targetCardID, tempDamage, targetSide);

            }, animationTime); 
    }
    
    
    
    //************************TO DO********************************************
    //* - Support different target icons for different abilitites
    //* - Need a way to cancel the targetting
    //* - Highlight target with indication if allowed or not
    //* - Consider ability AOE (highlight area of damage)
    //*************************************************************************
    function abilityTargeting(sourceCardID, abilityID){
    
            var target = PIXI.Sprite.fromImage(targetRed);

            target.interactive = true;
            target.buttonMode = true;

            target.height = 40;
            target.width  = 40;
            target.anchor.x = 0.5;
            target.anchor.y = 0.5;
            target.position.x = stage.getMousePosition().x;
            target.position.y = stage.getMousePosition().y;
            target.abilityID  = abilityID;
            target.cardID     = sourceCardID;
            target.visible = true;
            stage.addChild(target);


            target.mousemove = target.touchmove = function(data)
            {                
                this.position.x = stage.getMousePosition().x;
                this.position.y = stage.getMousePosition().y;  
                
                var mouseSlot     = identifyCardSlot(this.position.x, this.position.y);
                var targetCardID  = cardSlots[mouseSlot].cardID;
                var attackAllowed = attackCardAllowed(target.cardID, target.abilityID, targetCardID, playerSide);

                
                //Highlighting target
                if(mouseSlot >= 0 && attackAllowed){
                   //* - Change target icon to "green" or whatever indicates allowed attack
                   //* - Some highlighting on the card maybe..
                }else{
                   //* - Change target icon to "red" or whatever indicates not allowed attack
                   //* - Remove and highlighting from the card, if any
                }
                    
                    
            };
            
            target.mousedown = target.touchstart = function(data)
            {        
                var targetSlot   = identifyCardSlot(this.position.x, this.position.y);
                var abilityID    = this.abilityID;
                var sourceCardID = this.cardID;
                var targetCardID = cardSlots[targetSlot].cardID;
                stage.removeChild(this);
                
                if(attackCardAllowed(sourceCardID, abilityID, targetCardID, playerSide)){
                    performTargetedAbility(abilityID, sourceCardID, targetCardID, playerSide);
                }else{
                    //play not allowed sound.. 
                }
            };
        
    }