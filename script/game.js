// *** Code for the Space-Explorers Game ***

// store the final score of the player
let finalScore = 0;

// setup the object that defines the state of the game
let gameObj = {
  gameRestart: false,
  gameChooseShip: false,
  gameInst: false,
  gameStarted: false,
  gamePaused: false,
  gamWon: false,
  gameOver: false,
  levelOffset: 30,
  scoreOffset: 0,
  level: 1,
  numEnemies: 2,
  numBenefits: 5
};

// define the key codes of the keyboard keys
let keyCodes = {
  downArrow:40,
  upArrow:38,
  wKey:87,
  sKey:83,
  enterKey:13,
  cKey:67,
  oneKey:97,
  twoKey:98,
  rKey:82
};

// define the requestAnimationFrame
let requestAnimationFrame = window.requestAnimationFrame ||
                            window.mozRequestAnimationFrame ||
                            window.webkitRequestAnimationFrame ||
                            window.msRequestAnimationFrame;

// set the canvas and context objects
let canvas = document.querySelector("#gameCanvas");
let context = canvas.getContext("2d");

// function to draw the game data
let drawGameData = () => {
  context.font = "bold 20px Helvetica, Arial, sans-serif";
  context.fillStyle = "white";
  context.fillText(" |  Score : " + player.score, 40, 120);
  context.fillText(" |  Lives : " + player.life, 40, 150);
  context.fillText(" |  Level : " + gameObj.level, 40, 180);
}

// add background image for start screen
const startBG = new Image();
startBG.src = 'gameAssets/gameBG.png';
startBG.position = { x: 0, y: 0};

// add background image for instructions screen
const instBG = new Image();
instBG.src = 'gameAssets/instructionsBG.jpg';
instBG.position = { x: 0, y: 0};

// add background image for choose ship screen
const chooseShipBG = new Image();
chooseShipBG.src = 'gameAssets/chooseShipBG.jpg';
chooseShipBG.position = { x: 0, y: 0};

// add background image
const backgroundImage = new Image();
backgroundImage.src = 'gameAssets/bg.jpg';
backgroundImage.position = { x: 0, y: 0};

// add the stars slide
const stars = new Image();
stars.src = 'gameAssets/stars.png';
stars.position = { x: 0, y: 0};

// add the second slide of stars
const stars2 = new Image();
stars2.src = 'gameAssets/stars.png';
stars2.position = { x: (canvas.width + 1550), y: 0};

// define the player's image
let playerImg = new Image();
playerImg.src = "gameAssets/ship2.png";

// assign the initial properties of the player
let player = {
  x: (canvas.width / 2) + 100, 
  y: (canvas.height / 2),
  radius: 110,
  ring: 8,
  strokeColor: "white",
  fillColor: "transparent",
  speed: 25,
  life: 5,
  score: 0,
  img: playerImg
};

// function to draw the player
let drawPlayer = () => {
  
  // draw the player's image
  context.drawImage(player.img, (player.x - 90), (player.y - 110), 180, 220);

  // draw the ring around the player
  context.beginPath();
  context.arc(player.x, player.y, player.radius, 0, 2*Math.PI);
  context.strokeStyle = player.strokeColor;
  context.fillStyle = player.fillColor;
  context.lineWidth = player.ring;
  context.shadowColor = 'white';
  context.shadowOffsetX = 0;
  context.shadowOffsetY = 0;
  context.shadowBlur = 15;
  context.closePath();
  context.fill();
  context.stroke();
}

// function to check if two objects objects are colliding
let areColliding = (obj1, obj2) => {
  let dx = obj1.x - obj2.x;
  let dy = obj1.y - obj2.y;
  let distance = Math.sqrt(dx * dx + dy * dy);
  if (distance < obj1.radius + obj2.radius) {
    return true;
  }
  return false;
}

// define the enemy / harm objects
let enemyRadius = 40;
let enemyColor = "red";
let enemySpeed = 10;
let enemyImg = new Image();
enemyImg.src = "gameAssets/meteor.svg";

// define the collection of enemy objects
let enemies = [];

