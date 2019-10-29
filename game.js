var GAME_WIDTH = 800;
var GAME_HEIGHT = 600;
var GAME_SCALE = 4;

var gameport = document.getElementById( "gameport" );
var renderer = PIXI.autoDetectRenderer({ GAME_WIDTH, GAME_HEIGHT, backgroundColor: 0x6ac48a });

gameport.appendChild( renderer.view );

/*
Different containers for different menus
*/
var stage = new PIXI.Container();
stage.scale.x = GAME_SCALE;
stage.scale.y = GAME_SCALE;


var titleScreen = new PIXI.Container();
/*
titleScreen.scale.x = GAME_SCALE/4;
titleScreen.scale.y = GAME_SCALE/4;
*/ 

var gameScreen = new PIXI.Container();
/* 
gameScreen.scale.x = GAME_SCALE/4;
gameScreen.scale.y = GAME_SCALE/4;
*/ 

var creditsScreen = new PIXI.Container();
/*
creditsScreen.scale.x = GAME_SCALE/4; 
creditsScreen.scale.Y = GAME_SCALE/4;
*/ 

var tutorialScreen = new PIXI.Container();
/*
tutorialScreen.scale.x = 0.25; 
tutorialScreen.scale.Y = 0.25; 
 */ 

var world = new PIXI.Container(); 
world.scale.x = 0.25; 
world.scale.y = 0.25; 

stage.addChild( titleScreen );

PIXI.loader
  .add( 'tilemap_json', 'tile_assets/tilemap.json' )
  .add( 'player_character',     'player_character.png' )
	.add( 'tileSet', 'tile_assets/tileset_2.png' )
  .load( loadWorld );

/*
* Create menu buttons
*/
// Create start button
var startButton = new PIXI.Sprite( PIXI.Texture.fromImage( "startButton.png" ));
startButton.interactive = true;
startButton.on( 'mousedown', startButtonClickHandler );
startButton.position.x = 400/4;
startButton.position.y = 300/4;
startButton.scale.x = GAME_SCALE/20;
startButton.scale.y = GAME_SCALE/20;
startButton.anchor.x = 0.5;
startButton.anchor.y = 0.5;

// Create tutorial button
var tutorialButton = new PIXI.Sprite( PIXI.Texture.fromImage( "tutorialButton.png" ));
tutorialButton.interactive = true;
tutorialButton.on( 'mousedown', tutorialButtonClickHandler );
tutorialButton.position.x = 500/4;
tutorialButton.position.y = 500/5;
tutorialButton.scale.x = GAME_SCALE/20;
tutorialButton.scale.y = GAME_SCALE/20;
tutorialButton.anchor.x = 0.5;
tutorialButton.anchor.y = 0.5;

// create credits button
var creditsButton = new PIXI.Sprite( PIXI.Texture.fromImage( "creditsButton.png" ));
creditsButton.interactive = true;
creditsButton.on( 'mousedown', creditsButtonClickHandler );
creditsButton.position.x = 300/4;
creditsButton.position.y = 500/5;
creditsButton.scale.x = GAME_SCALE/20;
creditsButton.scale.y = GAME_SCALE/20;
creditsButton.anchor.x = 0.5;
creditsButton.anchor.y = 0.5;

// create back button
var backButton = new PIXI.Sprite( PIXI.Texture.fromImage( "backButton.png" ));
backButton.interactive = true;
backButton.scale.x = GAME_SCALE/20;
backButton.scale.y = GAME_SCALE/20;
backButton.on( 'mousedown', backButtonClickHandler );

var MOVE_LEFT = 1;
var MOVE_RIGHT = 2;
var MOVE_UP = 3;
var MOVE_DOWN = 4;
var MOVE_NONE = 0;

const FLAT_GROUND = 15; 
const RIGHT_SLOPE = 12; 
const LEFT_SLOPE = 18; 
const BEDROCK = 14; 

let tileMap = 
	{
	width: 16, 
	height: 16, 
	tiles: 
		[
		
		1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 
		1, 2, 4, 5, 1, 1, 1, 1, 1, 1, 1, 2, 3, 4, 1, 1, 
		1, 8, 10, 11, 1, 1, 1, 1, 1, 1, 1, 8, 9, 10, 1, 1, 
		1, 1, 1, 17, 17, 17, 17, 1, 1, 1, 1, 1, 1, 1, 1, 1, 
		1, 1, 1, 15, 15, 15, 15, 12, 1, 1, 1, 1, 1, 1, 1, 1, 
		1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 
		17, 17, 17, 1, 1, 1, 1, 1, 17, 17, 1, 1, 1, 1, 1, 1, 
		15, 15, 15, 12, 1, 1, 1, 18, 15, 15, 17, 17, 17, 1, 1, 1, 
		14, 14, 14, 14, 1, 1, 18, 14, 14, 14, 15, 15, 15, 1, 1, 1, 
		13, 13, 13, 13, 1, 1, 13, 13, 13, 13, 14, 14, 14, 1, 1, 1, 
		1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 18, 
		1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 18, 14, 
		1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 18, 14, 13, 
		1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 18, 14, 13, 13, 
		1, 1, 17, 17, 17, 17, 18, 12, 17, 17, 17, 18, 14, 13, 13, 13, 
		1, 18, 15, 15, 15, 15, 15, 15, 15, 15, 15, 14, 13, 13, 13, 13
		], 
		
	tutorialTiles: 
		[
		15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15 
		]
	}	
	
