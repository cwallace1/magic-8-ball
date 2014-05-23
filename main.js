//lets kick this all off!
$(document).ready(function(){
    watchIt();
    letterizeIt(null);
});

//watch for those buttons!
var watchIt = function() {
        $(document).unbind("keypress");
        $("a").unbind("mousedown");
        $(document).on("keypress", function(e){
            var inputz = $("#quest").val();
            if (e.which === 13 && inputz === "") {
                tryAgain();
            }
            else if (e.which === 13 && inputz !== "") {
                doItAll(inputz);
            }
        });
        $("a").on("mousedown", function() {
            var inputz = $("#quest").val();
            if (inputz === "") {
                tryAgain();
            }
            else if (inputz !== "") {
                doItAll(inputz);
            }
        });
    },
//this makes them try again if
//nothing entered into field
    tryAgain = function() {
        $("#splash").text("Try Asking Me A Question This Time!");
        letterizeIt(null);
    },
//this does it all when enter
//or button is clicked
    doItAll = function(dataz) {
        questionCounter++;
        shakeThemUp();
        goingOut();
        $("#splash").text(dataz);
        letterizeIt(dataz);
        $("#quest").val("");
    },

//this is where the circular question
//magic happens
    letterizeIt = function(question) {
        $("h3").lettering();
        var spacing = 4,
        smallLetters = 1;
        if (question !== null) {
            postIt(question);
        }
        var letterCount = document.getElementsByTagName('span').length,
            maxLetter = Math.ceil(letterCount/2);

//this block checks for question length
//and sets variables appropriately
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

//loop through them individual letters!
//do it!
        for (i=0; i<letterCount; i++) {
            var currentCount = i+1,
                degreeTurn = (currentCount - maxLetter)*spacing,
                currentChar = "char"+currentCount,
                stylingBlock = "-ms-transform: rotate("+degreeTurn+"deg); -webkit-transform: rotate("+degreeTurn+"deg); transform: rotate("+degreeTurn+"deg);";
            if (smallLetters === 2){
                $("."+currentChar).attr("style", stylingBlock+" font-size: 18px");
            }
            else if (smallLetters === 3) {
                $("."+currentChar).attr("style", stylingBlock+" font-size: 12px");
            }
            else {
                $("."+currentChar).attr("style", stylingBlock);
            }
        }
    },

//this toggles some shake magic!
    shakeThemUp = function() {
        $("#container").toggleClass("shakeIt");
        $("#fate").toggleClass("inverseShakeIt");
    },

//this one is for fading out the previous
//response and starting the choice
    goingOut = function() {
        $("#fate").fadeOut(1000, "linear", setTimeout(chooseOne, 2000));
    },

//so this guy is going to generate
//a random number and pick a response
    chooseOne = function() {
        var wantSome = randoms();
        $("#fateText").text("");
        waitingTime(wantSome);
    },

//this guy is going to fade the response
//in and turn the shakes off
    waitingTime = function(digits) {
        var chileConQueso = choiced(digits);
        grabbingOn(chileConQueso);
        shakeThemUp();
        $("#fate").fadeIn(2000);
        watchIt();
    },

//this one creates a magic number
    randoms = function(){
        var numbre = Math.floor(Math.random()*14)+1;
        return numbre;
    },

//this guy creates the choice id
    choiced = function(numero) {
        var bango = "choice"+numero;
        return bango;
    },

//this collects the generously donated
//questions for the class survey
    postIt = function (question){
        var postData = new Firebase('https://amber-fire-3354.firebaseio.com/surveyData/'+generateGUID+"/"+questionCounter);
        postData.set(question);
    },

//this guy makes the proper call
//to the proper id
    grabbingOn = function(whatWhat){
        fetchData = new Firebase('https://amber-fire-3354.firebaseio.com/'+whatWhat);
        fetchData.once("value", function(whatWhat) {
            var quesoDip = whatWhat.val();
            $("#fateText").text(quesoDip);
        });
    },

//variable declarations, hooooo!
    inputz,
    questionCounter = 0,
    generateGUID = Math.floor((100000000000 + Math.random()) * 0x10000).toString(16);