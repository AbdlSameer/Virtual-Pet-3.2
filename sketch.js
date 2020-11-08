//Create variables here
var dog;
var foodS;
var dogImg;
var dogImg1;
var foodStock;
var fedTime;
var lastFed;
var foodObj;
var feed;
var addFood;
var bedroom;
var garden;
var washroom;
var sadDog;

var gameState = "play";

function preload()
{
dogImg = loadImage("dogImg.png");
dogImg1 = loadImage("dogImg1.png");
bedroom = loadImage("images/Bed Room.png");
garden = loadImage("images/Garden.png");
washroom = loadImage("images/Wash Room.png");
sadDog = loadImage("dogImg.png");
}

function setup()
{
    database=firebase.database();
    createCanvas(1200,400);

    foodObj = new food();
    dog = createSprite(1000,300,10,10);
    dog.addImage(dogImg);
    dog.scale = 0.15;

     foodStock=database.ref('Food');
     foodStock.on("value",readStock);

    lastFed=database.ref('FeedTime')  
    lastFed.on("value",function(data) {
        lastFed=data.val();
    })

   readState = database.ref('gameState');
   readState.on("value",function(data){
       gameState = data.val();
   })
    
    feed=createButton("Feed the dog");
    feed.position(700,95);
    feed.mousePressed(feedDog);
    addFood=createButton("Add Food");
    addFood.position(800,95);
    addFood.mousePressed(addFoods);

}

function draw()
{
   background(46, 139, 87);
   foodObj.display();

  

   

currentTime=hour();
   if(currentTime==(lastFed+1))
   {
       update("Playing");
       foodObj.garden();
   }else if(currentTime==(lastFed+2)){
       update("Sleeping");
       foodObj.bedroom();
   }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
       update("Bathing");
       foodObj.washroom();
   }else{
       update("Hungry")
       foodObj.display();
   }

    if(gameState!="Hungry")
   {
       feed.hide();
       addFood.hide();
       dog.remove();
   }else{
       feed.show();
       addFood.show();
       dog.addImage(sadDog);
   }

   drawSprites(); 
}

function update(state)
   {
       database.ref('/').update({
           gameState:state
       });
   }

function readStock(data) { 
     foodS=data.val();
    foodStock=data.val();    
}

function writeStock(x)
{
  if (x<=0) 
  {
      x = 0;
  }else
  {
      x = x-1;
  }
  database.ref('/').update
   ({
       Food : x 
   })
}

function feedDog()
{
    dog.addImage(dogImg1);
    if(foodS>0)
    {
        foodS-=1
    }
     database.ref('/').update({
     Food:foodS
     })
    foodObj. updateFoodStock(foodObj.deductFood());
    database.ref('/').update({
        Food:foodObj.deductFood(),
        FeedTime : hour()
       
        
    })
    
}

    function addFoods()
     {
        foodS++;
          
         database.ref('/').update({
             Food:foodS
            
         })
   foodObj. updateFoodStock(foodObj.getFoodStock()-1);
    database.ref('/').update({
        Food:foodObj.getFoodStock(),
        FeedTime : hour()
        
    })
    
    }
    
