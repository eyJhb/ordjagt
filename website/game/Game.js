WU.Game = function(game) {};

WU.Game.prototype = {

    // PHASER CREATE
    create: function() {
        
        // CONFIG
        ///////////////////////////////////////////////////////////////////////
        
        // Chance for gold letter (out of 100)
        goldLetterChance = 10;
        
        // How much each gold letter used in a word multiplies the final word score by
        goldLetterBonus = 1.5;
        
        // Game time (in seconds)
        // gameTime = 120;
        gameTime = 4;
        
        // Time penalty for invalid word (in seconds)
        timePenalty = 10;
        
        // Letter score value
        letterScoreValue = 10;
        
        // Word Length Bonus
        //  How much each letter (after 3) multiplies the final word score by
        //
        //  Minimum word length is 3 letters. No bonus is applied. For each letter after 3, this bonus is applied to
        //  the final word score.
        wordLengthBonus = 1;
        
        // Letter Frequency (needs to add up to 100, no decimals)
        //  See real world values here:
        //      http://www.math.cornell.edu/~mec/2003-2004/cryptography/subs/frequencies.html
        letterFreq = {
            'e': 7,
            't': 6,
            'a': 6,
            'o': 6,
            'i': 6,
            'n': 5,
            's': 5,
            'r': 5,
            'h': 5,
            'd': 5,
            'l': 4,
            'u': 4,
            'c': 4,
            'm': 4,
            'f': 3,
            'y': 3,
            'w': 3,
            'g': 3,
            'p': 3,
            'b': 2,
            'v': 2,
            'k': 2,
            'x': 2,
            'q': 2,
            'j': 2,
            'z': 1,
            'æ': 3,
            'ø': 3,
            'å': 3
        };
        
        // Word Score Notifications Levels
        //  3 levels of notification (changes text notification color, and sound played)
        
        wordScoreNotificationLevels = {
            'l1': {'min': 0, 'max': 199, 'color': '#999999', 'shadow': '0,0,0,1', 'sound': 'score1'},
            'l2': {'min': 200, 'max': 499, 'color': '#ffffff', 'shadow': '0,128,128,1', 'sound': 'score2'},
            'l3': {'min': 500, 'max': 999999999, 'color': '#ffff00', 'shadow': '255,255,255,1', 'sound': 'score3'}
        }

        ///////////////////////////////////////////////////////////////////////

        
        // Letter Grid and Spacing
        gridStart = 12;
        gridX = 5;
        gridY = 5;
        spacingX = 125;
        spacingY = 129;
        
        // Runtimes
        f = 0;
        score = 99999;
        currentWord = '';
        currentGold = 0;
        letterCount = 0;
        clockTicking = false;
        
        // UI
        // this.add.sprite(0, 0, 'background');
        this.add.sprite(0, 0, 'ui');
        
        // Init Sprites and Audio
        letters = new Array();
        sounds = new Array();
        sounds['clear'] = this.add.audio('clear');
        sounds['click'] = this.add.audio('click');
        sounds['clock'] = this.add.audio('clock');
        sounds['error'] = this.add.audio('error');
        sounds['finish'] = this.add.audio('finish');
        sounds['score1'] = this.add.audio('score1');
        sounds['score2'] = this.add.audio('score2');
        sounds['score3'] = this.add.audio('score3');
        
        // Buttons
        b_word_up = this.add.button(12, 749, 'button_word_up', this.wordUp, this);
        b_word_up.input.useHandCursor = true;
        b_word_up.alpha = .5;
        var b_clear = this.add.button(512, 749, 'button_clear', this.clearWord, this);
        b_clear.input.useHandCursor = true;       

        // Text
        t_font = '"Lucida Console", Monaco, monospace';
        t_word = this.add.text(12, 666, currentWord, { font: '64px ' + t_font, fill: '#231f20' });
        t_word.setShadow(0, 1, 'rgba(0,0,0,1)', 1);
        t_game_time = this.add.text(480, 890, this.formatGameTime(), { font: '62px ' + t_font, fill: '#FFFFFF' });
        t_game_time.setShadow(0, 1, 'rgba(0,0,0,1)', 1);
        t_score = this.add.text(12, 886, 'POINT: ' + score.toString(), { font: '32px ' + t_font, fill: '#FFFFFF' });
        t_score.setShadow(0, 1, 'rgba(0,0,0,1)', 1);
        //t_letter_count = this.add.text(12, 920, 'BOGSTAVER BRUGT: ' + letterCount.toString(), { font: '32px ' + t_font, fill: '#FFFFFF' });
        //t_letter_count.setShadow(0, 1, 'rgba(0,0,0,1)', 1);
        t_penalty = this.add.text(110, 890, '-' + timePenalty.toString(), { font: '62px ' + t_font, fill: '#ff0000' });
        t_penalty.initY = 890;
        t_penalty.setShadow(0, 1, 'rgba(0,0,0,1)', 1);
        t_penalty.alpha = 0;
        t_word_score = this.add.text(12, 666, '', { font: '64px ' + t_font, fill: '#dddddd', align: 'center' });
        t_word_score.initY = 666;
        t_word_score.setShadow(0, 0, 'rgba(0,0,0,1)', 20);
        t_word_score.alpha = 0;
        
        // Game Timer
        this.time.events.loop(Phaser.Timer.SECOND, this.updateGameTime, this);
        
        // Build first grid
        this.newGrid();

         this.onGameStart();
    },
    
    // PHASER UPDATE
    update: function() {
    
        // Inc frame
        f += 1;
        
        // Update text values
        t_word.text = currentWord.toUpperCase();
        this.centerWordText();
        t_game_time.text = this.formatGameTime();
        t_score.text = 'POINT: ' + score.toString();
        //t_letter_count.text = 'BOGSTAVER BRUGT: ' + letterCount.toString();
        
        // Time Ticker
        if (gameTime <= 10 && !clockTicking) {
            sounds['clock'].play('', 0, 1, true);
            clockTicking = true;
        }
        
        // Game Over
        if (gameTime <= 0) {
            sounds['finish'].play();
            sounds['clock'].stop();
            this.state.start('GameOver');
            this.onGameOver(score, letterCount);
        }
        
        // Penalty text
        if (t_penalty.alpha > 0.02) {
            t_penalty.parent.bringToTop(t_penalty);
            t_penalty.alpha -= .01;
            t_penalty.y -= 2;
        } else {
            t_penalty.y = -999;
        }
        
        
        // Word score text
        if (t_word_score.alpha > 0.02) {
            t_word_score.parent.bringToTop(t_word_score);
            t_word_score.alpha -= .01;
            t_word_score.y -= 5;
        } else {
            t_word_score.y = -999;
        }
    },
    
    letterClick: function(l) {
        if (l.alpha < 1) {
            return false;
        }
        sounds['click'].play();
        currentWord += l.letter;
        if (l.gold) {
            currentGold += 1;
        }
        l.alpha = .5;

        if ( currentWord.length >= 3 ) {
            b_word_up.alpha = 1;
        };
    },
    
    // Word submit
    wordUp: function() {
        // Get word length
        var len = currentWord.length;
        if (len < 3) {
            return false;
        }
        var s = 'l' + len.toString();
        if (len > 15) {
            s = 'l15';
        }
        // Verify valid word
        var valid = false;
        for (var i = 0, l = words[s].length; i < l; i++) {
            if (currentWord == words[s][i]) {
                valid = true;
                break;
            }
        }
        // Invalid word
        if (!valid) {
            sounds['error'].play();
            score -= timePenalty;
            t_penalty.alpha = 1;
            t_penalty.y = t_penalty.initY;
            this.newGrid();
            return false;
        }
        // Update letter count
        letterCount += len;
        // Calculate word score
        var word_score = len * letterScoreValue;
        if (len > 3) {
            for (var i = 0; i < len - 3; i++) {
                word_score *= wordLengthBonus;
            }
        }
        if (currentGold > 0) {
            for (var i = 0; i < currentGold; i++) {
                word_score *= goldLetterBonus;
            }
        }

        this.onCorrectWord(currentWord, Math.round(word_score));

        // Sound & Notify Text
        for (var i in wordScoreNotificationLevels) {
            var w = wordScoreNotificationLevels[i];
            var n_color, n_shadow, n_sound;
            if (word_score >= w['min'] && word_score <= w['max']) {
                n_color = w['color'];
                n_shadow = w['shadow'];
                n_sound = w['sound'];
            }
        }
        sounds[n_sound].play();
        t_word_score.alpha = 1;
        t_word_score.y = t_word_score.initY;
        t_word_score.fill = n_color;
        t_word_score.text = currentWord + "\n" + "+" + Math.round(word_score).toString();
        t_word_score.setShadow(0, 0, 'rgba(' + n_shadow + ')', 20);
        this.centerWordScoreText();
        // Update score
        score += Math.round(word_score);
        this.newGrid();
    },
    
    // Clear the word in progress
    clearWord: function() {
        sounds['clear'].play();
        currentWord = '';
        currentGold = 0;
        for (var i = 0, l = letters.length; i < l; i++) {
            letters[i].alpha = 1;
        }

        b_word_up.alpha = 0.5;
    },
    
    // New Letter Grid
    newGrid: function() {
        // Destroy current grid
        for (var i = 0, l = letters.length; i < l; i++) {
            letters[i].kill();
        }
        currentWord = '';
        currentGold = 0;
        letters = new Array();
        // Get a random word from the word list
        //  (Skipping list 15 in case a word is longer than gridX * gridY)
        var list_select = 'l' + this.randomInt(3, 14).toString();
        var word_select = words[list_select][this.randomInt(0, words[list_select].length - 1)];
        word_select = word_select.replace(/['\/!\- \.\\]/g, '');
        var letter_array = word_select.split('');
        // Generate random letters
        for (var i = 0, l = gridX * gridY - letter_array.length; i < l; i++) {
            var rl = this.randomInt(1, 109);
            var jc = 0;
            for (var j in letterFreq) {
                jc += letterFreq[j];
                if (rl <= jc) {
                    letter_array.push(j);
                    break;
                }
            }
        }
        // Shuffle letters
        var letter_array_shuffled = this.arrayShuffle(letter_array);
        var has_gold_letter = false;
        // Build letter sprites
        for (var i = 0, l = letter_array_shuffled.length; i < l; i++) {
            var j = letter_array_shuffled[i];
            // Random gold letter
            var rgl = this.randomInt(1, 100);
            // Force having a golden letter
            if ( ! has_gold_letter && i == Math.round(l / 2) ) {
                rgl = goldLetterChance;
            };

            // Generate letter sprite
            var letter;
            if (rgl <= goldLetterChance) {
                letter = this.add.sprite(-999, -999, j + '_gold');
                letter.gold = true;
                has_gold_letter = true;
            } else {
                letter = this.add.sprite(-999, -999, j);
                letter.gold = false;
            }
            letter.letter = j;
            // Set input handling (clicks/touches)
            letter.inputEnabled = true;
            letter.input.useHandCursor = true;       
            letter.events.onInputDown.add(this.letterClick, this);
            letters.push(letter);        
        }
        // Arrange letter grid
        var lc = 0;
        var lx = gridStart;
        var ly = gridStart;
        for (var y = 0; y < gridY; y++) {
            for (var x = 0; x < gridX; x++) {
                letters[lc].x = lx;
                letters[lc].y = ly;
                lx += spacingX;
                lc++;
            }
            lx = gridStart;
            ly += spacingY;
        }

        b_word_up.alpha = 0.5;
    },
    
    updateGameTime: function() {
        gameTime -= 1;
    },
    
    centerWordText: function() {
        t_word.x = this.game.width / 2 - t_word.width / 2;
    },
    
    centerWordScoreText: function() {
        t_word_score.x = this.game.width / 2 - t_word_score.width / 2;
    },
    
    formatGameTime: function() {
        var minutes = Math.floor(gameTime/60);
        var seconds = gameTime % 60;
        var seconds_pad = '';
        if (seconds < 10) {
            seconds_pad = '0';
        }
        var time = minutes.toString() + ':' + seconds_pad + seconds.toString();
        return time;
    },
    
    // Random Integer Helper
    randomInt: function(min, max) {
        var r = Math.random();
        var ri = Math.floor(r * (max - min + 1) + min);
        return ri;    
    },
    
    arrayShuffle: function(o) {
        for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
    },

    onGameStart: function() {
        // pass
    },

    onGameOver: function() {
        // pass
    },

    onCorrectWord: function() {
        // pass
    }

};
