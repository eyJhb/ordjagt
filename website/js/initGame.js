// Stage switchers
// Disable Phaser's pause-on-blur
Phaser.Stage.prototype.visibilityChange = $.noop;

// JS salt
var _$_77d1=["\x59\x41\x57\x6A\x66\x77\x59\x43\x39\x68\x6E\x35\x57\x52","\x66\x45\x53\x35\x58\x5B\x65\x4B","\x67\x77\x25\x53\x2C\x61\x4C\x78\x2A\x25\x67\x48","\x2A\x49\x2B\x7A\x77\x39","\x2A\x72\x57\x7E\x3D\x57\x42\x7D\x43\x23\x2E\x23\x21\x34\x3B\x4E\x4F\x26\x23\x35\x59\x2B\x34\x2B\x4C\x62\x49\x37\x28\x35\x76\x5B\x7B\x3B\x74\x40\x79\x56\x43\x4D\x6E\x35\x2C\x39\x36\x6E\x72\x61\x5F\x21\x71\x39\x3F\x65\x47\x62\x74\x52"]
var _$_c77b=[_$_77d1[0],_$_77d1[1],_$_77d1[2],_$_77d1[3],_$_77d1[4]]

function preloadGame() {
	
	var js_salt=_$_c77b[0]+[_$_c77b[1],_$_c77b[2],_$_c77b[3]][2]+_$_c77b[4];
    
    $(function() {
        
        var game = new Phaser.Game(640, 960, Phaser.AUTO, 'game', null, true);
        var guessed_words = [];
        var game_seed = $('#game').data('seed');
        
	    WU.Game.prototype.onCorrectWord = function ( word, score ) {
			var security_hash = CryptoJS.SHA1( word + score + game_seed + js_salt );
			guessed_words.push({
				w: word,
				s: score,
				sh: security_hash.toString(CryptoJS.enc.Hex)
			});
	    };

	    WU.Game.prototype.onGameStart = function () {
			
			$('#outerFrame').addClass('blue-background');
			
			document.body.ontouchmove = function() {
    			blockMove();
			}
			
	    };

	    WU.Game.prototype.onGameOver = function (score, letters_used) {
			var post_url = '/ajax/game_over.php';
			var security_hash = CryptoJS.SHA1( localStorage.ordjagtMobile + score + guessed_words.length + game_seed + js_salt );
    	    
    	    document.body.ontouchmove = function() {}
    	    
    	    $('#outerFrame').removeClass("blue-background")
    	    document.getElementById("outerFooterFrame").style.display = "block";

    	    $.ajax({
                url: post_url,
                method: 'POST',
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify({
					mobile: localStorage.ordjagtMobile,
					score: score,
					w: guessed_words,
					sd: game_seed,
					sh: security_hash.toString(CryptoJS.enc.Hex)
                }),
                cache: false
            }).success(function(data) {
                console.log(data);
                initPage(data["page"]);
            });
    	    
	    };
        
	    game.state.add('Boot', WU.Boot);
	    game.state.add('Preloader', WU.Preloader);
	    //game.state.add('MainMenu', WU.MainMenu);
	    //game.state.add('HowToPlay', WU.HowToPlay);
	    game.state.add('Game', WU.Game);
	    game.state.add('GameOver', WU.GameOver);
	    game.state.start('Boot');
	});	
};
