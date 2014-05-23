$(document).ready(function(){
    watchIt();
    letterizeIt();
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
                letterizeIt();
            }
            else if (e.which === 13 && inputz !== "") {
                shakeThemUp();
                goingOut();
                $("#splash").text(inputz);
                letterizeIt();
                $("#quest").val("");
            }
        });
    },
    letterizeIt = function() {
        $("h3").lettering();
        var letterCount = document.getElementsByTagName('span').length,
            maxLetter = Math.ceil(letterCount/2);
        for (i=0; i<letterCount; i++) {
            var currentCount = i+1,
                degreeTurn = (currentCount - maxLetter)*4,
                currentChar = "char"+currentCount;
            $("."+currentChar).attr("style", "-ms-transform: rotate("+degreeTurn+"deg); -webkit-transform: rotate("+degreeTurn+"deg); transform: rotate("+degreeTurn+"deg); ");
        }
    };