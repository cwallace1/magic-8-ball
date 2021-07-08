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

//some global variables
var database = firebase.database(),
    ansLen,
    tempQuest,
    answers,
    userId,
    going = false;

//get the responses for later and set some defaults if something goes wonky
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

//basic sanitation function for strings
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

//function to create a unique question ID
function newQID() {
    var now = Date.now(),
        tempId = Math.floor((now * Math.random()) * 0x10000).toString(16);
    database.ref('answered/'+tempId).get().then((snapshot) => {
        if (snapshot.exists()) {
            newQID();
        } else {
            userId = tempId;
        }
    }).catch((error) => {
        console.error(error);
    });
};

//align the splash title around the ball
function radialLetters() {
    var letterCount = document.getElementsByTagName('span').length,
        spacing = 4,
        smallLetters = 1,
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
        $("h3").text("That was a really long question, dude. Hope you remember it.");
        return;
    }
    
    //loop through the individual letters! do it now!
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
    
    //initialize the splash title after the page has had a chance to breathe
    setTimeout(function() {
        $("#splash").fadeIn(1000);
        radialLetters();
    },10);

    //bing bang boom, off we go!
    $("form").on("submit", function(e){
        e.preventDefault();
        if (!going) watchIt();
    });
});

//some global functions

//watch for those buttons!
var watchIt = function() {

    //change flag to prevent double sending while this is all going on
    going = true;

    //get value of the question
    var inputz = $("#quest").val();
        if (inputz === "") {
            tryAgain();
        }
        else if (inputz !== "") {
            newQID();
            doItAll(inputz);
        }
    },

    //this makes them try again if nothing entered into field
    tryAgain = function() {
        $("#splash").text("Try Asking A Question This Time!");
        $("#splash").lettering();
        radialLetters();
    },

    //this does it all when enter or button is clicked with a question
    doItAll = function(dataz) {
        $("#splash").text(dataz);
        $("#splash").lettering();
        shakeThemUp();
        goingOut();
        radialLetters();
        tempQuest = escapeRegExp(dataz);
        $("#quest").val("");
    },

    //function to show some shake magic!
    shakeThemUp = function() {
        $("#container").toggleClass("shakeIt");
        $("#fate").toggleClass("inverseShakeIt");
    },

    //function for fading out the previous response
    goingOut = function() {
        $("#fateText").text("");
        $("#fate").fadeOut(1000, "linear", setTimeout(postIt, 2000));
    },

    //function to create a magic number
    randoms = function(){
        var numbre = Math.floor(Math.random()*ansLen);
        return numbre;
    },

    //shake it, grab an answer, and populate the fated choice and database
    postIt = function() {
        shakeThemUp();
        var answer = answers[randoms()];
        setTimeout(function() {
            $("#fate").fadeIn(2000);
            $("#fateText").fadeIn(2000);
            $("#fateText").text(answer);
        }, 10)
        database.ref('answered/'+userId).set({
            answer: answer,
            question : tempQuest
        });
        going = false;
    };