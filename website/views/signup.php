<div id="signup">
    <img id="formImage" src="/images/ordjagten_logo.png" />
    <div id="headline">
        Tilmeld dig konkurrencen
    </div>
    <form name="signupForm" id="signupForm">
        <input type="hidden" name="mobile" value="{{.Mobile}}"/>
        <input type="text" placeholder="Fornavn" name="firstname"/>
        <input type="text" placeholder="Efternavn" name="surname"/>
        <input type="text" placeholder="E-mail" name="email"/>
        <div id="signupConditions">
            <input type="checkbox" class="checkbox" value="1" name="acceptedConditions" checked/>
            Accepterer du disse betingelser der ikke er <a href="#ikkeher">her</a>?
        </div>
        <input class="button" type="button" value="TILMELD" onclick="submitSignupForm()" />
    <input class="button" type="button" value="TILBAGE" onclick="initPage('try_again')" />
    </form>
</div>
