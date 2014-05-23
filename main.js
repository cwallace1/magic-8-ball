$(document).ready(function(){
    watchIt();
    letterizeIt(null);
});
var chooseOne = function() {
    var wantSome = randoms();
    $("#fateText").text("");
    waitingTime(wantSome);
},
    waitingTime = function(digits) {
        var chileConQueso = choiced(digits);
        grabbingOn(chileConQueso);
        shakeThemUp();
        $("#fate").fadeIn(2000);
        watchIt();
    },
    inputz,
    goingOut = function() {
        $("#fate").fadeOut(1000, "linear", setTimeout(chooseOne, 2000));
    },
    randoms = function(){
        var numbre = Math.floor(Math.random()*14)+1;
        return numbre;
    },
    choiced = function(numbre) {
        var bango = "choice"+numbre;
        return bango;
    },
    grabbingOn = function(whatWhat){
        fetchData = new Firebase('https://amber-fire-3354.firebaseio.com/'+whatWhat);
        fetchData.once("value", function(whatWhat) {
            var quesoDip = whatWhat.val();
            $("#fateText").text(quesoDip);
        });
    },
    shakeThemUp = function() {
        $("#container").toggleClass("shakeIt");
        $("#fate").toggleClass("inverseShakeIt");
    },
    watchIt = function() {
        $(document).unbind("keypress");
        $(document).on("keypress", function(e){
            var inputz = $("#quest").val();
            if (e.which === 13 && inputz === "") {
                $("#splash").text("Try Asking Me A Question This Time!");
                letterizeIt(null);
            }
            else if (e.which === 13 && inputz !== "") {
                questionCounter++;
                shakeThemUp();
                goingOut();
                $("#splash").text(inputz);
                letterizeIt(inputz);
                $("#quest").val("");
            }
        });
    },
    postIt = function (question){
        var postData = new Firebase('https://amber-fire-3354.firebaseio.com/questionLog/'+generateGUID+"/"+questionCounter);
        postData.set(question);
    },
    letterizeIt = function(question) {
        $("h3").lettering();
        var spacing = 4,
        smallLetters = 1;
        if (question !== null) {
            postIt(question);
        }
        var letterCount = document.getElementsByTagName('span').length,
            maxLetter = Math.ceil(letterCount/2);
        if (letterCount>90 && letterCount<181) {
            smallLetters = 2;
            spacing = 2;
        }
        else if (letterCount>180 && letterCount<361) {
            smallLetters = 3;
            spacing = 1;
        }
        else if (letterCount>360) {
            $("h3").text("Nope, That's Too Many Characters For You.");
            letterizeIt(null);
            return;
        }
        for (i=0; i<letterCount; i++) {
            var currentCount = i+1,
                degreeTurn = (currentCount - maxLetter)*spacing,
                currentChar = "char"+currentCount;
            if (smallLetters === 2){
                $("."+currentChar).attr("style", "-ms-transform: rotate("+degreeTurn+"deg); -webkit-transform: rotate("+degreeTurn+"deg); transform: rotate("+degreeTurn+"deg); font-size: 18px");
            }
            else if (smallLetters === 3) {
                $("."+currentChar).attr("style", "-ms-transform: rotate("+degreeTurn+"deg); -webkit-transform: rotate("+degreeTurn+"deg); transform: rotate("+degreeTurn+"deg); font-size: 12px");
            }
            else {
                $("."+currentChar).attr("style", "-ms-transform: rotate("+degreeTurn+"deg); -webkit-transform: rotate("+degreeTurn+"deg); transform: rotate("+degreeTurn+"deg);");
            }
        }
    },
    questionCounter = 0,
    generateGUID = Math.floor((100000000000 + Math.random()) * 0x10000).toString(16);