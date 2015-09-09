var background, ground, base, cursors, gameObjects, staticObjects;
var gameObjectsCollisionGroup, staticObjectsCollisionGroup;

var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, '', {
    preload: function(){
        game.load.image('base', 'assets/base.png');
        game.load.image('story', 'assets/story.png');
        game.load.image('ground', 'assets/ground.png');
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
        var storyButton = this.game.add.button(window.innerWidth - 200, 10, 'smallbutton', dropStory);

        // Add first story
        dropStory();

        // Input
        cursors = game.input.keyboard.createCursorKeys();
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
    storyCollision: function(previousStory, currentStory){
        //dropStory();
    },
    animateCamera: function(){
        // Change target sprite for camera follow
    }
});

function dropStory() {
    var story = gameObjects.create(window.innerWidth / 2, 0, 'story');

}