// add elements to the collection of ememy objects
for (let i = 0; i < gameObj.numEnemies; i++) {
  let x = (canvas.width) + 1500;
  let y = enemyRadius + (Math.random() * (canvas.height - (2 * enemyRadius)));
  
  enemies.push({
                x:x, 
                y:y, 
                radius:enemyRadius, 
                speed:enemySpeed, 
                colour:enemyColor,
                img:enemyImg
              });
}

// function to check if the enemy objects are colliding
// if colliding, then re-draw then in a new position
// avoids overlap of enemy objects
let checkEnemyCollision = () => {
  enemies.forEach( (objA) => {
    enemies.forEach( (objB) => {
      
      // check if we are not comparing the same circle
      if (objA != objB) {
      
        // check if the circles are colliding
        if (areColliding(objA, objB)) {
      
          // reposition one of the circles in a random y coordinate
          objA.y = objA.radius + (Math.random() * (canvas.height - (2 * objA.radius)));
        }
      }
    });
  });
}

// check for collision between the player and the enemy / harm objects
let playerEnemyCollision = () => {
  
  // iterate over each enemy element
  enemies.forEach( (enemy) => {
    
    // check for collision
    if (areColliding(player, enemy)) {
      player.life -= 1; // decrement player life
      enemy.x = (canvas.width);
      enemy.y = enemy.radius + (Math.random() * (canvas.height - (2 * enemy.radius)));
    }
  });   
}

// function to draw the ememy / harm objects
let drawEnemies = () => {
  enemies.forEach( (enemy) => {

    // draw the ring
    context.beginPath();
    context.arc(enemy.x, enemy.y, enemy.radius, 0, 2*Math.PI);
    context.strokeStyle = enemy.colour;
    context.fillStyle = "transparent";
    context.lineWidth = 8;
    context.shadowColor = 'yellow';
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;
    context.shadowBlur = 15;
    context.closePath();
    context.fill();
    context.stroke();
    
    // draw the enemy's image
    context.drawImage(enemy.img, (enemy.x - 42), (enemy.y - 95), 200, 200);
    
    // change the posiion of the enemy object
    enemy.x -= enemy.speed;
  });
  
  // check if the enemy objects are colliding
  checkEnemyCollision();
}

// define the benefit objects
let benefitRadius = 30;
let benefitColor = "gold";
let benefitSpeed = 10;
let benefitImg = new Image();
benefitImg.src = "gameAssets/coin.svg";

let benefits = [];

// add elements to the collection of benefit objects
for (let i = 0; i < gameObj.numBenefits; i++) {
  // let x = (canvas.width) + 1635;
  let x = (canvas.width) + 1500;
  let y = benefitRadius + (Math.random() * (canvas.height - (2 * benefitRadius)));
  // let direction = Math.random() * 2.0 * Math.PI;
  benefits.push({
                  x:x, 
                  y:y, 
                  radius:benefitRadius, 
                  speed:benefitSpeed,
                  colour:benefitColor, 
                  img:benefitImg,
                  type:"coin"
                });
}

// add a medical kit object that will increment the players life by 1
gameObj.numBenefits++;
let medKitImg = new Image();
medKitImg.src = 'gameAssets/medKit.svg';

let x = (canvas.width) + 1500;
let y = benefitRadius + (Math.random() * (canvas.height - (2 * benefitRadius)));

// push medkit object to the collection of benefit objects
benefits.push({ x:x, y:y, radius:benefitRadius, speed:6, colour:benefitColor, img:medKitImg, type:"medKit" });

// function to check if benefit objects are colliding
// if colliding, then re-draw then in a new position      
let checkBenefitCollision = () => {
  benefits.forEach( (objA) => {
    benefits.forEach( (objB) => {
      
      // check if we are not comparing the same circle
      if (objA != objB) {
      
        // check if the circles are colliding
        if (areColliding(objA, objB)) {
      
          // reposition one of the circles in a random y coordinate
          objA.y = objA.radius + (Math.random() * (canvas.height - (2 * objA.radius)));
        }
      }
    });
  });
}