var tileSet = []; 

var player;
player = {//player's metadata
		x: 200,
		y: 100,
		speed: 3,
		xVel: 0,
		yVel: 0,
		onGround: false,
		isJumping: false
	};

var playerVis = new PIXI.Sprite(PIXI.Texture.from( "player_character.png" ));
	playerVis.x = player.x;
	playerVis.y = player.y;

var gameRunning = false;

PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;

function loadWorld()
{
	let resources = PIXI.loader.resources; 
	const tileSetWidth = 6;
  const tileSetHeight = 3;
  const tileSize = 34;

  for( let i = 0; i < tileSetWidth * tileSetHeight; i++ )
    {
    let x = i % tileSetWidth;
    let y = Math.floor( i / tileSetWidth );

    tileSet[ i ] = new PIXI.Texture(
      resources.tileSet.texture,
      new PIXI.Rectangle( x * tileSize + 1, y * tileSize + 1, tileSize, tileSize )
      );
    }
		
	var background = new PIXI.Container(); 
	for( let y = 0; y < tileMap.width; y++ )
		{
			
		for( let x = 0; x < tileMap.height; x++ )
			{

			let tile = tileMap.tiles[ y * tileMap.width + x]; 
			let sprite = new PIXI.Sprite( tileSet[ tile - 1 ]); 
			sprite.anchor.x = 0.0; 
			sprite.anchor.y = 0.0; 
			sprite.x = x * ( tileSize ); 
			sprite.y = y * ( tileSize ); 
			background.addChild( sprite ); 
			}		
		}

  //world.addChild( playerVis );
	world.addChild( background ); 

  player.direction = MOVE_NONE;
  player.moving = false;
}

function keydownHandler(key) {
    //w
		// Check if the player hits the w key and they are on the ground 
    if( key.keyCode == 87 && playerOnGround( player.x, player.y )) {
			player.yVel = -2;
      player.isJumping = true;
    }

    //a
    if(key.keyCode == 65) {
		player.moveRight = true;
    }

    //d
    if(key.keyCode == 68) {
		player.moveLeft = true;
    }
}

function keyupHandler(key) {
    //a
    if(key.keyCode == 65) {
		player.moveRight = false;
    }

    //d
    if(key.keyCode == 68) {
		player.moveLeft = false;
    }
}

document.addEventListener('keydown', keydownHandler);
document.addEventListener('keyup', keyupHandler);

function moveCharacter()
{
	var newPosX = player.x + (player.speed * player.xVel);
	var newPosY = player.y + (player.speed * player.yVel);
	
	// Check if the player is currently going upward 
	if( player.yVel > 0 )
		{
			
		player.isJumping = false; 
		}

	// Check if the player is on the ground and they are not jumping
	if( playerOnGround( player.x, player.y ) && player.isJumping == false  )
		{
			
		player.yVel = 0; 
		}
	
	// If the player is not on the ground or is jumping
	else
		{
		player.yVel += .05;
		}
		
	player.y += player.speed * player.yVel;

	if( player.moveLeft == true && !leftBlocked)
	{
		player.x += 1.5;
	}

	if( player.moveRight == true && !rightBlocked)
	{
		player.x -= 1.5;
	}

	playerVis.x = player.x - 15;
	playerVis.y = player.y - 45;

}

function animate(timestamp)
{
	requestAnimationFrame(animate);
	if(gameRunning)
	{
		moveCharacter();
	}
	renderer.render(stage);
 }

function GameLoop()
{
	requestAnimationFrame(GameLoop);
	//update_camera();
}

initializeTitleScreen();
animate();


/*
* Desc: Initializes the opening title screen for the game
*/
function initializeTitleScreen()
	{

  // Add the buttons for title menu functionality
	titleScreen.addChild( startButton );
  titleScreen.addChild( tutorialButton );
  titleScreen.addChild( creditsButton );

  // Create the text that will appear on the start menu
	var titleText = new PIXI.Text( "Simple Platformer" );
	titleText.position.x = 400/4;
	titleText.position.y = 200/4;
	titleText.scale.x = GAME_SCALE/20;
	titleText.scale.y = GAME_SCALE/20;
	titleText.anchor.x = 0.5;
	titleText.anchor.y = 0.5;

  // Add the text to the screen
	titleScreen.addChild( titleText );
	}

/*
* menu button click handler functions
*/
/*
* Desc: Handles the event when the player clicks on the start button on the
*   main menu. Begins the game proper.
*/
function startButtonClickHandler( e )
	{

  // Remove the title screen from the stage
	stage.removeChild( titleScreen );
  // Add the container that holds the main game to the stage

	GameLoop();
	stage.addChild( gameScreen );
	stage.addChild( world );
	world.addChild( playerVis );
	gameRunning = true;

	renderer.backgroundColor = 0xffb18a;
	gameScreen.addChild( backButton );
	}

