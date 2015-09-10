var background, ground, base, cursors, gameObjects, storyPositionArrow, currentStory;
var gameObjectsCollisionGroup, staticObjectsCollisionGroup;
var debugText;

var FRICTION = 150;
var GRAVITY = 200;
var BASE_SPEED = 250;

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
        game.physics.p2.gravity.y = GRAVITY;
        game.physics.p2.restitution = 0;
        game.physics.p2.friction = FRICTION;

        gameObjectsCollisionGroup = game.physics.p2.createCollisionGroup();
        staticObjectsCollisionGroup = game.physics.p2.createCollisionGroup();

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

        // Create gameObjects group
        gameObjects = this.game.add.group();
        gameObjects.enableBody = true;
        gameObjects.physicsBodyType = Phaser.Physics.P2JS;

        // Create base
        base = gameObjects.create(window.innerWidth / 2, window.innerHeight - 135, 'base');
        game.physics.p2.enable(base, false);
        base.body.landed = true;
        base.body.setRectangle(199, 122);
        base.body.static = true;
        base.body.setCollisionGroup(gameObjectsCollisionGroup);
        base.body.collides(staticObjectsCollisionGroup);

        // Add buton to drop story
        this.game.add.button(window.innerWidth - 40, 10, 'block', nextMove);

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
            base.body.velocity.x = -BASE_SPEED;
        } else if (cursors.right.isDown) {
            base.body.velocity.x = BASE_SPEED;
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

    // Animate arrow and destroy it on animation end
    var tween = game.add.tween(storyPositionArrow);
    tween.to({ alpha: 0 }, time, Phaser.Easing.Quadratic.In);
    tween.onComplete.add(function () {
        storyPositionArrow.destroy();
    });
    tween.start();

    game.time.events.add(time, dropStory, this, pos);
}

function dropStory(pos) {
    if (pos == undefined)
        pos = Math.random() * (window.innerWidth - 230) + 75;

    debugText.text = "xPos: " + pos;

    currentStory = gameObjects.create(pos, 0, 'story');
    game.physics.p2.enable(currentStory, false);

    currentStory.body.data.gravityScale = 15;
    currentStory.body.setRectangle(153, 66);
    currentStory.body.setCollisionGroup(staticObjectsCollisionGroup);
    //currentStory.body.collides([staticObjectsCollisionGroup, gameObjectsCollisionGroup], storyCollision, this);
    currentStory.body.collides([staticObjectsCollisionGroup, gameObjectsCollisionGroup]);
    //currentStory.body.onBeginContact.add(storyCollision, currentStory);

    game.physics.p2.updateBoundsCollisionGroup();
}

/**
 *
 *
 * @param obj1
 * @param obj2
 */
function storyCollision(target) {
    if (target == null) return;

    console.log(target);

    if (target.sprite.key == "base" || target.sprite.key == "story") {
        this.body.onBeginContact.remove(storyCollision);

        nextMove();
    }
}