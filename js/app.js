cards = ['fa fa-diamond', 'fa fa-diamond',
         'fa fa-paper-plane-o', 'fa fa-paper-plane-o',
         'fa fa-anchor', 'fa fa-anchor',
         'fa fa-bolt', 'fa fa-bolt',
         'fa fa-cube', 'fa fa-cube',
         'fa fa-leaf', 'fa fa-leaf',
         'fa fa-bicycle', 'fa fa-bicycle',
         'fa fa-bomb', 'fa fa-bomb'];

starsArray = ['fa fa-star', 'fa fa-star', 'fa fa-star'];

// Get card deck
var cardDeck = document.querySelector('.deck');
// Get moves panel
var movesPanel = document.querySelector('.moves');
// Get stars panel
var starsPanel = document.querySelector('.stars');
// Get restart button
var restartButton = document.querySelector('.restart');
// Get timer display
var timerDisplay = document.querySelector('.timer');
// Get modal display
var modal = document.getElementById('winModal');
// Get play again button
var playAgain = document.querySelector('.button');
var openCards, matchedCards, moves, stars, timer, seconds, minutes;

// Function that initiliazes game variables and generates that deck of cards
function initGame() {
    openCards = [];
    matchedCards = [];
    moves = 0;
    stars = starsArray.length;
    timer = 0;
    seconds = 0;
    minutes = 0;
    // Insert value of moves variable into the DOM
    movesPanel.innerHTML = moves.toString();
    // Insert value of timer variable into the document
    timerDisplay.innerHTML = '0' + minutes + ":" + '0' + seconds;
    // Generate the HTML of the stars panel and insert into the DOM
    starsPanel.innerHTML = generateStars(starsArray);
    // Shuffle the cards array
    shuffle(cards);
    // Generate the HTML of the deck of shuffled cards and insert into the DOM
    cardDeck.innerHTML = generateDeck(cards);
};

// Function that takes in the stars array as input parameter and returns an HTML string of the stars as output
function generateStars (starsArray) {
    // Loop through each element in the stars array and create its HTML
    var stars = starsArray.map(function(star) {
        return '<li><i class="' + star + '"></i></li>';
    });

    return stars.join('');
};

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
};

// Function that takes in the cards array as input parameter and returns an HTML string of the deck as output
function generateDeck(cards) {
    // Loop through each element in the cards array and create its HTML
    var deck = cards.map(function(card) {
        return '<li class="card"><i class="' + card + '"></i></li>';
    });

    return deck.join('');
};

/* Function that takes in the click event as input parameter, uses event.target property
along with evaluation of a series of check conditions, to see where the click event happened and handles
it by flipping the card and temporarily adding it to the openCards array */
function flipCards(event) {
    // Check that we haven't clicked on any other nodes except the <li> or child <i>
    if (event.target.nodeName !== 'LI' && event.target.nodeName !==  'I') {
        return;
    }

    // Check that we have not more than 2 open unmatched cards before firing the click event
    if (openCards.length === 2) {
        return;
    }

    // If we clicked on <li>, check that the element is not an open or matched card
    if (event.target.className === 'card open' || event.target.className === 'card open match animated tada') {
        return;
    }

    // If we clicked on <i>, check that the parent element is not an open or matched card
    if (event.target.parentElement.className === 'card open' || event.target.parentElement.className === 'card open match animated tada') {
        return;
    }

    // Check if timer is equal to 0, then starts the game timer
    if (timer === 0) {
        timer = setInterval(startTimer, 1000);
    }

    var childCard = null;
    // Get the child of the card class that we clicked
    if (event.target.nodeName === 'LI') {
        // If we clicked on <li>, childCard is target children[0]
        childCard = event.target.children[0];
    } else {
        // If we clicked on <i>, childCard is just the target
        childCard = event.target;
    }

    // Flips the clicked card by adding the class open and then adds it to the openCards array
    childCard.parentElement.classList.add('open');
    openCards.push(childCard);

    if (openCards.length > 1) {
        compareCards(openCards);
    }
};

