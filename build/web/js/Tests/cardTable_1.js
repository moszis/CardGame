// ----------------------------------------
// Actual game code goes here.

// Global vars
canvas = null;
ctx = null;

//Defaults
var cardSlotHeight = 140;
var cardSlotWidth  = 90;
var hSpaceBetweenCards = 10;
var vSpaceBetweenCards = 10;
var spaceFromTop = 30;
var spaceFromBottom = 30;
var spaceAboveStaging = 60;

var cardTempLocationX = 0;
var cardTempLocationY = 0;
var draggedCard = null;
var draggedFromSlot = null;

var offsetLeft = 0;
var offsetTop  = 0;

var mouseAtSlotObj = null;
var activeCardOriginalSlot = null;

var playerCards = new Array();
var playerCardImages = new Array();

var cardIsMoving = false;

var tempX = 100;
// ----------------------------------------



window.onload = function () {
    canvas = document.getElementById("screen");
    ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    offsetLeft = canvas.offsetLeft;
    offsetTop  = canvas.offsetTop;
 
    mouseIsDown = false;
    

 
    generateScreenObjects()   
    drawCardSlots();
    genCardObjects();
    
    
    drawCards();
    
    
     socket = new WebSocket("ws://localhost:8080/StickerStory/story/notifications"); 
     socket.onmessage = onSocketMessage; 
    
};


function onSocketMessage(event) {
   if (event.data) {
      var receivedSticker = JSON.parse(event.data);
      ctx.strokeText("Received Object: " + JSON.stringify(receivedSticker), 100, tempX);
      
      tempX = tempX+10;
      
      /*
      if (receivedSticker.action === "add") {
         var imageObj = new Image();
         imageObj.onload = function() {
            var canvas = document.getElementById("board");
            var context = canvas.getContext("2d");
            context.drawImage(imageObj, receivedSticker.x, receivedSticker.y);
         };
         imageObj.src = "resources/stickers/" + receivedSticker.sticker;
      }
      */
   }
}


function drawCards(){
 
  
  for(x=0; x < playerCardImages.length; x++){

     
     cardSlotObject = new Object();
     cardSlotObject = eval(playerCards[x].location);

     if (cardSlotObject != null) {
        ctx.drawImage(playerCardImages[x], cardSlotObject.x, cardSlotObject.y, cardSlotWidth, cardSlotHeight);
     }   
  }
  
}

function genCardObjects(){
    
    //get Cards from database
    //will need to decide on how to limit server requests and maintain security
    //create player and enemy card object arrays with card to slot association.
    
    ctx.strokeText("Creating Cards...", 20, 60);
    var card = new Image();
    
    cardInfo = {
        id : 1,
        name : "Peasant",
        location : "bottomR1S1",
        attack: 1,
        defence : 1,
        health : 1,
        imgSrc : "images/peasant.png"
    }
    card = new Image();
    card.src = cardInfo.imgSrc;
    
    playerCards[0]= cardInfo;
    playerCardImages[0] = card;
    eval(cardInfo.location).card = 0;

    cardInfo = {
        id : 2,
        name : "Pikeman",
        location : "bottomR1S2",
        attack: 5,
        defence : 5,
        health : 5,
        imgSrc : "images/pikeman.png"
    }  
    card = new Image();
    card.src = cardInfo.imgSrc;
    
    playerCards[1] = cardInfo;
    playerCardImages[1] = card;
    eval(cardInfo.location).card = 1;
    
    ctx.strokeText("Card 0: "+playerCards[0].name, 20, 70);
    ctx.strokeText("Card 1: "+playerCards[1].name, 20, 80);
}

function handleMouseMove(e){


   if(!mouseIsDown){ return; }
     
       ctx.strokeText("Dragged CardHere: "+playerCards[draggedCard].name, 20, 190);
       
       
   ctx.clearRect(cardTempLocationX, cardTempLocationY, cardSlotWidth, cardSlotHeight);  
  

     
     
   mouseX=parseInt(e.clientX)-offsetLeft;
   mouseY=parseInt(e.clientY)-offsetTop;
   
   //need to calculate offset here based on cardSlot the card was in when its in
   cardTempLocationX = mouseX-cardSlotWidth/2;
   cardTempLocationY = mouseY-cardSlotHeight/2;

   drawCardSlots();
   drawCards();
   
   identifyCardSlot(mouseX, mouseY);
   
   if (mouseAtSlotObj != null) {
     highlightCardSlot();
   }
   ctx.drawImage(playerCardImages[draggedCard], cardTempLocationX, cardTempLocationY, cardSlotWidth, cardSlotHeight);

}

