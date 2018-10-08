<div id="afterGame" class="tryAgain">
    <!--
    <img id="arrowLeft" class="arrows faded" src="/images/arrow_left.png" />
    <img id="arrowRight" class="arrows" src="/images/arrow_right.png" onclick="ga('send', 'event', 'Ads', 'View', 'Ad1'); initPage('ad1');" />
    -->
    <div id="headline" class="noMargin">
        TAK FOR SPILLET!
    </div>
    <div class="subtitle">
        Din score er
        <em>{{.Score}}</em>
    </div>
    
    <div id="prices">
        Personlig rekord: <em>{{.PersonalRecord}}</em><br>
            </div>

            <div id="noticeMedium">
            Forsøg tilbage i dag: <em>{{.TriesLeft}}</em>
        </div>
        <input class="largeButton" type="button" value="SPIL IGEN" onclick="initPage('game');" />
        {{if .ShowSignup}}
        <input class="button smallText" type="button" value="TILMELD DIG KONKURRENCEN" onclick="initPage('signup');" />
        {{end}}
        <input class="button smallText withMargin" type="button" value="SE HIGHSCORE (TOP 10)" onclick="initPage('highscore');" />
    <!--
    <div id="seePrices" onclick="initPage('see_prices');">
        SE PRÆMIER HER
    </div>
    -->
</div>