// function to draw the benefit objects
let drawBenefits = () => {
  benefits.forEach( (benefit) => {
    // draw the ring
    context.beginPath();
    context.arc(benefit.x, benefit.y, benefit.radius, 0, 2*Math.PI);
    context.strokeStyle = benefit.colour;
    context.fillStyle = "transparent";
    context.lineWidth = 8;
    context.shadowColor = 'yellow';
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;
    context.shadowBlur = 15;
    context.closePath();
    context.fill();
    context.stroke();
    
    // draw the benefit object's image
    context.drawImage(benefit.img, (benefit.x - 34), (benefit.y - 34), 70, 70);
    
    // change the posiion of the benefit object
    benefit.x -= benefit.speed;
  });
  
  // check if the benefit objects are colliding
  checkBenefitCollision();
}

// check for collision between the player and the benefit objects
let playerBenefitCollision = () => {
  
  // iterate over each benefit element
  benefits.forEach( (benefit) => {
    
    // check for collision
    if (areColliding(player, benefit)) {
      
      // increment player score if benefit object is a coin
      if (benefit.type == "coin") {
        player.score += 1;
      } else if (benefit.type == "medKit") {
        player.life++;
      }

      benefit.x = (canvas.width);
      benefit.y = benefit.radius + (Math.random() * (canvas.height - (2 * benefit.radius)));
    }
  });   
}

// function to check if the player is going off bounds
let playerEdgeCheck = (player) => {
  if ((player.y - player.radius) < 0) {
    player.y = player.radius;
  } else if ((player.y + player.radius) > canvas.height) {
    player.y = canvas.height - player.radius;
  }
}

// function to check if the enemy object is going off bounds
let enemyEdgeCheck = (enemies) => {
  enemies.forEach( (enemy) => {
    if ((enemy.x - enemy.radius) < 0) {
      enemy.x = (canvas.width);
      enemy.y = enemy.radius + (Math.random() * (canvas.height - (2 * enemy.radius)));
    }
  });
}

// function to check if the benefit object is going off bounds
let benefitEdgeCheck = (benefits) => {
  benefits.forEach( (benefit) => {
    if ((benefit.x - benefit.radius) < 0) {
      benefit.x = (canvas.width);
      benefit.y = benefit.radius + (Math.random() * (canvas.height - (2 * benefit.radius)));
    }
  });
}

// function to draw the game background
let drawBackground = () => {
  // draw the background
  context.drawImage(backgroundImage, backgroundImage.position.x, backgroundImage.position.y, canvas.width, canvas.height);

  // draw the stars
  context.drawImage(stars, stars.position.x, stars.position.y, canvas.width, canvas.height);
  stars.position.x -= 8;
  
  // draw the stars again for a wrap over
  context.drawImage(stars2, stars2.position.x, stars2.position.y, canvas.width, canvas.height);
  stars2.position.x -= 8;

  // reset the position of the image
  if(stars.position.x <= -canvas.width){
    stars.position.x = canvas.width;
  }
  if(stars2.position.x <= -canvas.width){
    stars2.position.x = canvas.width;
  }
}

// function to increment the level
let nextLevel = () => {
  // increment the player's life by 1
  player.life++;

  // add the level offset to the score offset
  gameObj.scoreOffset += gameObj.levelOffset;

  // increment game level
  gameObj.level++;

  // add an additional enemy / harm object to enemies
  let x = (canvas.width) + 1500;
  let y = enemyRadius + (Math.random() * (canvas.height - (2 * enemyRadius)));
  
  enemies.push({x:x, y:y, radius:enemyRadius, speed:enemySpeed, colour:enemyColor, img:enemyImg });
  gameObj.numEnemies++;

  // increment speed with which the enemy / harm objects move accross the screen
  enemies.forEach( (enemy) => {
    enemy.speed += 4;
  });
}

// function to draw the game over screen
let drawGameOverScreen = () => {
  // clear previous scene
  context.clearRect(0, 0, canvas.width, canvas.height);

  // draw the background
  drawBackground();

  // display game over
  context.font = "bold 80px Helvetica, Arial, sans-serif";
  context.fillStyle = "white";
  context.fillText("GAME OVER", canvas.width/2 - 200, canvas.height/2);
  
  // display final score
  context.font = "bold 30px Helvetica, Arial, sans-serif";
  context.fillText(" Final Score : " + player.score, canvas.width/2 - 200, canvas.height/2 + 60);

  context.font = "bold 40px Helvetica, Arial, sans-serif";
  context.fillText(" Press R to restart", canvas.width/2 - 200, canvas.height/2 + 120);
}