// Function that starts and keeps track of the game timer
function startTimer() {
    seconds++;
    if (seconds === 60) {
        minutes++;
        seconds = 0;
    }

    // Displays time in 00:00 format by checking if minutes and seconds are < 10
    timerDisplay.innerHTML = (((minutes < 10) ? ('0' + minutes) : minutes) + ":" + ((seconds < 10) ? ('0' + seconds) : seconds));
};

// Function that takes in the parameter openCards array and checks if the two cards match
function compareCards(openCards) {
    if (openCards[0].className === openCards[1].className) {
        matched(openCards);
    } else {
        flipBack(openCards);
    }
};

// Function that takes in unmatched openCards as input parameter and flips them back
function flipBack(openCards) {
    // Loop through each card and add new class/change style to indicate not match
    openCards.forEach(function(openCard) {
        openCard.parentElement.setAttribute('style', 'background-color: #ff0000');
        openCard.parentElement.classList.add('animated', 'wobble');
    });
    // Flip back open cards by removing added class and styles after a delay of 0.8 seconds
    setTimeout(function() {
        openCards.forEach(function(openCard) {
            openCard.parentElement.classList.remove('open', 'animated', 'wobble');
            openCard.parentElement.removeAttribute('style', 'background-color: #ff0000');
        });
        openCards.splice(0, 2);
    }, 800);
    moveCounter();
    starRating();
};

// Function that takes in matched openCards as input parameter and adds them to matchedCards array
function matched(openCards) {
    // Loop through each card and add new class to indicate match
    openCards.forEach(function(openCard) {
        openCard.parentElement.classList.add('match', 'animated', 'tada');
    });
    openCards.splice(0, 2);
    moveCounter();
    starRating();

    // Add two open matched cards to the matched cards array
    matchedCards.push(openCards[0], openCards[1]);

    // Check if all cards matched by comparing length matched cards array to cards array
    if (matchedCards.length === cards.length) {
        clearInterval(timer);
        winGame();
    }
};

// Function that counts number of moves each time two cards are opened and inserts the value into the DOM
function moveCounter() {
    moves++;
    movesPanel.innerHTML = moves.toString();
};

// Function that keeps track of the star rating based on the number of moves made, and retuns stars remaining
function starRating() {
    var starsTracker = starsPanel.getElementsByTagName('i');

    // If game finished in 11 moves or less, return and star rating remains at 3
    if (moves <= 11) {
        return;
    // If finished between 11 to 16 moves, 3rd colored star is replaced with empty star class
    } else if (moves > 11 && moves <= 16) {
        starsTracker.item(2).className = 'fa fa-star-o';
    // If finished with more than 16 moves, 2nd colored star is replaced with empty star class
    } else {
        starsTracker.item(1).className = 'fa fa-star-o';
    }

    // Update stars variable by counting length of remaining colored star elements
    stars = document.querySelectorAll('.fa-star').length;
};

// Function that displays modal box after a player has correctly matched all 16 cards
function winGame() {
    var finalScore = document.querySelector('.score');
    var finalTime = document.querySelector('.time');

    /* Display modal box after a 1.2 seconds delay to give time for the last matched cards animation to run
    and inserts the player game stats to the DOM */
    setTimeout(function() {
        modal.style.display = 'block';
        finalScore.innerHTML = 'You finished the game with ' + moves + ' moves and ' + stars + ' star(s)!!!';
        if (minutes >= 1) {
            finalTime.innerHTML = 'Time completed: ' + minutes + ' minutes and ' + seconds + ' seconds.';
        } else {
            finalTime.innerHTML = 'Time completed: ' + seconds + ' seconds.';
        }
    }, 1200);
};

// Event listener that listens for click on the deck of cards
cardDeck.addEventListener('click', function(event) {
    flipCards(event);
});

// Event listener that listens for a click on the restart button
restartButton.addEventListener('click', function() {
    clearInterval(timer);
    initGame();
});

// Event listener that listens for click on the play again button after the player has won
playAgain.addEventListener('click', function() {
    modal.style.display = 'none';
    clearInterval(timer);
    initGame();
});

initGame();