function pickupCard(){
    
  if (mouseAtSlotObj != null && mouseIsDown == true) {
    activeCardOriginalSlot = mouseAtSlotObj;
    ctx.clearRect(activeCardOriginalSlot.x, activeCardOriginalSlot.y, cardSlotWidth, cardSlotHeight);
    //playerCards[draggedCard].location = "";

  }else{
    activeCardOriginalSlot = null;
  }
   

}


function handleMouseDown(e){
    
   
  mouseX=parseInt(e.clientX)-offsetLeft;
  mouseY=parseInt(e.clientY)-offsetTop;
  
  cardTempLocationX = mouseX-cardSlotWidth/2;
  cardTempLocationY = mouseY-cardSlotHeight/2;
   
  identifyCardSlot(mouseX, mouseY);
  identifyActiveCard();
  
  if (mouseAtSlotObj != null && cardIsMoving) {
     pickupCard();
  }
  
  drawCards();

  mouseIsDown=true;
}


function identifyActiveCard(){
  if (mouseAtSlotObj != null && mouseAtSlotObj.card) {
      draggedCard = mouseAtSlotObj.card;
      ctx.strokeText("Dragged Card: "+playerCards[draggedCard].name, 20, 130);
      cardIsMoving = true;
  }else{
      draggedCard = null;
      ctx.strokeText("Dragged Card: false ", 20, 130);
  }
}


function handleMouseUp(e){
   
   if (cardIsMoving == null) {
     return;
   }
   
   ctx.clearRect(cardTempLocationX, cardTempLocationY, cardSlotWidth, cardSlotHeight);
   
   drawCardSlots();
   
   
   if (mouseAtSlotObj != null) {
      ctx.drawImage(playerCardImages[draggedCard], mouseAtSlotObj.x, mouseAtSlotObj.y, cardSlotWidth, cardSlotHeight);
      playerCards[draggedCard].location = mouseAtSlotObj.name;
      mouseAtSlotOjb.card = draggedCard;
      activeCardOriginalSlot.card = "";
   }else {
      ctx.drawImage(playerCardImages[draggedCard], activeCardOriginalSlot.x, activeCardOriginalSlot.y, cardSlotWidth, cardSlotHeight);
   }
   
    drawCards();
   
  // clear the mouseIsDown flag and put card into appropriate slot
   mouseIsDown=false;
   cardIsMoving=false;
}

function highlightCardSlot(){
    if (mouseAtSlotObj == null) {
     return;
    }   
    ctx.strokeStyle="#FF0000";
    ctx.strokeRect(mouseAtSlotObj.x, mouseAtSlotObj.y, cardSlotWidth, cardSlotHeight);
    ctx.strokeStyle="#000000";
    
}


function identifyCardSlot(mouseX, mouseY){
    
  if (mouseX > topR1S1.x && mouseX < topR1S1.x +cardSlotWidth) {
    mouseCol = 1;
  }else
  if (mouseX > topR1S2.x && mouseX < topR1S2.x +cardSlotWidth) {
    mouseCol = 2;
  }else
  if (mouseX > topR1S3.x && mouseX < topR1S3.x +cardSlotWidth) {
    mouseCol = 3;
  }else
  if (mouseX > topR1S4.x && mouseX < topR1S4.x +cardSlotWidth) {
    mouseCol = 4;
  }else
  if (mouseX > topR1S5.x && mouseX < topR1S5.x +cardSlotWidth) {
    mouseCol = 5;
  }else{
    mouseCol = 0;
  }
  
  if (mouseY> topR1S1.y && mouseY < topR1S1.y + cardSlotHeight) {
    mouseRow = 1;
  }else
  if (mouseY > topR2S1.y && mouseY< topR2S1.y + cardSlotHeight) {
    mouseRow = 2;
  }else
  if (mouseY > bottomR3S1.y && mouseY< bottomR3S1.y + cardSlotHeight) {
    mouseRow = 3;
  }else
  if (mouseY> bottomR2S1.y && mouseY < bottomR2S1.y + cardSlotHeight) {
    mouseRow = 4;
  }else
  if (mouseY> bottomR1S1.y && mouseY < bottomR1S1.y + cardSlotHeight) {
    mouseRow = 5;
  }else{
    mouseRow = 0;
  }
   
  if (mouseRow != 0 && mouseCol != 0){
    
        var side = "";
        
        if (mouseRow > 2) {side = "bottom";}
        else{side = "top";}
      
        if (side == "bottom") {
          if (mouseRow == 4) {mouseRow = 2;}else
          if (mouseRow == 5) {mouseRow = 1;}
        }
        
        ctx.clearRect(1, 1, 200, 100);
        ctx.strokeText("Card Row: "+mouseRow, 20, 20);
        ctx.strokeText("Card Col : "+mouseCol, 20, 30);
        
      
         mouseAtSlotObj = eval(""+side+"R"+mouseRow+"S"+mouseCol);
         
         ctx.strokeText("Last Slot Clicked On: "+mouseAtSlotObj.name, 20, 50);
  }else{
     mouseAtSlotObj = null;
  }
}


