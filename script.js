const gridContainer = document.querySelector(".grid-container");
let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let flipCount = 0;
let score = 0;
let finalScore = 0;

//Things to fix:
// score system needs rework
// rank function
// restart after one round also has blur filter

//citations
// javascript and html frame:
// audio https://gomakethings.com/how-to-play-a-sound-with-javascript/
// the windows xp style

//
//Timer stuff ////////////////////////////////////////////////////////////////////////////////////////////////
//

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

let counting = true;

// Function to update the timer every second----------------------------
function updateTimer() {
  if(counting === true){
    timerSeconds++;
    console.log("update timer", timerSeconds);
    document.querySelector('.timer').textContent = formatTime(timerSeconds);
  }

}

let timerSeconds = 0;

// To make the timer appear on load
updateTimer();

const timerInterval = setInterval(updateTimer, 1000);

//
// Card functions/////////////////////////////////////////////////////////////////////////////////////
//
document.querySelector(".flipCount").textContent = flipCount;

fetch("./data/cards-easy.json")
  .then((res) => res.json())
  .then((data) => {
    cards = [...data, ...data];
    shuffleCards();
    generateCards();
  });

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

function checkForMatch() {
  let isMatch = firstCard.dataset.name === secondCard.dataset.name;

  isMatch ? disableCards() : unflipCards();

  if (isMatch === true){
    score++;
    const score_sound = new Audio('/audio/score-chimes.mp3');
    score_sound.play();
    score_sound.volume = 0.3;
  }
  else {
    const flip_sound = new Audio('/audio/flip-ballon.mp3');
    flip_sound.play();
    flip_sound.volume = 0.3;
  }

  completedCheck(cards.length);
}

function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);

  resetBoard();
}

function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    resetBoard();
  }, 1000);
}

function resetBoard() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

//
// Start Menu functions ///////////////////////////////////////////////////////////////////////////////////
//

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

  const restart_sound = new Audio('/audio/restart-recycle.mp3');
  restart_sound.play();
  restart_sound.volume = 0.3;
}

////toggle between rank and the nice gif----------------------------------------------//
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

  const rank_sound = new Audio('/audio/rank-information-bar.mp3');
  rank_sound.play();
  rank_sound.volume = 0.3;
}

rightBarDis2.style.display = "none";

// function saveData(){
//   localStorage.setItem("data", finalScore);
// }

// function showSaved(){
//   listContainer.innerHTML = localStorage.getItem("data");
// }

// showSaved();


//////////////////

const winImage = document.getElementById("win-window");
const displayScore = document.getElementById("score-display");
const scoreContainer = document.getElementById("right-bar-display-2");

// function completedCheck(length){

//   score = 8; /* For testing, delete after */
//   console.log(score === length/2);
//   if (score === length/2){
//     console.log("win");
//     winImage.style.display = "block";
//     finalScore = score*1000 - timerSeconds*100;

//     // blurScreen = document.getElementById("container");
//     // blurScreen.style.filter = "blur(10px)";
//     // setTimeout(unBlur, 10000);

//     displayScore.innerHTML = finalScore + " Points!";
//     const newScore = document.createElement("li");
//     newScore.innerHTML = ` `+finalScore+` Points!`;
//     scoreContainer.appendChild(newScore);
    
//   }
//   else{
//     winImage.style.display = "none";
//   }
// }

// function unBlur(){
//   blurScreen.style.filter = "none";
// }

// this is the code where I asked chatgpt to do one thing and it decided to do everything


let scoreList = [];
let timedList = [];

function completedCheck(length) {
  // this is changed for testing original : score === length / 2
  if (score === 1) {
    winImage.style.display = "block";
    
    // score_algorithmic()

    // timerSeconds = 600000;
    finalScore = (score * 1000 /timerSeconds) + 1000 ;
    finalScore = Math.round(finalScore);
    displayScore.innerHTML = finalScore + " Points!";

    // Stop the timer interval

    const win_sound = new Audio('/audio/win-tada.mp3');
    win_sound.play();
    win_sound.volume = 0.1;

    display_score_rank(finalScore,timerSeconds);
    counting = false;
    score = 0;
  } else {
    winImage.style.display = "none";
  }
}


function display_score_rank(finalScore,timerSeconds){
    scoreList.push(finalScore);
    timedList.push(timerSeconds);
    scoreContainer.innerHTML = ""
    scoreList.sort(function(a, b) {
      return b - a;
    });

    for (i=0; i<scoreList.length; i++){
      // for (x=0; x<timedList.length; x++){
        const newScore = document.createElement("li");
        newScore.innerHTML = ` ` + scoreList[i] + ` Points!` + formatTime(timedList[i]);
        scoreContainer.appendChild(newScore);
      // }  
  }
}