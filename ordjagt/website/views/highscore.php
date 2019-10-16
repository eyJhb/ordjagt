<div id="highscorePage">
    <div class="headline">
        HIGH SCORES
    </div>
    <div class="subtitle">
        TOP 10
    </div>

    <div id="scores">
        <ul class="tabs">
            <!--
            <li class="tab-title active"><a href="#test">test1</a></li>
            <li class="tab-title"><a href="#test2">test2</a></li>
            -->
        </ul>
        <div class="tabs-content">
            <div id="test" class="content active">
                <ol>
                    {{range .Highscores}}
                        <li>
                            <span class="left">{{.Name}}</span>
                            <span class="right">{{.Score}}</span>
                        </li>
                    {{end}}
                </ol>
            </div>
            <div id="test2" class="content">
                <ol>
                    {{range .Highscores}}
                        <li>
                            <span class="left">PREFIX - {{.Name}}</span>
                            <span class="right">{{.Score}}000</span>
                        </li>
                    {{end}}
                </ol>
            </div>
        </div>
    </div>

    <input class="button" type="button" value="LUK HIGHSCORE" onclick="initPage('try_again')" />
</div>
