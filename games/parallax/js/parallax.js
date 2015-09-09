var backgrounds = [];
var layer;
var player;
var NUMBER_OF_BACKGROUNDS = 7;
var DEBUG = true;
var BACKGROUND_SPEED = 0.3;
var FLOOR_HEIGHT = 64;

var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, '', {
    preload: function(){
        for (var i = 0; i < NUMBER_OF_BACKGROUNDS; i++){
            game.load.image('background' + i, 'assets/parallax' + i + '.png');
        }
        game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    },
    create: function() {
        this.game.stage.backgroundColor = '#FEDCC8';
        this.game.world.setBounds(0, 0, window.innerWidth, window.innerHeight - FLOOR_HEIGHT);

        var background;

        for (var i = 0; i < NUMBER_OF_BACKGROUNDS; i++) {
            background = this.game.add.tileSprite(0, window.innerHeight - 425 - FLOOR_HEIGHT, window.innerWidth, 490 - FLOOR_HEIGHT, 'background' + i);
            //background.tilePosition.y = window.innerHeight;
            backgrounds.push(background);
        }

        // PLAYER
        // Add player
        player = game.add.sprite(window.innerWidth / 2 - 16, game.world.height - 50, 'dude');
        game.physics.arcade.enable(player);

        player.body.bounce.y = 0.2;
        player.body.gravity.y = 400;
        player.body.collideWorldBounds = true;

        player.animations.add('left', [0, 1, 2, 3], 10, true);
        player.animations.add('right', [5, 6, 7, 8], 10, true);

        // CONTROLS
        cursors = game.input.keyboard.createCursorKeys();

        // Enable Debug
        if (DEBUG)
            game.add.plugin(Phaser.Plugin.Debug);
    },
    update: function(){
        var speed = 0;

        if (cursors.left.isDown) {
            speed = -BACKGROUND_SPEED;
            player.animations.play('left');
        } else if (cursors.right.isDown) {
            speed = BACKGROUND_SPEED;
            player.animations.play('right');
        } else {
            player.animations.stop();
            player.frame = 4;
        }

        for (var i = 0; i < backgrounds.length; i++) {
            backgrounds[i].tilePosition.x -= speed * i;
        }
    }
});