let resetGame = () => {
  // reset the game object
  gameObj.gameRestart = false;
  gameObj.gameChooseShip = false;
  // gameObj.gameInst = false;
  gameObj.gameStarted = false;
  gameObj.gamePaused = false;
  gameObj.gamWon = false;
  gameObj.gameOver = false;
  gameObj.levelOffset = 30;
  gameObj.scoreOffset = 0;
  gameObj.level = 1;
  gameObj.numEnemies = 2;
  gameObj.numBenefits = 5;

  // reset the player object
  player.speed = 25;
  player.life = 5;
  player.score = 0;
  
  // remove the additional enemies
  for (let i = enemies.length; i > 2; i--) {
    enemies.pop();
    // console.log("popped");
  }

  // reset the enemy objects speed
  enemies.forEach( (enemy) => {
    enemy.speed = 10;
  });
}

// get the device pixel ratio
dpi = window.devicePixelRatio;

// fix the device pixel ratio
let fix_dpi = () => {
  
  // create a style object that returns width and height
  let style = {
    height() {
      return +getComputedStyle(canvas).getPropertyValue('height').slice(0,-2);
    },
    width() {
      return +getComputedStyle(canvas).getPropertyValue('width').slice(0,-2);
    }
  }
  
  // set the correct attributes for a crystal clear image!
  canvas.setAttribute('width', style.width() * dpi);
  canvas.setAttribute('height', style.height() * dpi);
}

// function to draw the start screen of the game
let drawStartWindow = () => {
  context.drawImage(startBG, startBG.position.x, startBG.position.y, canvas.width, canvas.height);
  context.font = "bold 35px Helvetica, Arial, sans-serif";
  context.fillStyle = "white";
  context.fillText("Press Enter to Start", canvas.width/2 - 160, canvas.height/2 + 20);
}

// function to draw the screen that displays the instructions to the player
let drawInstructionsWindow = () => {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(instBG, instBG.position.x, instBG.position.y, canvas.width, canvas.height);

  // // add heading
  // context.font = "bold 90px Helvetica, Arial, sans-serif";
  // context.fillStyle = "white";
  // context.fillText("Welcome Explorer-202,", 150, 190);

  // context.font = "bold 40px Helvetica, Arial, sans-serif";
  // let x = 150;
  // let y = 300;

  // // add the instructions
  // context.fillText("It's your turn to lead us in the search for planet Nebulus.", x, y); 
  // context.fillText("You will be travelling through a path filled with obstacles metors and asteroids.", x, y + 50); 
  // context.fillText("  Avoid the obstacles and collect the valuable coins.", x, y + 150);
  // context.fillText("  Your ship has a protective shield. (White ring - SAFE | Red ring - DANGER)", x, y + 200); 
  // context.fillText("  Medical kits grant you extra life.", x, y + 250);
  // context.fillText("  Press UP arrow or W to go up and press DOWN arrow or S to go down.", x, y + 300);
  // context.fillText("This is your mission, should you choose to accept it.", x, y + 400);
  // context.fillText("Press c to continue...", x, y + 480);
}

