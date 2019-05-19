const cards = document.querySelectorAll('.cards');
const deck = document.querySelector('.deck');
const replay = document.querySelector('.replay a');
const moves = document.querySelector('.moves span');
const scorePanelStar = document.querySelector('.score ul');
const hours = document.querySelector('.hours');
const minutes = document.querySelector('.minutes');
const seconds = document.querySelector('.seconds');
const finalScoreMessage = document.querySelector('.final-score-message');
const scoreMessage = document.querySelector('.score-message');
const scoreZero = document.querySelector('.score-zero');
const scoreList = document.querySelector('.score-list');
const replayBtn = document.querySelector('.replay-btn');
const close = document.querySelector('.close');

const symbols = ['fa-diamond','fa-diamond',
                'fa-paper-plane-o', 'fa-paper-plane-o',
                'fa-anchor', 'fa-anchor',
                'fa-bolt', 'fa-bolt',
                'fa-cube', 'fa-cube',
                'fa-leaf', 'fa-leaf',
                'fa-bicycle', 'fa-bicycle',
                'fa-bomb', 'fa-bomb'
                ];

let openedCards = []; // the opened cards will be added here

let matches = 0;

let movesNum = 0;

let h = 0; // hours
let m = 0; // minutes
let s = 0; // seconds
let gameBegins = false;
let timerInterval;

// STARTS THE GAME
deck.addEventListener('click', game);

// RESTING THE WHOLE GAME
replay.addEventListener('click', replayGame);
replayBtn.addEventListener('click', replayGame);

// CLOSE THE FINAL SCORE MESSAGE
close.addEventListener('click', () => {
    finalScoreMessage.classList.remove('show-final-score-message');
});

initGame(symbols);

// INITIALIZING THE GAME
function initGame(symbol) {
    let HtmlCardSymbol = null; // SELECTS THE ITEM 'i' AND CHANGE IT'S CLASS NAME
    let j = 0;
    const shuffleCards = shuffle(symbol);
    const faClass = 'fa ';

    for(card of cards) {
        HtmlCardSymbol = card.querySelector('i');
        HtmlCardSymbol.classList = faClass + shuffleCards[j];
        card.setAttribute('data-card', shuffleCards[j]);
        j++;
    }
}

function game(event) {
    let target = event.target;

    // PREVENT ADDING THE SAME TARGET
    if (target.classList.contains('cards')) {
        if (!openedCards.includes(target)) {
            gameStarts(target);
        }
    }
}

// HERE'S WHERE THE GAME BEGINS :)
function gameStarts(target) {
    if (!target.classList.contains('open') && !target.classList.contains('show') && !target.classList.contains('match')) {

        showCards(target);
        openedCardsList(target);
        movesCounter();
        checkScore();

        let firstCard = openedCards[0];
        let secondCard = openedCards[1];
        let length = openedCards.length;

        if (length === 2) {
            // IF CARDS MATCH
            if (firstCard.dataset.card === secondCard.dataset.card) {
                match(firstCard, secondCard);
                matches++;
                checkWin();
            } else {
                // IF CARDS DON'T MATCH
                closeCards(firstCard, secondCard);
            }
            openedCards = [];
        }
    }
}

// FLIP AND SHOW THE CARD WHEN CLICKED
function showCards(card) {
    card.classList.add('open', 'show');
    beginTimer();
}

// ADD A NEW CARD TO THE LIST, WHEN CLICKED
function openedCardsList(card) {
    openedCards.push(card);
}

// KEEP THE CARDS THAT MATCH OPENED
function match(firstCard, secondCard) {
    firstCard.classList.add('open', 'show', 'match');
    secondCard.classList.add('open', 'show', 'match');
}

// CLOSE THE CARDS THAT DON'T MATCH
function closeCards(firstCard, secondCard) {
    setTimeout(() => {
        firstCard.classList.remove('open', 'show');
        secondCard.classList.remove('open', 'show');
    }, 500);
    
}

// COUNT FOR MOVES
function movesCounter() {
    movesNum++;
    moves.textContent = movesNum;
}

