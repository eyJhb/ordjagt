window.onload = function() {
    
    var scrHeight = window.innerHeight;
    
    if(scrHeight > document.getElementById("outerFrame").offsetHeight) {
        document.getElementById("outerFrame").style.minHeight = 736 + "px";
    } else {
        document.getElementById("outerFrame").style.minHeight = scrHeight + "px";
    }
    
    if(document.getElementById("innerFrame").offsetHeight + document.getElementById("outerFooterFrame").offsetHeight < scrHeight) {
        document.getElementById("outerFooterFrame").style.position = "absolute";
        document.getElementById("outerFooterFrame").style.bottom = 0 + "px";
    } else {
        document.getElementById("outerFooterFrame").style.position = "static";
    }
    
    if(document.getElementById("frontpageSplash")) {
        document.getElementById("frontpageSplash").style.width =  document.getElementById("outerFooterFrame").offsetWidth + "px";
    }
    
    if(checkLocalStorage()) {
        /*
        if(!tutorial()) {
            localStorage.ordjagtTutorial = 1;
            initPage("tutorial1");
        } else {
            initPage("how_to_play");
        }
        */
        
        redirectTo();
        
    }
    
    //initPage("congrats");
    
}

window.onresize = function() {
    
    var scrHeight = window.innerHeight;
    
    if(scrHeight > document.getElementById("outerFrame").offsetHeight) {
        document.getElementById("outerFrame").style.minHeight = 736 + "px";
    } else {
        document.getElementById("outerFrame").style.minHeight = scrHeight + "px";
    }
    
    if(document.getElementById("innerFrame").offsetHeight + document.getElementById("outerFooterFrame").offsetHeight < scrHeight) {
        document.getElementById("outerFooterFrame").style.position = "absolute";
        document.getElementById("outerFooterFrame").style.bottom = 0 + "px";
    } else {
        document.getElementById("outerFooterFrame").style.position = "static";
    }
    
}

function redirectTo() {
    
    $.ajax({
        url: "/ajax/redirect_to.php?mobile=" + localStorage.ordjagtMobile,
        cache: false,
        beforeSend: function() {
            initLoader();
        }
    }).success(function(data) {
        var userinfo = JSON.parse(data);

        console.log(userinfo)
        console.log(typeof userinfo['error'])
        
        if( typeof userinfo['error'] != 'undefined' ) {
            // silently fail
            removeLoader();
            console.log("Silent fail")
        } else if( userinfo.tries_left == 3 ) {
            initPage("how_to_play");
            console.log("How to play")
        } else {
            console.log("What..")
            initPage("try_again");
        }
        
    });
    
}

function resizeWindow() {
    
    var scrHeight = window.innerHeight;
    
    if(scrHeight > document.getElementById("outerFrame").offsetHeight) {
        document.getElementById("outerFrame").style.minHeight = 736 + "px";
    } else {
        document.getElementById("outerFrame").style.minHeight = scrHeight + "px";
    }
    
    if(document.getElementById("innerFrame").offsetHeight + document.getElementById("outerFooterFrame").offsetHeight < document.getElementById("outerFrame").offsetHeight) {
        document.getElementById("outerFooterFrame").style.position = "absolute";
        document.getElementById("outerFooterFrame").style.bottom = 0 + "px";
    } else {
        document.getElementById("outerFooterFrame").style.position = "static";
    }
    
    if(document.getElementById("adIframe")) {
        
        var newHeight = document.getElementById("adIframe").contentWindow.document.body.scrollHeight;
        document.getElementById("adIframe").style.height = newHeight + 83 + "px";

    }
    
}

function checkLocalStorage() {
    
    if(localStorage.ordjagtMobile) {
        return true;
    } else {
        return false;
    }
    
}

function tutorial() {
    
    if(localStorage.ordjagtTutorial) {
        return true;
    } else {
        return false;
    }
    
}

function initLoader() {
    
    var scrHeight = window.innerHeight;
    
    if(document.getElementById("ajaxLoader")) {
        document.body.removeChild(document.getElementById("ajaxLoader"));
    }
    
    var ajaxLoader = document.createElement("DIV");
        
    ajaxLoader.id = "ajaxLoader";
    ajaxLoader.className = "ajaxLoader";
    
    document.body.appendChild(ajaxLoader);
    
    ajaxLoader.style.top = (scrHeight / 2) - (40 / 2) + document.body.scrollTop + "px";
    ajaxLoader.style.left = 50 + "%";
    ajaxLoader.style.marginLeft = -20 + "px";
    
    var cl = new CanvasLoader('ajaxLoader');
	cl.setColor('#FFFFFF');
	cl.setShape('spiral');
	cl.setDensity(52);
	cl.setRange(0.9);
	cl.show();
    
}

function removeLoader() {
    
    if(document.getElementById("ajaxLoader")) {
        document.body.removeChild(document.getElementById("ajaxLoader"));
    }
    
}

function initPopup(view) {
    
    var scrHeight = window.innerHeight;
    
    if(document.getElementById("popup")) {
        document.body.removeChild(document.getElementById("popup"));
    }
    
    var popup = document.createElement("DIV");
        
    popup.id = "popup";
    popup.className = "popup";
    
    document.body.appendChild(popup);
    
    document.getElementById("popup").style.width = document.getElementById("outerFrame").offsetWidth + "px";
    
    /*
    if(document.getElementById("outerFrame").offsetHeight <= scrHeight) {
        scrHeight = document.getElementById("outerFrame").offsetHeight;
    }
    */
    
    if(document.getElementById("outerFrame").offsetHeight >= scrHeight) {
        scrHeight = document.getElementById("outerFrame").offsetHeight;
    }
    
    
    document.getElementById("popup").style.height =  scrHeight + "px";
    document.getElementById("popup").style.top = 0 + "px";
    document.getElementById("popup").style.marginLeft = -(document.getElementById("popup").offsetWidth / 2) + "px";
    
    $.ajax({
        url: "/views/" + view + ".php",
        cache: false,
        beforeSend: function() {
            initLoader();
        }
    }).success(function(data) {
        
        removeLoader();
        document.getElementById("popup").innerHTML = data;
        
    });
    
}

