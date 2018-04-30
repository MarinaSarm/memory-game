window.onload = function play() {
/*
 * Create a list that holds all of your cards
 */
 // all cards repeated 2 times
const cards = ["fa-diamond", "fa-paper-plane-o", "fa-anchor", "fa-bolt", "fa-cube", "fa-leaf", "fa-bicycle", "fa-bomb"];
const allCards = cards.concat(cards);

 /*
  * Display the cards on the page
  *   - shuffle the list of cards using the provided "shuffle" method below
  *   - loop through each card and create its HTML
  *   - add each card's HTML to the page
  */
const cardsMixed = shuffle(allCards);
const fragmentCards = document.createDocumentFragment();
cardsMixed.forEach(function(card) {
  const cardNext = document.createElement('li');
  cardNext.className = "card";
  cardNext.innerHTML = `<i class="fa ${card}"></i>`;
  fragmentCards.appendChild(cardNext);
});
document.querySelector('.deck').appendChild(fragmentCards);


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
}


// function to display the card's symbol if clicked
function display(card) {
  card.classList.toggle('open');
  card.classList.toggle('show');
}

// create a list of open cards
let openCards = [];
let count = 0;

// function to mark card as opened and check if there is already one opened card and compare them if there is
function markOpen() {
  if (count > 1) {
    console.log(openCards);
    let first = openCards[openCards.length - 2].classList;
    let second = openCards[openCards.length - 1].classList;
    if (first.value == second.value) {
      console.log('matched');
      lock(openCards[openCards.length - 2], openCards[openCards.length - 1]);
    } else {
      openCards.pop();
      openCards.pop();
    };
    count = 0;
  }
}

//function to lock cards in open position
function lock(card1, card2) {
  card1.classList.add('match');
  card2.classList.add('match');
}

// set up event listener for a clck on card
document.querySelector('.deck').addEventListener('click', function(event) {
  const target = event.target;
  if (! target.classList.contains('match')) {
    display(target); //show symbol
    const symbol = target.querySelector('.fa');
    openCards.push(symbol);
    count++;
    console.log(count);
    markOpen(); //check if this symbol is already opened
  }
});

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
