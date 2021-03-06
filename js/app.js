window.onload = function play() {
/*
 * Create a list that holds all of your cards
 */
const cards = ["fa-diamond", "fa-paper-plane-o", "fa-anchor", "fa-bolt", "fa-cube", "fa-leaf", "fa-bicycle", "fa-bomb"];

 // all cards repeated 2 times
const allCards = cards.concat(cards);

// create a list of open cards and counter
let openCards = [];
let openSymbols = [];
let count = 0;

// to lock any clicks before hiding cards that haven't matched
let clickPause = false;

//for rating
let stars;

//steps counter and display moves
let stepCounter = 0;
function counter() {
  stepCounter++;
  document.querySelector('.moves').innerText = stepCounter;
}

//for timer
let time;
let firstMove = false;

 /*
  * Display the cards on the page
  *   - shuffle the list of cards using the provided "shuffle" method below
  *   - loop through each card and create its HTML
  *   - add each card's HTML to the page
  */
function throwCards() {
  const cardsMixed = shuffle(allCards);
  //create document fragment to reduce reflow and repaint
  const fragmentCards = document.createDocumentFragment();
  cardsMixed.forEach(function(card) {
    const cardNext = document.createElement('li');
    cardNext.className = 'card';
    cardNext.innerHTML = `<i class="fa ${card}"></i>`;
    fragmentCards.appendChild(cardNext);
  });
  document.querySelector('.deck').appendChild(fragmentCards);
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
  };

  return array;
}

// function to display the card's symbol if clicked or hide if not matched
function display(card) {
  card.classList.toggle('open');
  card.classList.toggle('show');
  card.classList.toggle('current');
}

//function to mark card as opened and check if there is already one opened card
//compare them if there is
function markOpen() {
  if (count > 1) {
    console.log(openSymbols);
    let first = openSymbols[openSymbols.length - 2].classList;
    let second = openSymbols[openSymbols.length - 1].classList;
    let firstCard = openCards[openCards.length - 2];
    let secondCard = openCards[openCards.length - 1];
//lock cards if matched
    if (first.value == second.value) {
      lock(firstCard, secondCard);
    } else {
//hide cards if not matched
      clickPause = true;
      setTimeout(function() {
        display(firstCard);
        display(secondCard);
        addToList(firstCard, openSymbols[openSymbols.length - 2], false);
        addToList(secondCard, openSymbols[openSymbols.length - 1], false);
        clickPause = false;
      }, 1000);
    };
//reset counter
    count = 0;
//count steps
    counter();
//check the star rating
    colorStars('black');
//finish game
    if (openCards.length >= 16) {
      clearInterval(time);
      rating();
    };
  };
}

//function to lock cards in open position
function lock(card1, card2) {
  card1.classList.add('match');
  card2.classList.add('match');
}

//function to add cards to the list of open cards
function addToList(card, symbol, add = true) {
  if (add) {
    openCards.push(card);
    openSymbols.push(symbol);
  } else {
    openCards.pop();
    openSymbols.pop();
  }
}

//function to execute in event listener
function eventDo(target) {
  if ((! target.classList.contains('match')) && (! target.classList.contains('current'))) {
    display(target); //show symbol
    const symbol = target.querySelector('.fa');
    addToList(target, symbol);
    count++;
    markOpen(); //match or hide cards
  }
}

//rating your skills
function starsCount() {
  switch (true) {
    case (stepCounter <= 12):
      stars = 3;
      break;
    case (stepCounter <= 20):
      stars = 2;
      break;
    default:
      stars = 1;
  };
}

function rating() {
  starsCount();
  document.querySelector('.message').innerText = `Congratulations!`;
  document.querySelector('.rate').innerText = `You win with ${stepCounter} moves!
    Your rating is ${stars} stars.
    Your time is ${seconds} seconds.`;
  document.querySelector('.container').style.display = 'none';
  document.querySelector('.rating').classList.toggle('display');
}

//fill stars with color according to your rating
function colorStars(colorS) {
  starsCount();
  let i = stars;
  while (i < 3) {
    i += 1;
    document.querySelector(`.stars > li:nth-of-type(${i})`).style.color = colorS;
  };
}

//function to restart Game
function restart() {
  document.querySelector('.deck').innerHTML = '';
  document.querySelector('.moves').innerText = '0';
  count = 0;
  stepCounter = 0;
  const starsList = document.querySelectorAll('.stars > li');
  for (let starsEach of starsList) {
    starsEach.style.color = '#FF3300';
  };
  seconds = 0;
  openCards = [];
  openSymbols = [];
  clearInterval(time);
  firstMove = false;
  document.querySelector('.second').innerText = '0';
  throwCards();
}

//throw cards
throwCards();

// set up event listener for a click on card
document.querySelector('.deck').addEventListener('click', function(event) {
  event.stopPropagation();
  if (! firstMove) {
    time = setInterval(timerCount, 1000);
    firstMove = true;
  }
  if (! clickPause) {
    if (event.target.tagName === 'LI') {
      const target = event.target;
      eventDo(target);
    }
    else if (event.target.tagName === 'I') {
      const target = event.target.parentNode;
      eventDo(target);
    };
  };
});

//restart Game during current game
document.querySelector('.restart').addEventListener('click', function(event) {
  event.preventDefault();
  restart();
});

//new game, play one more time
document.querySelector('.new-game').addEventListener('click', function(event) {
  event.preventDefault();
  restart();
  document.querySelector('.container').style.display = 'flex';
  document.querySelector('.rating').classList.toggle('display');
});

//timer
let seconds = 0;
function timerCount() {
  seconds += 1;
  document.querySelector('.second').innerText = `${seconds}`;
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
}