function closePopup() {
    
    if(document.getElementById("popup")) {
        document.body.removeChild(document.getElementById("popup"));
    }
    
}

var currentPage = "";
var lastPage = "";
var pageHistory = [];

function initPage(view) {
    
    if(view == "game") {
        document.getElementById("outerFooterFrame").style.display = "none";
    }
        
    if(view == "back") {
        view = pageHistory.pop();

        if ( typeof view == 'undefined' ) {
            view = lastPage;
        };
        
    } else {
        if( ! currentPage.match(/^ad/) ) {
            // do not add ad pages to history
            pageHistory.push(currentPage);
        };

        lastPage = currentPage;
    }
    
    $("#innerFrame").animate({
        opacity: 0
    }, 500, function() {
        
        $.ajax({
            url: "/views/" + view + ".php?mobile=" + localStorage.ordjagtMobile,
            cache: false,
            beforeSend: function() {
                initLoader();
            }
        }).success(function(data) {
            
            if(!checkLocalStorage()) {
                if(view != "phonenumber" && view != "see_prices") {
                    initPage("phonenumber");
                }
            }
            
            removeLoader();
            document.getElementById("innerFrame").innerHTML = data;
            
            setTimeout(function() {
                resizeWindow();
            }, 500);
            
            $("#innerFrame").animate({
                opacity: 1
            }, 500, function() {
                
                if(view == "game") {
                    preloadGame();
                }
                
            });
            
            currentPage = view;
            
        });
        
    });
    
}

function toggleConditions(input, element) {
    
    var input = document.getElementById(input);
    
    if(input.value == 0) {
        input.value = 1;
        $(element).toggleClass("selected");
    } else {
        input.value = 0;
        $(element).toggleClass("selected");
    }
    
}

function validatePhoneForm() {
    
    var form = document.phoneForm;
    var message = "";
    var error = false;
    
    if(form.phone.value == "") {
        message += "Du skal udfylde mobiltelefonnummer\n";
        error = true;
    } else if(form.phone.value.length < 8) {
        message += "Mobiltelefonnummeret er ikke gyldigt\n";
        error = true;
    }
    
    if(form.acceptedConditions.value == 0) {
        message += "Du skal acceptere vilkårene\n";
        error = true;
    }
    
    if(error) {
        alert(message);
        return false;
    } else {
        return true;
    }
    
}

function submitPhoneForm() {
    if(validatePhoneForm()) {
        var form = document.phoneForm;
        
        initLoader();

        $.ajax({
            url: "/ajax/save_mobile.php?mobile=" + form.phone.value,
            cache: false
        }).success(function(data) {
            removeLoader();
            
            if ( data == "false" ) {
                alert('Mobiltelefonnummeret er ikke gyldigt');
                return;
            };
            
            localStorage.ordjagtMobile = form.phone.value;
                        
            initPage("how_to_play");
        });
    }
}

function validateSignupForm() {
    
    var form = document.signupForm;
    var message = "";
    var error = false;
    
    if(form.firstname.value == "") {
        message += "Du skal udfylde fornavn\n";
        error = true;
    }
    
    if(form.surname.value == "") {
        message += "Du skal udfylde efternavn\n";
        error = true;
    }
    
    if(form.email.value == "") {
        message += "Du skal udfylde e-mail\n";
        error = true;
    } else if(!isEmail(form.email.value)) {
        message += "E-mailen er ikke gyldig\n";
        error = true;
    }
    
    if(form.acceptedConditions.value == 0) {
        message += "Du skal acceptere vilkårene\n";
        error = true;
    }
    
    if(error) {
        alert(message);
        return false;
    } else {
        return true;
    }
    
}

function submitSignupForm() {
    
    if(localStorage.ordjagtRedirect) {
        localStorage.removeItem("ordjagtRedirect");
    }
    
    if(validateSignupForm()) {
        
        var form = document.signupForm;
        
        $.ajax({
            url: "/ajax/save_main_competition.php?mobile=" + form.mobile.value + "&firstname=" + form.firstname.value + "&surname=" + form.surname.value + "&email=" + form.email.value,
            cache: false,
            beforeSend: function() {
                initLoader();
            }
        }).success(function(data) {
            
            removeLoader();
            
            initPage("thank_you");
            
        });
        
    }
    
}

function isEmail(email){  
    
    if(email.search(/^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/) == -1) {
          return false;
    } else {
          return true;
    }
}

function isNumber(e) {
	
	if(e.keyCode) {
		var key = e.keyCode;
	} else if(e.charCode) {
		var key = e.charCode;
	}
	
	var character = String.fromCharCode(key);
	
	if(key == 8) {
		return true;
	} else if(character.search(/\d/) == -1) {
		return false;
	} else {
		return true;
	}
	
}

function blockMove() {
    event.preventDefault() ;
}

jQuery(function($) {
    $(document).on('click', '.tab-title', function(e) {
        var tab_title = $(e.currentTarget);
        var tab_id = tab_title.children('a:first').attr('href');
        var tab = $(tab_id + '.content');

        if ( tab.length < 1 ) {
            return;
        };

        e.preventDefault();

        tab_title.addClass('active').siblings('.active').removeClass('active');
        tab.addClass('active').siblings('.active').removeClass('active');
    });
});