function generateScreenObjects(){
    generateRelativeSizes();
    generateCardSlots();  
    
}


function drawCardSlots() {
    
    //opponent slots
    //backrow
    ctx.strokeRect(topR1S1.x, topR1S1.y, cardSlotWidth, cardSlotHeight);
    ctx.strokeRect(topR1S2.x, topR1S2.y, cardSlotWidth, cardSlotHeight);
    ctx.strokeRect(topR1S3.x, topR1S3.y, cardSlotWidth, cardSlotHeight);
    ctx.strokeRect(topR1S4.x, topR1S4.y, cardSlotWidth, cardSlotHeight);
    ctx.strokeRect(topR1S5.x, topR1S5.y, cardSlotWidth, cardSlotHeight);
    
    //front row
    ctx.strokeRect(topR2S1.x, topR2S1.y, cardSlotWidth, cardSlotHeight);
    ctx.strokeRect(topR2S2.x, topR2S2.y, cardSlotWidth, cardSlotHeight);
    ctx.strokeRect(topR2S3.x, topR2S3.y, cardSlotWidth, cardSlotHeight);
    ctx.strokeRect(topR2S4.x, topR2S4.y, cardSlotWidth, cardSlotHeight);
    ctx.strokeRect(topR2S5.x, topR2S5.y, cardSlotWidth, cardSlotHeight);
    
    
    //Player Slots
    //Bottom Row
    ctx.strokeRect(bottomR1S1.x, bottomR1S1.y, cardSlotWidth, cardSlotHeight);
    ctx.strokeRect(bottomR1S2.x, bottomR1S2.y, cardSlotWidth, cardSlotHeight);
    ctx.strokeRect(bottomR1S3.x, bottomR1S3.y, cardSlotWidth, cardSlotHeight);
    ctx.strokeRect(bottomR1S4.x, bottomR1S4.y, cardSlotWidth, cardSlotHeight);
    ctx.strokeRect(bottomR1S5.x, bottomR1S5.y, cardSlotWidth, cardSlotHeight);
    
    //Ranged Row
    ctx.strokeRect(bottomR2S1.x, bottomR2S1.y, cardSlotWidth, cardSlotHeight);
    ctx.strokeRect(bottomR2S2.x, bottomR2S2.y, cardSlotWidth, cardSlotHeight);
    ctx.strokeRect(bottomR2S3.x, bottomR2S3.y, cardSlotWidth, cardSlotHeight);
    ctx.strokeRect(bottomR2S4.x, bottomR2S4.y, cardSlotWidth, cardSlotHeight);
    ctx.strokeRect(bottomR2S5.x, bottomR2S5.y, cardSlotWidth, cardSlotHeight);
    
    //Front Line Row
    ctx.strokeRect(bottomR3S1.x, bottomR3S1.y, cardSlotWidth, cardSlotHeight);
    ctx.strokeRect(bottomR3S2.x, bottomR3S2.y, cardSlotWidth, cardSlotHeight);
    ctx.strokeRect(bottomR3S3.x, bottomR3S3.y, cardSlotWidth, cardSlotHeight);
    ctx.strokeRect(bottomR3S4.x, bottomR3S4.y, cardSlotWidth, cardSlotHeight);
    ctx.strokeRect(bottomR3S5.x, bottomR3S5.y, cardSlotWidth, cardSlotHeight);
}

function generateRelativeSizes(){
    cardSlotHeight = 150;
    cardSlotWidth  = 100;
    hSpaceBetweenCards = 10;
    vSpaceBetweenCards = 10;
    spaceAboveStaging = 60;
    spaceFromTop = 30;
    spaceFromBottom = 30;
    
 
}

