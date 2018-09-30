var WU = {};

WU.Boot = function(game) {};

WU.Boot.prototype = {
    
    preload: function() {
        
        var scrHeight = window.innerHeight;
        //var scrWidth = window.innerWidth;
        //var ratio = scrHeight / scrWidth;
        
        if(scrHeight < 420) {
            $("#game").css("width", 220);
            $("#game").css("margin", "0 auto");
        } else {
            $("canvas").css("width", document.getElementById("game").offsetWidth);
            $("canvas").css("height", document.getElementById("game").offsetHeight);
        }
        
        //$("canvas").css("width", 100);
        
        // Load preloading image
        this.load.image('loading_bg', '/game/img/loading_bg.png');
        this.load.image('loading', '/game/img/loading.png');
    },
    create: function() {
        
        // Set scaling/pointer options
        this.input.maxPointers = 1;
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        
        //this.scale.pageAlignHorizontally = true;
        //this.scale.pageAlignVertically = true;
        
        this.scale.setShowAll();
        //this.scale.refresh(); //Not used in Phaser v2.2.2
        
        // Start preloader
        this.state.start('Preloader');
    }
};