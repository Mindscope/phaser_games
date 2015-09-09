var background, ground, base, cursors, gameObjects, storyPositionArrow;
var gameObjectsCollisionGroup, staticObjectsCollisionGroup;
var debugText;

var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, '', {
    preload: function(){
        game.load.image('base', 'assets/base.png');
        game.load.image('story', 'assets/story.png');
        game.load.image('ground', 'assets/ground.png');
        game.load.image('block', 'assets/block.png');
        game.load.image('arrow', 'assets/arrow.png');
    },
    create: function(){
        // Start physics
        game.physics.startSystem(Phaser.Physics.P2JS);
        game.physics.p2.setImpactEvents(true);
        game.physics.p2.gravity.y = 200;
        //game.physics.p2.restitution = 0.05;
        game.physics.p2.friction= 100;

        // Create Background
        var backgroundHeight = this.game.height * 5;
        var backgroundBitmap = this.game.add.bitmapData(this.game.width, backgroundHeight);
        var grd = backgroundBitmap.context.createLinearGradient(0, 0, 0, backgroundHeight);

        grd.addColorStop(0, "black");
        grd.addColorStop(0.3, "#00173B");
        grd.addColorStop(0.6, "#5477A3");
        grd.addColorStop(1, "#75CED6");

        backgroundBitmap.context.fillStyle = grd;
        backgroundBitmap.context.fillRect(0, 0, this.game.width, backgroundHeight);

        background = this.game.add.sprite(0, window.innerHeight - backgroundHeight, backgroundBitmap);

        // Create ground
        ground = this.game.add.tileSprite(0, window.innerHeight - 75, window.innerWidth, 150, 'ground');

        gameObjects = this.game.add.group();
        gameObjects.enableBody = true;
        gameObjects.physicsBodyType = Phaser.Physics.P2JS;

        // Create base
        base = gameObjects.create(window.innerWidth / 2, window.innerHeight - 135, 'base');
        base.body.static = true;

        //this.game.physics.p2.enable([gameObjects, staticObjects]);

        // Add buton to drop story
        var storyButton = this.game.add.button(window.innerWidth - 40, 10, 'block', nextMove);

        // Input
        cursors = game.input.keyboard.createCursorKeys();

        // DEBUG text
        debugText = this.game.add.text(16, 16, 'score: 0', { fontSize: '12px', fill: '#000' });

        // Add first story
        nextMove();
    },
    update: function(){
        // Move base
        if (cursors.left.isDown) {
            base.body.velocity.x = -150;
        } else if (cursors.right.isDown) {
            base.body.velocity.x = 150;
        } else {
            base.body.velocity.x = 0;
        }
    },
    animateCamera: function(){
        // Change target sprite for camera follow
    }
});

function nextMove() {
    var pos = Math.random() * (window.innerWidth - 230) + 75;
    var time = Phaser.Timer.SECOND * 2;

    storyPositionArrow = game.add.sprite(pos, 5, 'arrow');

    var tween = game.add.tween(storyPositionArrow);
    tween.to({ alpha: 0 }, time, Phaser.Easing.Quadratic.In);
    tween.onComplete.add(function () {
        console.log("Destroying arrow...");
        storyPositionArrow.destroy();
    });
    tween.start();

    game.time.events.add(time, dropStory, this, pos);
}

function dropStory(pos) {
    if (pos == undefined)
        pos = Math.random() * (window.innerWidth - 230) + 75;

    debugText.text = "xPos: " + pos;

    var story = gameObjects.create(pos, 0, 'story');
}