//initialize the firebase stuff
var firebaseConfig = {
    apiKey: "AIzaSyAmgUk0ypJzhXsZ5oVBkKOxF3TW9fNBSVw",
    authDomain: "magic-8-a5c33.firebaseapp.com",
    projectId: "magic-8-a5c33",
    databaseURL: "https://magic-8-a5c33-default-rtdb.firebaseio.com",
    storageBucket: "magic-8-a5c33.appspot.com",
    messagingSenderId: "796689420968",
    appId: "1:796689420968:web:36adf4669fb45d85f6289d",
    measurementId: "G-4Z3TXQCN29"
};
firebase.initializeApp(firebaseConfig);
firebase.analytics();

var database = firebase.database(),
    ansLen,
    tempQuest,
    answers,
    going = false;
database.ref().child("responses").get().then((snapshot) => {
    if (snapshot.exists()) {
        ansLen = snapshot.val().length;
        answers = snapshot.val();
    } else {
        ansLen = 2;
        return ["ehh", "nope"]
    }
}).catch((error) => {
    console.error(error);
});

//basic sanitation for strings
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

//align the splash around the ball
function radialLetters() {
    var letterCount = document.getElementsByTagName('span').length,
        spacing = 4,
        smallLetters = 1,
        maxLetter = Math.ceil(letterCount/2);
    console.log(letterCount);
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
        $("h3").text("That was a really long question, dude. Hope you remember it.");
        return;
    }
    //loop through them individual letters! do it!
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
}

//lets kick this all off!
$(document).ready(function(){
    $("#splash").lettering();
    
    setTimeout(function() {
        $("#splash").fadeIn(1000);
        radialLetters();
    },10);
    $("form").on("submit", function(e){
        e.preventDefault();
        if (!going) watchIt();
    });
});

//watch for those buttons!
var watchIt = function() {
    going = true;
    var inputz = $("#quest").val();
        if (inputz === "") {
            tryAgain();
        }
        else if (inputz !== "") {
            doItAll(inputz);
        }
    },
    //this makes them try again if nothing entered into field
    tryAgain = function() {
        $("#splash").text("Try Asking Me A Question This Time!");
        $("#splash").lettering();
        radialLetters();
    },
    //this does it all when enter or button is clicked
    doItAll = function(dataz) {
        questionCounter++;
        $("#splash").text(dataz);
        $("#splash").lettering();
        shakeThemUp();
        goingOut();
        radialLetters();
        tempQuest = escapeRegExp(dataz);
        $("#quest").val("");
    },

    //this toggles some shake magic!
    shakeThemUp = function() {
        console.log("shaking");
        $("#container").toggleClass("shakeIt");
        $("#fate").toggleClass("inverseShakeIt");
    },

    //this one is for fading out the previous response and starting the choice
    goingOut = function() {
        $("#fateText").text("");
        $("#fate").fadeOut(1000, "linear", setTimeout(postIt, 2000));
    },

    //this one creates a magic number
    randoms = function(){
        var numbre = Math.floor(Math.random()*ansLen);
        return numbre;
    },

    //so this guy is going to generate a random number and pick a response
    //this guy is going to fade the response in and turn the shakes off
    //this collects the generously donated
    //questions for the class survey
    postIt = function() {
        shakeThemUp();
        var now = Date.now(),
            answer = answers[randoms()];
            userId = Math.floor((now * Math.random()) * 0x10000).toString(16);
        setTimeout(function() {
            $("#fate").fadeIn(2000);
            $("#fateText").fadeIn(2000);
            $("#fateText").text(answer);
        }, 10)
        firebase.database().ref('answered/'+userId).set({
            answer: answer,
            question : tempQuest
        });
        going = false;
    },

    //variable declarations, hooooo!
    inputz,
    questionCounter = 0;



