// initializing key variables
const gridContainer = document.querySelector(".grid-container");
let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let flipCount = 0;
let score = 0;
let finalScore = 0;

//Timer Stuff ////////////////////////////////////////////////////////////////////////////////////////////////
//time formatting (00:00:00)
function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  // format the timer to display as double digits for each unit. (generated by ChatHPT)
  const formattedHours = hours.toString().padStart(2, '0');
  const formattedMinutes = minutes.toString().padStart(2, '0');
  const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

// Enabling counting for timer (establishing logic for stoping timer when game is won)
let counting = true;

// Function to update the timer every second
function updateTimer() {
  if(counting === true){
    timerSeconds++;
    console.log("update timer", timerSeconds);
    document.querySelector('.timer').textContent = formatTime(timerSeconds);
  }
}

//initial timer value
let timerSeconds = 0;

// To make the timer appear on load
updateTimer();

// time incrementation interval
const timerInterval = setInterval(updateTimer, 1000);

// Card Functions ////////////////////////////////////////////////////////////////////////////////////////////
document.querySelector(".flipCount").textContent = flipCount;

fetch("./data/cards-easy.json")
  .then((res) => res.json())
  .then((data) => {
    cards = [...data, ...data];
    shuffleCards();
    generateCards();
  });

// for random card generation
function shuffleCards() {
  let currentIndex = cards.length,
    randomIndex,
    temporaryValue;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = cards[currentIndex];
    cards[currentIndex] = cards[randomIndex];
    cards[randomIndex] = temporaryValue;
  }
}

// generates cards on screen
function generateCards() {
  for (let card of cards) {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.setAttribute("data-name", card.name);
    cardElement.innerHTML = `
      <div class="front">
      <img class="front-image" src=${card.image}>
      </div>
      <div class="back"></div>
    `;
    gridContainer.appendChild(cardElement);
    cardElement.addEventListener("click", flipCard);
  }

  completedCheck(cards.length);
}

// function to flip cards when clicked
function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add("flipped");

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  lockBoard = true;

  flipCount++;
  document.querySelector(".flipCount").textContent = flipCount;
  checkForMatch();
}

// checks if two flipped cards match
function checkForMatch() {
  let isMatch = firstCard.dataset.name === secondCard.dataset.name;

  isMatch ? disableCards() : unflipCards();

  if (isMatch === true){
    score++;
    const score_sound = new Audio('score-chimes.mp3');
    score_sound.play();
    score_sound.volume = 0.3;
  }
  else {
    const flip_sound = new Audio('flip-ballon.mp3');
    flip_sound.play();
    flip_sound.volume = 0.3;
  }

  completedCheck(cards.length);
}

// disables cards if they match (keeps them flipped face up)
function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);

  resetBoard();
}

// flips cards face down if they don't match
function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    resetBoard();
  }, 1000);
}

// Reset Board Function ///////////////////////////////////////////////////////////////////////////////////
function resetBoard() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

// Start Menu functions ///////////////////////////////////////////////////////////////////////////////////
const restartButton = document.getElementById("btn-restart");
const rankButton = document.getElementById("btn-rank");
restartButton.addEventListener("click", restart);
rankButton.addEventListener("click", rank);

function restart() {
  counting = true;
  console.log("restart", timerSeconds);
  timerSeconds = 0;
  document.querySelector('.timer').textContent = formatTime(timerSeconds);

  resetBoard();
  shuffleCards();
  flipCount = 0;
  document.querySelector(".flipCount").textContent = flipCount;
  gridContainer.innerHTML = "";
  generateCards();

  updateTimer();

  const restart_sound = new Audio('restart-recycle.mp3');
  restart_sound.play();
  restart_sound.volume = 0.3;
}

// Start button toggle /////////////////////////////////////////////////////////////////////

document.addEventListener('DOMContentLoaded', function () {
  const startButton = document.getElementById('startButton');
  const menuContainer = document.getElementById('menuContainer');

  startButton.addEventListener('click', function () {
    menuContainer.style.display = (menuContainer.style.display === 'none' || menuContainer.style.display === '') ? 'block' : 'none';
  });
});



//Score board toggle //////////////////////////////////////////////////////////////////////////////////////
const rightBarDis = document.getElementById("right-bar-display");
const rightBarDis2 = document.getElementById("right-bar-display-2");

const rightBarDis_t = window.getComputedStyle(rightBarDis);
const rightBarDis2_t = window.getComputedStyle(rightBarDis2);

function rank(){
  if (rightBarDis_t.display === "none"){
    rightBarDis.style.display = "block";
    rightBarDis2.style.display = "none";
  }
    
  else if (rightBarDis_t.display === "block"){
    rightBarDis.style.display = "none";
    rightBarDis2.style.display = "block";
  }

  const rank_sound = new Audio('rank-information-bar.mp3');
  rank_sound.play();
  rank_sound.volume = 0.3;
}

rightBarDis2.style.display = "none";

// Logic and functions for winning the game////////////////////////////////////////////////////////////////
const winImage = document.getElementById("win-window");
const displayScore = document.getElementById("score-display");
const scoreContainer = document.getElementById("right-bar-display-2");

let scoreList = [];
let timedList = [];

// checks for win conditions
function completedCheck(length) {
  // this is changed for testing original : score === length / 2
  if (score === length / 2) {
    winImage.style.display = "block";
    
    // score_algorithmic()

    // timerSeconds = 600000;
    console.log(flipCount)
    finalScore = (score * 10000 / (timerSeconds*flipCount))*20 + 1000;

    finalScore = Math.round(finalScore);
    displayScore.innerHTML = finalScore + " Points!";

    // Stop the timer interval

    const win_sound = new Audio('win-tada.mp3');
    win_sound.play();
    win_sound.volume = 0.1;

    display_score_rank(finalScore,timerSeconds);
    counting = false;
    score = 0;
  } else {
    winImage.style.display = "none";
  }
}

// Score board disply//////////////////////////////////////////////////////////////////////////////////////
function display_score_rank(finalScore,timerSeconds){
    scoreList.push(finalScore);
    timedList.push(timerSeconds);
    scoreContainer.innerHTML = "";

    scoreList.sort(function(a, b) {
      return b - a;
    });

    for (i=0; i<scoreList.length; i++){
      const newScore = document.createElement("li");
      newScore.innerHTML = ` ` + scoreList[i] + ` Points!` + "<br />" +formatTime(timedList[i]);
      scoreContainer.appendChild(newScore); 
    }
}