// WHEN THE GAME BEGINS, THE TIMER STARTS
function timer() {
    s++;
    if (s < 60) { // SECONDS
        if (s.toString().length === 1) {
            seconds.textContent = '0' + s;
        } else {
            seconds.textContent = s;
        }
    } else if (s === 60 && m < 60) { // MINUTES
        s = 0;
        m++;
        if (m.toString().length === 1) {
            minutes.textContent = '0' + m;
        } else {
            minutes.textContent = m;
        }
        seconds.textContent = '00';
    } else { // HOURS
        s = 0;
        m = 0;
        h++;
        minutes.textContent = '0' + m;
        if (h.toString().length === 1) {
            hours.textContent = '0' + h;
        } else {
            hours.textContent = h;
        }
        seconds.textContent = '00';
        minutes.textContent = '00';
    }
}

// IT WILL CALLED WHEN THE FIRST CARD IS CLICKED
function beginTimer() {
    if (!gameBegins) {
        gameBegins = true;
        timerInterval = setInterval(timer, 1000);
    }
}

// CHECK IF THE GAME IS COMPLETED
function checkWin() {
    if (matches === 8) {
        setTimeout(() => {
            matches = 0;
            clearInterval(timerInterval);
            finalScore();
            finalScoreMessage.classList.add('show-final-score-message');
        }, 500);
    }
}

function checkScore() {
    if (movesNum > 21 && movesNum <= 34) {
        scoreList.children[2].children[0].classList.add('fa-star-o');
        scorePanelStar.children[2].children[0].classList.add('fa-star-o');
    } else if (movesNum > 34 && movesNum <= 44) {
        scoreList.children[1].children[0].classList.add('fa-star-o');
        scoreList.children[2].children[0].classList.add('fa-star-o');
        scorePanelStar.children[1].children[0].classList.add('fa-star-o');
        scorePanelStar.children[2].children[0].classList.add('fa-star-o');
    } else if (movesNum > 44) {
        for (const star of scoreList.children) {
            star.children[0].classList.add('fa-star-o');
        }

        for (const panelStar of scorePanelStar.children) {
            panelStar.children[0].classList.add('fa-star-o');
        }
    }
}

// SCORE
function finalScore() {
    const finalHours = hours.textContent;
    const finalMinutes = minutes.textContent;
    const finalSeconds = seconds.textContent;

    const s = 's';

    // CHECK IF VALUES GREATER OR EQUAL TO 1, IF GREATER THEN ADD 'S'
    const sHours = (finalHours > 1) ? 'hours' : 'hour';
    const sMinutes = (finalMinutes > 1) ? 'minutes' : 'minute';
    const sSeconds = (finalSeconds > 1) ? 'seconds' : 'second';

    // FINAL SCORE MESSAGE
    if (finalHours != '00') {
        scoreMessage.textContent = `You have beaten the game in ${finalHours} ${sHours}, 
                                    ${finalMinutes} ${sMinutes} and ${finalSeconds} ${sSeconds}. 
                                    And a total of ${movesNum} moves.`
    } else if (finalHours === '00' && finalMinutes != '00') {
        scoreMessage.textContent = `You have beaten the game in ${finalMinutes} ${sMinutes} and 
                                    ${finalSeconds} ${sSeconds}. And a total of ${movesNum} moves.`
    } else {
        scoreMessage.textContent = `You have beaten the game in ${finalSeconds} ${sSeconds}. 
                                    And a total of ${movesNum} moves.`
    }
}

function resetTimer() {
    clearInterval(timerInterval);
    h = 0;
    m = 0;
    s = 0;
    hours.textContent = '0' + h;
    minutes.textContent = '0' + m;
    seconds.textContent = '0' + s;
    gameBegins = false;
}


// RESET THE WHOLE GAME
function replayGame() {
    for (const card of cards) {
        card.classList.remove('open', 'show', 'match');
    }

    openedCards = [];
    movesNum = 0;
    moves.textContent = movesNum;
    resetTimer();
    initGame(symbols);
    finalScoreMessage.classList.remove('show-final-score-message');

    for (const star of scoreList.children) {
        star.children[0].classList.remove('fa-star-o');
    }

    for (const panelStar of scorePanelStar.children) {
        panelStar.children[0].classList.remove('fa-star-o');
    }
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}