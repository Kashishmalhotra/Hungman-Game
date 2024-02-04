var wordList = [
    ["Hangman", "That game you are playing right now."],
    ["HTML", "Markup language for creating Web pages."],
    ["CSS", "Web page styles"],
    ["PHP", "A very popular server scripting language."],
    ["JavaScript", "Make web-page dynamic without reloading the web page."],
    ["Java", "Run 15 billion devices.\nA program can be run in Windows, Linux, and Mac"],
    ["SoloLearn", "A company that everyone can code for fun and share."],
    ["Love", "What is ?\nBaby don't hurt me\nDon't hurt me\nNo more"],
    ["Document", "A lot of text in the a file."],
    ["Playground", "There school kids go to."],
    ["Run", "Usain bolt."],
    ["Code", "var hw = 'Hello World';"],
    ["Samsung", "A company that creates Phone, Tv, Monitor, SSD, Memory chip..."],
    ["Super Mario", "A very popular game on Nintendo 64 that has a red hat."],
    ["Star", "Super Mario likes to get."],
    ["Clock", "14:12 or 2:12 PM"],
    ["Binary Clock", "A clock that only uses 0 or 1."],
    ["Sword", "Link from Zelda has one in hand."],
    ["Girl", "Not a boy but ?"],
    ["Boy", "Not a girl but ?"],
    ["Female", "Another name for a girl."],
    ["Male", "Another name for a boy."],
    ["Smartphone", "Something you always have on you."]
];

var keyboard = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var selectedWordIndex = 0;
var remainingLetters = [];
var incorrectAttempts = 0;

// Web-page onload
window.onload = function () {
    gId("moveKeyboard").addEventListener('touchmove', function (e) {
        handleTouchMove(e);
    }, false);
    createKeyboard();
    newGame();
};

// Start game
function startGame() {
    gId("home").className = "h";
    gId("result").className = "h";
    newGame();
}

// New game
function newGame() {
    clearKeyboard();
    clearPlayer();
    createWord();
}

// Clear keyboard
function clearKeyboard() {
    var buttons = document.getElementsByClassName("b");
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].setAttribute("data", "");
    }
}

// Clear player
function clearPlayer() {
    incorrectAttempts = 0;
    remainingLetters = [];
    for (var i = 0; i < 7; i++) {
        gId("g" + i).setAttribute("data", "false");
        if (i === 5) {
            gId("g" + i).setAttribute("l", "false");
            gId("g" + i).setAttribute("r", "false");
        }
    }
    gId("hintButton").setAttribute("data", "false");
    gId("hint").style.display = "none";
}

// Get new word
function createWord() {
    var letterContainer = gId("letter");
    var hintBox = gId("hintBox");
    letterContainer.innerHTML = "";
    hintBox.innerHTML = "";

    selectedWordIndex = Math.floor(Math.random() * wordList.length);
    var currentWord = wordList[selectedWordIndex][0].toUpperCase();
    var currentHint = wordList[selectedWordIndex][1];

    for (var i = 0; i < currentWord.length; i++) {
        var letter = currentWord[i];
        var spanElement = document.createElement("span");
        spanElement.className = "l" + (letter === " " ? " ls" : "");
        spanElement.innerHTML = "&nbsp;";
        spanElement.id = "l" + i;
        letterContainer.appendChild(spanElement);

        if (letter !== " " && remainingLetters.indexOf(letter) === -1) {
            remainingLetters.push(letter);
        }
    }

    // Populate the hint box
    hintBox.innerHTML = currentHint;
}

// Create keyboard
function createKeyboard() {
    var keyboardContainer = gId("keyboard");
    keyboardContainer.innerHTML = "";
    for (var i = 0; i < keyboard.length; i++) {
        var button = document.createElement("span");
        button.className = "b";
        button.innerText = keyboard[i];
        button.setAttribute("data", "");
        button.onclick = function () {
            handleButtonClick(this);
        };
        keyboardContainer.appendChild(button);
    }
}

// Game check, If show next error / game end
function handleButtonClick(button) {
    if (button.getAttribute("data") === "") {
        var letter = button.innerText;
        var isCorrect = isExist(letter);
        button.setAttribute("data", isCorrect);

        if (isCorrect) {
            if (remainingLetters.length === 0) {
                gameEnd(true);
            }
        } else {
            showNextFail();
        }
    }
}

// If letter exists
function isExist(letter) {
    letter = letter.toUpperCase();
    var index = remainingLetters.indexOf(letter);
    if (index !== -1) {
        remainingLetters.splice(index, 1);
        typeWord(letter);
        return true;
    }
    return false;
}

// Show next fail drawing
function showNextFail() {
    incorrectAttempts++;
    if (incorrectAttempts <= 10) {
        gId("g" + (incorrectAttempts - 1)).setAttribute("data", "true");
        if (incorrectAttempts === 4) {
            gId("hintButton").setAttribute("data", "true");
        }
        if (incorrectAttempts === 5) {
            gId("g5").setAttribute("l", "true");
        }
        if (incorrectAttempts === 8) {
            gId("g5").setAttribute("r", "true");
        }
        if (incorrectAttempts === 9) {
            gId("g6").setAttribute("l", "true");
        }
        if (incorrectAttempts === 10) {
            gId("g6").setAttribute("r", "true");
            gameEnd(false);
        }
    }
}

function typeWord(letter) {
    var currentWord = wordList[selectedWordIndex][0].toUpperCase();
    for (var i = 0; i < currentWord.length; i++) {
        if (currentWord[i] === letter) {
            gId("l" + i).innerText = letter;
        }
    }
}

// Game result
function gameEnd(isWin) {
    var resultContainer = gId("result");
    resultContainer.setAttribute("data", isWin);
    if (isWin) {
        gId("rT").innerText = "You Win!";
        gId("rM").innerHTML = "Congratulations, you found the word!<br/><br/>Good Job!";
    } else {
        gId("rT").innerText = "You Lose!";
        gId("rM").innerHTML = "The word was <br/><br/>\"" + wordList[selectedWordIndex][0].toUpperCase() + "\"<br/><br/>Better luck next time.";
    }
    resultContainer.className = "";
}

// Show hint
function hint() {
    gId("hintText").innerText = wordList[selectedWordIndex][1];
    gId("hint").style.display = "block";
}

// Exit hint
function hintExit() {
    gId("hint").style.display = "none";
}

// Get HTML element by ID
function gId(id) {
    return document.getElementById(id);
}

// Handle touch move for keyboard repositioning
function handleTouchMove(e) {
    var windowHeight = window.innerHeight;
    var touchY = e.touches[0].clientY;
    var keyboardElement = gId("tastatur");
    var resultY = windowHeight - touchY - keyboardElement.offsetHeight;

    if (resultY < 0) {
        resultY = 0;
    } else if (resultY > windowHeight / 2) {
        resultY = windowHeight / 2;
    }

    keyboardElement.style.bottom = resultY + "px";
}