// function to draw the screen that allows the user to choose the space ships
let drawChooseShipWindow = () => {
  context.clearRect(0, 0, canvas.width, canvas.height);

  context.drawImage(chooseShipBG, instBG.position.x, instBG.position.y, canvas.width, canvas.height);
  
  // // add heading
  // context.font = "bold 70px Helvetica, Arial, sans-serif";
  // context.fillStyle = "white";
  // context.fillText("Choose your ship", 140, 150);

  // // add images of ships that the user can choose from
  // let shipImg = new Image();
  // shipImg.src = 'gameAssets/ship1.png';
  // shipImg.position = { x: 300, y: canvas.height/2 - 260};
  // context.drawImage(shipImg, shipImg.position.x, shipImg.position.y, 500, 500);
  // context.font = "bold 30px Helvetica, Arial, sans-serif";
  // context.fillText("Press 1 to choose Ship-1 and 2 to choose Ship-2", 140, 200);
  // context.fillText("Press 1", 500, 750);

  // let shipImg2 = new Image();
  // shipImg2.src = 'gameAssets/ship2.png';
  // shipImg2.position = { x: 1100, y: canvas.height/2 - 230};
  // context.drawImage(shipImg2, shipImg2.position.x, shipImg2.position.y, 500, 500);
  // context.fillText("Press 2", 1200, 750);
}


  const draw = () => {
    // fix the device pixel ratio
    fix_dpi();
    
    // clear previous scene
    context.clearRect(0, 0, canvas.width, canvas.height);
    // check if game has started
    if (gameObj.gameStarted == true) {

      // draw the game data only when the game is not paused
      if (pauseGame == false) {
        
        // draw background
        drawBackground();

        // draw game data
        drawGameData();

        // check if the player can go to the next level
        if (player.score == (gameObj.scoreOffset + gameObj.levelOffset)) {
          nextLevel();
        }

        // draw the player
        drawPlayer();

        // draw enemies
        drawEnemies();

        // draw beneits
        drawBenefits();

        // check for collision between player and enemy / harm objects
        playerEnemyCollision();

        // set the player ring color to red to symbolize danger
        if (player.life <= 1) {
          player.strokeColor = "red";
        } else {
          player.strokeColor = "white";
        }

        // check if game is over
        if (player.life <= 0) {
          gameObj.gameOver = true;
        }

        // check for collision between player and benefit objects
        playerBenefitCollision();

        // check if player hits the edge
        playerEdgeCheck(player);
        
        // check if enemy objects hit the edge
        enemyEdgeCheck(enemies);

        // check if the benefit objects hit the edge
        benefitEdgeCheck(benefits);

      }

      // invoke request animation frame only when the game is not over
      if (gameObj.gameOver == false) {
        requestAnimationFrame(draw);
      } else {
        // add player's score to the dataBase
        db.players.get(userName)
        .then( (item) => {
          console.log(item.userName);

          // check if the current score is greater than the highest score
          if (item.highestScore < player.score) {
            
            // update the player's highest score
            db.players.put({userName: userName, highestScore: player.score, date: new Date()});
            console.log("new high score");
          }
        });

        // draw the game over screen
        drawGameOverScreen();
      }
      
    } else if (gameObj.gameChooseShip == true) {
      // draw choose ship screen
      drawChooseShipWindow();
      requestAnimationFrame(draw);

    } else if (gameObj.gameInst == true) {
      // draw instructions screen           
      drawInstructionsWindow();
      requestAnimationFrame(draw);

    } else {
      // draw game start screen
      drawStartWindow();
      requestAnimationFrame(draw);
    }
  }

// start drawing on the canvas
document.addEventListener("DOMContentLoaded", (event) => {
  draw();
});

// add an event listner for keydown events
document.addEventListener("keydown", (event) => {
  
  switch(event.keyCode) {
    // up arrow
    case (keyCodes.upArrow): {
      player.y -= player.speed;
      break;
    }
    // down arrow
    case (keyCodes.downArrow): {
      player.y += player.speed;
      break;
    }
      // w key (up)
    case (keyCodes.wKey): {
      player.y -= player.speed;
      break;
    }
    // s key (down)
    case (keyCodes.sKey): {
      player.y += player.speed;
      break;
    }
    // enter key (start game)
    case (keyCodes.enterKey): {
      gameObj.gameInst = true;
      break;
    }
    // c key (continue to start the game)
    case (keyCodes.cKey): {
      gameObj.gameChooseShip = true;
      break;
    }
    // when user presses 1 key (on keypad or normally)
    case (keyCodes.oneKey): {
      player.img.src = 'gameAssets/ship1.png';
      gameObj.gameStarted = true;
      break;
    }
    case (49): {
      player.img.src = 'gameAssets/ship1.png';
      gameObj.gameStarted = true;
      break;
    }
    // when user presses 2 key (on keypad or normally)
    case (keyCodes.twoKey): {
      player.img.src = 'gameAssets/ship2.png';
      gameObj.gameStarted = true;
      break;
    }
    case (50): {
      player.img.src = 'gameAssets/ship2.png';
      gameObj.gameStarted = true;
      break;
    }
    case (keyCodes.rKey): {
      // reset the game
      resetGame();

      // draw the canvas again / restart game
      draw();
    }
    // default case - unwanted key is pressed
    default: {
      console.log("case fell through");
    }
  }

});