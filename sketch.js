var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameOver,gameOverImg;
var restart,restartImg;
var jumpSound , checkPointSound, dieSound;

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");

  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkpoint.mp3")
}

function setup() {
 createCanvas(1100,windowHeight);

 var message = "This is a message";
 console.log(message);
  
  trex = createSprite(150,height-120,40,80);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.6;
  
  ground = createSprite(width-70,height-100,windowWidth+200,20);
  ground.addImage("ground",groundImage);
  
  gameOver = createSprite(width/2,height/2,100,100);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.7;
  
  restart = createSprite(width/2,gameOver.y+60,100,100);
  restart.addImage(restartImg);
  restart.scale = 0.61;
  
  invisibleGround = createSprite(200,height-90,400,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  
  trex.setCollider("rectangle",0,0,trex.width-20,trex.height-20);
  //trex.debug = true
  
  score = 0;
  
}

function draw() {
  
  background(180);
  //displaying score
  textSize(20);
  text("Score: "+ score,width-130,50);
  
  if(gameState === PLAY){
    
    gameOver.visible = false;
    restart.visible = false;
    
    ground.velocityX = -(5 + 3* score/40)
    //scoring
    if(frameCount%3==0){
    score = score + 1
    }

    if(score>0 && score%100 === 0){
       checkPointSound.play(); 
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space") || touches.length>0) {
     if(trex.y >= height-160){
        trex.velocityY = -12;
        jumpSound.play();
    }
   }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        //trex.velocityY = -12;
        jumpSound.play();
        gameState = END;
        dieSound.play()
      
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     
     //change the trex animation
      trex.changeAnimation("collided", trex_collided);
  
      ground.velocityX = 0;
      trex.velocityY = 0;
      
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);    
   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  
  if(mousePressedOver(restart)) {
      reset();
    }
  if(gameState==END && keyDown("space")||touches.length<0){
    reset();  
  }
  drawSprites();
}

function spawnObstacles(){
 if (frameCount % 90 === 0){
   var obstacle = createSprite(width+20,height-115,10,40);
   obstacle.velocityX = -(6 + score/40);
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.55;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 160 === 0) {
    var cloud = createSprite(width+20,200,40,10);
    cloud.y = Math.round(random(100,150));
    cloud.addImage(cloudImage);
    cloud.scale = Math.round(random(0.5,0.6));
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 600;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  score = 0; 
}