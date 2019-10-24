var gameport = document.getElementById( "gameport" );
var renderer = PIXI.autoDetectRenderer({ width: 800, height: 600, backgroundColor: 0x6ac48a });

gameport.appendChild( renderer.view );

/* 
Different containers for different menus
*/ 
var stage = new PIXI.Container();

var titleScreen = new PIXI.Container(); 
var gameScreen = new PIXI.Container(); 
var creditsScreen = new PIXI.Container(); 
var tutorialScreen = new PIXI.Container(); 

stage.addChild( titleScreen ); 

var	player = {//player's metadata
		x: 200,
		y: 100,
		speed: 3,
		xVel: 0,
		yVel: 0,
		onGround: false,
		isJumping: false		
	};

function animate()
	{
	requestAnimationFrame( animate );
	renderer.render( stage ); 
	}
	


animate(); 