/*
* Desc: Handles the event when the player clicks on the tutorial button on
*   the main menu. Adds the tutorial container and removes the title menu
*   container :
*/
function tutorialButtonClickHandler( e )
	{

	stage.removeChild( titleScreen );
	stage.addChild( tutorialScreen );
	
	const tileSize = 34/2; 

  var tutorialText = new PIXI.Text( "Use 'a' and 'd' to move left and right\nUse 'w' to jump" );
	tutorialScreen.addChild( tutorialText );
  tutorialText.position.x = 400/4;
	tutorialText.position.y = 500/4;
	tutorialText.scale.x = 0.4; 
	tutorialText.scale.y = 0.4; 
	tutorialText.anchor.x = 0.5;
	tutorialText.anchor.y = 0.5;
	
	
	var background = new PIXI.Container(); 

		for( let x = 0; x < tileMap.height; x++ )
			{

			let tile = tileMap.tutorialTiles[ x ]; 
			let sprite = new PIXI.Sprite( tileSet[ tile - 1 ]); 
			
			sprite.anchor.x = 0.0; 
			sprite.anchor.y = 0.0; 
			
			sprite.x = (x * ( tileSize )); 
			sprite.y = 80; 
			sprite.scale.x = 0.5; 
			sprite.scale.y = 0.5; 
			background.addChild( sprite ); 
			
			}

	gameRunning = true; 
	renderer.backgroundColor = 0x7dadff;
  tutorialScreen.addChild( playerVis ); 
  tutorialScreen.addChild( backButton );
	tutorialScreen.addChild( background ); 
	
	}

/*
* Desc: Function that handles when the credits button is clicked on in th menu
*   It adds the credits container to the stage, removes the title container,
*   and populates the credits container
*/
function creditsButtonClickHandler( e )
	{

	stage.removeChild( titleScreen );
	stage.addChild( creditsScreen );
  var creditsText = new PIXI.Text( "Game was made by\nKellar ...\nAndrew Munoz\nJoshus Tenakhongva" );
  creditsText.position.x = 400/4;
	creditsText.position.y = 200/3;
	creditsText.scale.x = 0.5; 
	creditsText.scale.y - 0.5; 
  creditsText.position.x = 400;
	creditsText.position.y = 200;
	creditsText.anchor.x = 0.5;
	creditsText.anchor.y = 0.5;

	renderer.backgroundColor = 0xff759c;
  creditsScreen.addChild( creditsText );
	creditsScreen.addChild( backButton );
	}

/*
* Desc: When clicked, will bring the player back to the main menu.
*/
function backButtonClickHandler( e )
	{

	stage.addChild( titleScreen );
	stage.removeChild( playerVis );
	stage.removeChild( gameScreen );
	stage.removeChild( creditsScreen );
	stage.removeChild( tutorialScreen );
	stage.removeChild( world ); 
	gameRunning = false;
	renderer.backgroundColor = 0x6ac48a;
	}
/*
*	Moves the camera relative to the player's position
*/
/*
function update_camera() {
  stage.x = -player.x*GAME_SCALE + GAME_WIDTH/2 - player.width/2*GAME_SCALE;
  stage.y = -player.y*GAME_SCALE + GAME_HEIGHT/2 + player.height/2*GAME_SCALE;
  stage.x = -Math.max(0, Math.min(world.worldWidth*GAME_SCALE - GAME_WIDTH, -stage.x));
  stage.y = -Math.max(0, Math.min(world.worldHeight*GAME_SCALE - GAME_HEIGHT, -stage.y));
}
*/ 


function playerOnGround( posX, posY )
	{
		
	// Find the location of the tile the player is currently on
	var xTileLocation = Math.floor( posX / 34 ); 
	var yTileLocation = Math.floor( posY / 34 ); 
	
	// Find the tile index the player is on
	var tileLocation = yTileLocation * tileMap.width + xTileLocation; 
	
	// Find that tile's ID 
	var tileOn = tileMap.tiles[ tileLocation ]; 
	
	//Check to see if block to the right of the player is blocked
	if( tileMap.tiles[ tileLocation - 16 ] == RIGHT_SLOPE )
	{
		rightBlocked = true;
		console.log("right blocked\n");
	}
	else
	{
		rightBlocked = false;
	}
	
	//Check to see if block to the right of the player is blocked
	if( tileMap.tiles[ tileLocation - 16 ] == LEFT_SLOPE )
	{
		leftBlocked = true;
		console.log("left blocked\n");
	}
	else
	{
		leftBlocked = false;
	}
	
	// Check if the tile we're's ID is a solid platform 
	if( tileOn == FLAT_GROUND ||
			tileOn == RIGHT_SLOPE ||
			tileOn == LEFT_SLOPE || tileOn == BEDROCK)
		{
		
		return true; 
		}
	// Otherwise, we're in the air
	return false; 
	}
	
