    var projectileFlightDirectionNorthID = 0;
    var projectileFlightDirectionSouthID = 1;
    //This function will animate arrow flying from archer to target
    //************************TO DO********************************************
    //* - Remove static numbers.
    //* - Add support for arrow pointing in the opposite direction
    //* - Add release sound
    //* - Removal of arbitrary offset numbers would be nice..
    //*************************************************************************
    function arrowShot(sourceSlotID, destinationSlotID){
       
        //hiding visible stuck arrow, if there is one.. purelly for estetics
        hideStuckArrow();
        
        var destinationY = cardSlots[destinationSlotID].y + cardSlotHeight/2;
        var destinationX = cardSlots[destinationSlotID].x + cardSlotWidth/2;

        var sourceY      = cardSlots[sourceSlotID].y;
        var sourceX      = cardSlots[sourceSlotID].x;        
        
        var xDistance =  destinationX - (sourceX+60);
        var yDistance =  destinationY - sourceY;
        var iterations = Math.abs(yDistance/20);
        var expectedTime  = (iterations*50)+200;
        var direction;
       
        if (xDistance + cardSlotWidth/2 < 0 && yDistance < 0){
            var arrow = resourceMap[getResourceObjectID ("arrowNorthWest")];
            direction = projectileFlightDirectionNorthID;
        }else
        if (xDistance - cardSlotWidth/2 > 0 && yDistance < 0){
            var arrow = resourceMap[getResourceObjectID ("arrowNorthEast")];
            destinationX = destinationX - cardSlotWidth/2;
            direction = projectileFlightDirectionNorthID;
        }else
        if( yDistance < 0){
            var arrow = resourceMap[getResourceObjectID ("arrowNorth")];
            destinationX = destinationX - 20;
            direction = projectileFlightDirectionNorthID;
        }else
        if (xDistance + cardSlotWidth/2 < 0 && yDistance > 0){
            var arrow = resourceMap[getResourceObjectID ("arrowNorthWest")];
            direction = projectileFlightDirectionSouthID;
        }else
        if (xDistance - cardSlotWidth/2 > 0 && yDistance > 0){
            var arrow = resourceMap[getResourceObjectID ("arrowNorthEast")];
            destinationX = destinationX - cardSlotWidth/2;
            direction = projectileFlightDirectionSouthID;
        }else
        if( yDistance > 0){
            var arrow = resourceMap[getResourceObjectID ("arrowNorth")];
            destinationX = destinationX - 20;
            direction = projectileFlightDirectionSouthID;
        }

        arrow.position.x = sourceX;
        arrow.position.y = sourceY;
        arrow.visible = true;
        arrow.bringToFront();

        arrowFlight(arrow, destinationY, destinationX, direction);
          
        return expectedTime;
    }


    //This function animates flight pattern
    //************************TO DO********************************************
    //* - Add support for arrow pointing in the opposite direction
    //* - Add flight sound?
    //* - Might need to add "Block" checks if another card blocks the arrow in flight.
    //* - Receive "arrowStick" boolean to check if needs to stick (or stick type to check how it suppose to look
    //*************************************************************************
    function arrowFlight(arrow, destY, destX, direction){  
        var i = 0;
        var yIncrement = 20;
        var yDistance = Math.abs(arrow.position.y - destY);
        var xDistance = arrow.position.x + arrow.width/3 - destX;       
        var xIncrement = xDistance/yDistance*20;
        
        if(direction === projectileFlightDirectionSouthID){
           yIncrement = 0 - yIncrement;
        }
        
//alert("ydist"+yDistance+" xdist: "+xDistance+" x increment: "+xIncrement);

        setTimeout(function () {  

                if((arrow.position.y <= destY && direction === projectileFlightDirectionNorthID) || (arrow.position.y >= destY && direction === projectileFlightDirectionSouthID)){

                      x = arrow.position.x + arrow.arrowTipX;
                      y = arrow.position.y;

                      //arrowStick(x, y);

                      return;
                }

                arrow.position.y = arrow.position.y - yIncrement;
                arrow.position.x = arrow.position.x - xIncrement;

            i++;    
            if (i < 20) { 
                 arrowFlight(arrow, destY, destX, direction);  
            }  
        }, 50);
    }


    //This function draws stuck arrow
    //************************TO DO********************************************
    //* - Add arrow fade call
    //* - Add support for arrow pointing in the opposite direction
    //* - Add Blood graphic on stuck
    //* - Add sound affect
    //*************************************************************************
    function arrowStick(arrowX, arrowY){

        var arrowStuck = resourceMap[getResourceObjectID ("arrowStuckNorthEast")];

        arrowStuck.position.x = arrowX;
        arrowStuck.position.y = arrowY;
        arrowStuck.visible    = true;
        arrowStuck.bringToFront();
        
        //fadeArrow(arrowStuck);

    }
    
    
    function hideStuckArrow(){
        var arrowStuck = resourceMap[getResourceObjectID ("arrowStuckNorthEast")];
        arrowStuck.visible    = false;       
    }

    
    function fadeArrow(arrow){
        
        var fadePerIteration = 0.1;
        arrow.alpha = arrow.alpha - fadePerIteration;
        
        if(arrow.alpha <= 0) return;
        
        setTimeout(function(){
            fadeArrow(arrow);
        }, 100);
        
    }
    