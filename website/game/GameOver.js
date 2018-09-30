WU.GameOver = function(game) {};

WU.GameOver.prototype = {
    create: function() {
        
        /*
        // Set background and game over graphic
        // this.add.sprite(0, 0, 'background');
        this.add.sprite(0, 0, 'game_over');
        // Play Again button
        var b_play_again = this.add.button(65, 765, 'alpha', this.playGame, this);
        b_play_again.width = 510;
        b_play_again.height = 130;
        b_play_again.input.useHandCursor = true;
        
        // Text
        var t_go_score = this.add.text(0, 170, " \n" + score.toString(), { font: '80px ' + t_font, fill: '#ffffff', align: 'center' });
        t_go_score.x = this.game.width / 2 - t_go_score._width / 2;
        t_go_score.setShadow(1, 2, 'rgba(0,0,0,1)', 3);
        var t_letters_used = this.add.text(0, 430, " \n" + letterCount.toString(), { font: '60px ' + t_font, fill: '#ffffff', align: 'center' });
        t_letters_used.x = this.game.width / 2 - t_letters_used._width / 2;
        t_letters_used.setShadow(1, 2, 'rgba(0,0,0,1)', 3);
        
        var personal_best = localStorage.getItem('pb');
        if (personal_best == null) {
            personal_best = 0;
        } else {
            personal_best = parseInt(personal_best);
        }
        var pb_text = "Personlig Rekord\n" + personal_best.toString();
        var pb_size = '40px';
        if (score > personal_best) {
            localStorage.setItem('pb', score.toString());
            pb_text = 'NY PERSONLIG REKORD!';
            pb_size = '40px';
        }
        var t_personal_best = this.add.text(0, 610, pb_text, { font: pb_size + ' ' + t_font, fill: '#ffffff', align: 'center' });
        t_personal_best.x = this.game.width / 2 - t_personal_best._width / 2;
        t_personal_best.setShadow(1, 2, 'rgba(0,0,0,1)', 3);
        */
        
    },
    playGame: function() {
        // Play Game Again
        this.state.start('Game');
    }
};