function generateCardSlots(){
    
    //TOP ROW 1
    topR1S1 = {
        x : canvas.width / 2 - (cardSlotWidth * 2.5 + hSpaceBetweenCards *2),
        y : spaceFromTop,
        name :"topR1S1"
    }
    
    topR1S2 = {
        x : topR1S1.x + cardSlotWidth + hSpaceBetweenCards,
        y : spaceFromTop,
        name : "topR1S2"
    }
    
    topR1S3 = {
        x : topR1S2.x + cardSlotWidth + hSpaceBetweenCards,
        y : spaceFromTop,
        name : "topR1S3"
    }
    
        
    topR1S4 = {
        x : topR1S3.x + cardSlotWidth + hSpaceBetweenCards,
        y : spaceFromTop,
        name : "topR1S4"
    }
    
    topR1S5 = {
        x : topR1S4.x + cardSlotWidth + hSpaceBetweenCards,
        y : spaceFromTop,
        name : "topR1S5"
    }
    
    //TOP ROW 2
    topR2S1 = {
        x : topR1S1.x,
        y : topR1S1.y + cardSlotHeight + vSpaceBetweenCards,
        name : "topR2S1"
    }
    
    topR2S2 = {
        x : topR1S2.x,
        y : topR2S1.y,
        name : "topR2S2"
    }
    
    topR2S3 = {
        x : topR1S3.x,
        y : topR2S1.y,
        name : "topR2S3"
    }
    
        
    topR2S4 = {
        x : topR1S4.x,
        y : topR2S1.y,
        name : "topR2S4"
    }
    
    topR2S5 = {
        x : topR1S5.x,
        y : topR2S1.y,
        name : "topR2S5"
    }
    
    
    //Bottom ROW 1 (staging)
    bottomR1S1 = {
        x : topR1S1.x,
        y : canvas.height - cardSlotHeight - spaceFromBottom,
        name : "bottomR1S1"
    }
    
    bottomR1S2 = {
        x : bottomR1S1.x + cardSlotWidth + hSpaceBetweenCards,
        y : bottomR1S1.y,
        name : "bottomR1S2"
    }
    
    bottomR1S3 = {
        x : bottomR1S2.x + cardSlotWidth + hSpaceBetweenCards,
        y : bottomR1S1.y,
        name : "bottomR1S3"
    }
    
        
    bottomR1S4 = {
        x : bottomR1S3.x + cardSlotWidth + hSpaceBetweenCards,
        y : bottomR1S1.y,
        name : "bottomR1S4"
    }
    
    bottomR1S5 = {
        x : bottomR1S4.x + cardSlotWidth + hSpaceBetweenCards,
        y : bottomR1S1.y,
        name : "bottomR1S5"
    }
    
    
    
    //Bottom ROW 2 (ranged)
    bottomR2S1 = {
        x : bottomR1S1.x,
        y : bottomR1S1.y - cardSlotHeight - spaceAboveStaging,
        name : "bottomR2S1"
    }
    
    bottomR2S2 = {
        x : bottomR1S2.x,
        y : bottomR2S1.y,
        name : "bottomR2S2"
    }
    
    bottomR2S3 = {
        x : bottomR1S3.x,
        y : bottomR2S1.y,
        name : "bottomR2S3"
    }
    
        
    bottomR2S4 = {
        x : bottomR1S4.x,
        y : bottomR2S1.y,
        name : "bottomR2S4"
    }
    
    bottomR2S5 = {
        x : bottomR1S5.x,
        y : bottomR2S1.y,
        name : "bottomR2S5"
    }
    
    
    
    //Bottom ROW 3 (front line)
    bottomR3S1 = {
        x : bottomR1S1.x,
        y : bottomR2S1.y - cardSlotHeight - vSpaceBetweenCards,
        name : "bottomR3S1"
    }
    
    bottomR3S2 = {
        x : bottomR1S2.x,
        y : bottomR3S1.y,
        name : "bottomR3S2"
    }
    
    bottomR3S3 = {
        x : bottomR1S3.x,
        y : bottomR3S1.y,
        name : "bottomR3S3"
    }
    
        
    bottomR3S4 = {
        x : bottomR1S4.x,
        y : bottomR3S1.y,
        name : "bottomR3S4"
    }
    
    bottomR3S5 = {
        x : bottomR1S5.x,
        y : bottomR3S1.y,
        name : "bottomR3S5"
    }
}


document.onmousedown = function(){
    e = window.event;
    handleMouseDown(e);
};

document.onmouseup = function(){
    e = window.event;
    handleMouseUp(e);
};

document.onmousemove = function(){
    e = window.event;
    handleMouseMove(e);
}

