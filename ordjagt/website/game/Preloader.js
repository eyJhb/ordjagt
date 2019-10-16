WU.Preloader = function(game) {};

WU.Preloader.prototype = {
    preload: function() {
        var baseURL = '/game/';

        // Add background and set loading graphic
        this.stage.backgroundColor = '#222222';
        this.add.sprite(0, 0, 'loading_bg');
        pl = this.add.sprite(0, 0, 'loading');
        this.load.setPreloadSprite(pl);
        
        // Screens and Buttons
        // this.load.image('background', baseURL + 'img/background.png');
        this.load.image('main_menu', baseURL + 'img/main_menu.png');
        this.load.image('how_to_play', baseURL + 'img/how_to_play.png');
        this.load.image('ui', baseURL + 'img/ui.png');
        this.load.image('game_over', baseURL + 'img/game_over.png');
        this.load.image('alpha', baseURL + 'img/alpha.png');
        this.load.image('button_word_up', baseURL + 'img/button_word_up.png');
        this.load.image('button_clear', baseURL + 'img/button_clear.png');

        this.load.image('blue_backgorund', '/images/bg-blue.jpg');
        
        // Letters
        this.load.image('a', baseURL + 'img/letters/a.png');
        this.load.image('b', baseURL + 'img/letters/b.png');
        this.load.image('c', baseURL + 'img/letters/c.png');
        this.load.image('d', baseURL + 'img/letters/d.png');
        this.load.image('e', baseURL + 'img/letters/e.png');
        this.load.image('f', baseURL + 'img/letters/f.png');
        this.load.image('g', baseURL + 'img/letters/g.png');
        this.load.image('h', baseURL + 'img/letters/h.png');
        this.load.image('i', baseURL + 'img/letters/i.png');
        this.load.image('j', baseURL + 'img/letters/j.png');
        this.load.image('k', baseURL + 'img/letters/k.png');
        this.load.image('l', baseURL + 'img/letters/l.png');
        this.load.image('m', baseURL + 'img/letters/m.png');
        this.load.image('n', baseURL + 'img/letters/n.png');
        this.load.image('o', baseURL + 'img/letters/o.png');
        this.load.image('p', baseURL + 'img/letters/p.png');
        this.load.image('q', baseURL + 'img/letters/q.png');
        this.load.image('r', baseURL + 'img/letters/r.png');
        this.load.image('s', baseURL + 'img/letters/s.png');
        this.load.image('t', baseURL + 'img/letters/t.png');
        this.load.image('u', baseURL + 'img/letters/u.png');
        this.load.image('v', baseURL + 'img/letters/v.png');
        this.load.image('w', baseURL + 'img/letters/w.png');
        this.load.image('x', baseURL + 'img/letters/x.png');
        this.load.image('y', baseURL + 'img/letters/y.png');
        this.load.image('z', baseURL + 'img/letters/z.png');
        this.load.image('æ', baseURL + 'img/letters/ae.png');
        this.load.image('ø', baseURL + 'img/letters/oe.png');
        this.load.image('å', baseURL + 'img/letters/aa.png');
        this.load.image('a_gold', baseURL + 'img/letters/a_gold.png');
        this.load.image('b_gold', baseURL + 'img/letters/b_gold.png');
        this.load.image('c_gold', baseURL + 'img/letters/c_gold.png');
        this.load.image('d_gold', baseURL + 'img/letters/d_gold.png');
        this.load.image('e_gold', baseURL + 'img/letters/e_gold.png');
        this.load.image('f_gold', baseURL + 'img/letters/f_gold.png');
        this.load.image('g_gold', baseURL + 'img/letters/g_gold.png');
        this.load.image('h_gold', baseURL + 'img/letters/h_gold.png');
        this.load.image('i_gold', baseURL + 'img/letters/i_gold.png');
        this.load.image('j_gold', baseURL + 'img/letters/j_gold.png');
        this.load.image('k_gold', baseURL + 'img/letters/k_gold.png');
        this.load.image('l_gold', baseURL + 'img/letters/l_gold.png');
        this.load.image('m_gold', baseURL + 'img/letters/m_gold.png');
        this.load.image('n_gold', baseURL + 'img/letters/n_gold.png');
        this.load.image('o_gold', baseURL + 'img/letters/o_gold.png');
        this.load.image('p_gold', baseURL + 'img/letters/p_gold.png');
        this.load.image('q_gold', baseURL + 'img/letters/q_gold.png');
        this.load.image('r_gold', baseURL + 'img/letters/r_gold.png');
        this.load.image('s_gold', baseURL + 'img/letters/s_gold.png');
        this.load.image('t_gold', baseURL + 'img/letters/t_gold.png');
        this.load.image('u_gold', baseURL + 'img/letters/u_gold.png');
        this.load.image('v_gold', baseURL + 'img/letters/v_gold.png');
        this.load.image('w_gold', baseURL + 'img/letters/w_gold.png');
        this.load.image('x_gold', baseURL + 'img/letters/x_gold.png');
        this.load.image('y_gold', baseURL + 'img/letters/y_gold.png');
        this.load.image('z_gold', baseURL + 'img/letters/z_gold.png');
        this.load.image('æ_gold', baseURL + 'img/letters/ae_gold.png');
        this.load.image('ø_gold', baseURL + 'img/letters/oe_gold.png');
        this.load.image('å_gold', baseURL + 'img/letters/aa_gold.png');
        
        // Audio
        this.load.audio('clear', [baseURL + 'audio/clear.mp3', baseURL + 'audio/clear.ogg']);
        this.load.audio('click', [baseURL + 'audio/click.mp3', baseURL + 'audio/click.ogg']);
        this.load.audio('clock', [baseURL + 'audio/clock.mp3', baseURL + 'audio/clock.ogg']);
        this.load.audio('error', [baseURL + 'audio/error.mp3', baseURL + 'audio/error.ogg']);
        this.load.audio('finish', [baseURL + 'audio/finish.mp3', baseURL + 'audio/finish.ogg']);
        this.load.audio('score1', [baseURL + 'audio/score1.mp3', baseURL + 'audio/score1.ogg']);
        this.load.audio('score2', [baseURL + 'audio/score2.mp3', baseURL + 'audio/score2.ogg']);
        this.load.audio('score3', [baseURL + 'audio/score3.mp3', baseURL + 'audio/score3.ogg']);
    },
    
    create: function() {
        // Start Main Menu
        //this.state.start('MainMenu');
        this.state.start('Game');
    }
};