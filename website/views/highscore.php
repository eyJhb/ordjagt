<div id="highscorePage">
    <img id="ordjagtLogo" src="/images/ordjagten_logo.png" />
    <div id="headline">
        HIGHSCORES
    </div>

    <div id="scores">
        <ol>
            {{range .Highscores}}
                <li>{{.Name}} - {{.Score}}</li>
            {{end}}
        </ol>
    </div>

    <input class="button" type="button" value="START SPIL" onclick="initPage('game')" />
    <input class="button" type="button" value="VEJLEDNING" onclick="initPage('tutorial1');" />
</div>
