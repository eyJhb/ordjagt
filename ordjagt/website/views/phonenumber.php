<div id="phonenumber">
    <img id="ordjagtLogo" src="/images/ordjagten_logo.png" />
    <div class="bold">
        Tilmeld dig spillet ved at indtaste dit telefonnummer.
    </div>
    <div class="book">
        Nummeret benyttes kun til sms, hvis du har vundet.
    </div>
    <form id="phoneForm" name="phoneForm">
        <input type="text" name="phone" placeholder="Mobiltelefonnummer" onkeypress="return isNumber(event);" maxlength="8" pattern="[0-9]*" />
        <input id="acceptedConditions" name="acceptedConditions" value="0" type="hidden" />
        <div class="checkbox" id="phoneCheckbox" onclick="toggleConditions('acceptedConditions', this);"></div>
        <div id="phoneConditions">Acceptér <a href="#" onclick="initPopup('phone_conditions');">vilkår</a></div>
        <div style="clear: both;"></div>
        <input class="button" type="button" value="LOG IND" onclick="submitPhoneForm();" />
    </form>
    <div id="seePrices" onclick="initPage('see_prices');">
        SE PRÆMIER HER
    </div>
</div>