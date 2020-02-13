//GAME VARIABLES
/*
 * Create a list that holds all of your cards
 */
let cards = ['fa-diamond', 'fa-paper-plane-o', 'fa-anchor', 'fa-bolt', 'fa-cube', 'fa-leaf', 'fa-bicycle', 'fa-bomb', 'fa-diamond', 'fa-paper-plane-o', 'fa-anchor', 'fa-bolt', 'fa-cube', 'fa-leaf', 'fa-bicycle', 'fa-bomb']
// List to store currently opened cards
let openedCards = []
// Stores number of moves taken
let moveCounter = 0
// Stores current star rating
let starRating = 3
// Stores time when game starts, which is the first click on any card
let startTime;
let tInterval;
let timerRunningStatus = false;
let currentTimeElapsed = 0;

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Function to start Timer
const startTimer = () => {
  timerRunningStatus = true
  startTime = new Date().getTime()
  //Function getShowTime is called every 1 sec
  tInterval = setInterval(getShowTime, 1000)
}

// Function to stope and reset Timer
const resetTimer = () => {
  clearInterval(tInterval)
  timerRunningStatus = false
  document.querySelector('.timer').innerHTML = "0"
}

//Function to update timer on DOM
const getShowTime = () => {
  const updatedTime = new Date().getTime()
  const timerDisplay = document.querySelector('.timer')
  const timeDifference = updatedTime - startTime
  const seconds = Math.floor(timeDifference / 1000)
  timerDisplay.innerHTML = seconds
  currentTimeElapsed = seconds
}

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

//Function to update number of moves taken on DOM
const updateMoves = (moves) => {
  document.querySelector('.moves').innerHTML = moves
  //Rules for star rating
  if (moves === 12) {
    removeStar()
  } else if (moves === 20) {
    removeStar()
  }
}

//Function to remove 1 star from the DOM
const removeStar = () => {
  starRating -= 1
  const starsContainer = document.querySelector('.stars')
  const stars = starsContainer.querySelectorAll('.fa-star')
  stars[stars.length-1].classList.remove('fa-star')
  stars[stars.length-1].classList.add('fa-star-o')
}

//Function to display game win modal
const displayWinningModal = () => {
  document.querySelector('.game-stats').innerHTML = `With ${moveCounter} moves and ${starRating} stars in ${currentTimeElapsed} seconds`
  document.querySelector('.win-modal').style.display = "block"
}


//Function to add and remove CSS animation for when card pair matches/don't match
const animateCSS = (element, animationName, callback) => {
  element.classList.add('animated', animationName)
  const handleAnimationEnd = () => {
    element.classList.remove('animated', animationName)
    element.removeEventListener('animationend', handleAnimationEnd)
    if (typeof callback === 'function') callback()
  }
  element.addEventListener('animationend', handleAnimationEnd)
}

//Function to handle opening cards
const openCard = (evt) => {
  if (evt.target.classList.contains("card")) {
    if (timerRunningStatus === false) {
      startTimer()
    }
    openedCards.push(evt.target.childNodes[0].classList[1])
    evt.target.classList.add("open", "show", "avoid-clicks")
    //Add conditional logic for when 2 cards have been opened
    if (openedCards.length === 2) {
      //Add conditional logic for if the 2 opened cards matches
      if (openedCards[0] === openedCards[1]) {
        const cardElementList = document.querySelectorAll('.show')
        for (let card of cardElementList) {
          card.classList.remove("open")
          card.classList.add("match")
          animateCSS(card, 'rubberBand', function() {
            card.classList.remove("show")
          })
        }
        openedCards = []
        moveCounter += 1
        updateMoves(moveCounter)
        //Add conditional logic to check for game win
        if (document.querySelectorAll('.match').length === 16) {
          displayWinningModal()
        }
      } else {
        const cardElementList = document.querySelectorAll('.show')
        for (let card of cardElementList) {
          card.classList.remove("open")
          card.classList.add("wrong")
          animateCSS(card, 'wobble', function() {
            card.classList.remove("show", "wrong", "avoid-clicks")
          })
        }
        openedCards = []
        moveCounter += 1
        updateMoves(moveCounter)
      }
    }
  }
}

//Function to start game
const startGame = () => {
  //Shuffle the array of cards
  cards = shuffle(cards)
  const deck = document.querySelector('.deck')
  //Create DOM elements for each card in the array
  cards.map((card) => {
    let newCard = document.createElement('li')
    newCard.className = "card"
    let newIcon = document.createElement('i')
    newIcon.className = "fa " + card
    newCard.appendChild(newIcon)
    deck.appendChild(newCard)
  })
  moveCounter = 0
  deck.addEventListener('click', openCard)
  //Add event listener to restart button
  document.querySelector('.restart').addEventListener('click', restartGame)
  document.querySelector('#playagain').addEventListener('click', restartGame)
}

//Function to restart Game
const restartGame = () => {
  //Reset game variables
  openedCards = []
  moveCounter = 0
  updateMoves(0)
  starRating = 3
  //Reset star rating on DOM
  document.querySelector('.stars').innerHTML = `<li><i class="fa fa-star"></i></li>
  <li><i class="fa fa-star"></i></li>
  <li><i class="fa fa-star"></i></li>`
  //Reset timer DOM
  resetTimer()
  //Clear cards from DOM
  document.querySelector('.deck').innerHTML = ""
  //Hide game win modal from DOM
  document.querySelector('.win-modal').style.display = "none"
  startGame()
}

startGame()
