WU.MainMenu = function(game) {};

WU.MainMenu.prototype = {
    create: function() {
        // Add background and UI for Main Menu
        // this.add.sprite(0, 0, 'background');
        this.add.sprite(0, 0, 'main_menu');
        // Play Button
        var b_play = this.add.button(60, 410, 'alpha', this.playGame, this);
        b_play.width = 525;
        b_play.height = 145;
        b_play.input.useHandCursor = true;
    },
    playGame: function() {
        // Start Game
        this.state.start('Game');
    }
};