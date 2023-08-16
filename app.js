let fixedHour = 11;      // Fixed hour (1-12)
let fixedMinute = 0;     // Fixed minutes (0, 5, 10, ..., 55 in increments of 5)
let gameStatus = false;
let points = 0;
let level = 0;
const levelNb = 10;       // Total number of levels
let userHour;
let userMinute;
let mode;
const startButton = document.querySelector('#start');
const chronoDisplay = document.querySelector('#chrono');
const submitButton = document.querySelector('#submit');
const clockContainer = document.querySelector('#clock');
const responseDiv = document.querySelector('#response');
const optionsDiv = document.querySelector('#options');

startButton.addEventListener('click', function() {
  console.log("Game started");
  startButton.remove();
  responseDiv.classList.remove('hidden');
  clockContainer.classList.remove('hidden');
  document.querySelector('.all').classList.remove('hidden');
  gameStatus = true;
  startTimer(600);
  nextLevel();
});

function startTimer(seconds) {
  let remainingSeconds = seconds;

  function updateDisplay() {
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    chronoDisplay.innerHTML = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  const timerInterval = setInterval(() => {
    if (remainingSeconds > 0) {
      remainingSeconds--;
      updateDisplay();
    } else {
      clearInterval(timerInterval);
      console.log("Time's up!");
      endGame(1);
    }
  }, 1000);
}

submitButton.addEventListener('click', function() {
  if (gameStatus) {
    userHour = parseInt(document.querySelector('#h').value);
    userMinute = parseInt(document.querySelector('#m').value);
    if (userHour !== NaN && userMinute !== NaN) {
      console.log(userHour, userMinute);
      if (userHour === fixedHour && userMinute === fixedMinute) {
        console.log("Correct!");
        points += 100;
        nextLevel();
      } else {
        console.log(`Game over. Points: ${points}`);
        endGame(0, [fixedHour, fixedMinute]);
      }
    }
  }
});

function endGame(reason, values = null) {
  gameStatus = false;
  chronoDisplay.remove();
  clockContainer.remove();
  document.querySelector(".all").remove();
  if (reason === 0) {
    responseDiv.innerHTML = `<div id="end"><p class='end-main'>Game over</p><p class='end-info'>The answer was ${values[0]}:${values[1]}</p><p class='end-info'>Points: ${points}</p>`;
  } else if (reason === 1) {
    responseDiv.innerHTML = `<div id="end"><p class='end-main'>Time's up!</p><p class='end-info'>Points: ${points}</p>`;
  } else if (reason === 2) {
    const rs = chronoDisplay.innerHTML;
    const [minutes, seconds] = rs.split(':');
    const totalMilliseconds = (parseInt(minutes) * 60 + parseInt(seconds)) * 1000;
    const bonus = totalMilliseconds / 10;

    responseDiv.innerHTML = `<div id="end"><p class='end-main'>You win!</p><p class='end-info'>Points: ${points}</p><p class='end-info'>Bonus: ${bonus}</p><p class='end-total'>Total: ${points + bonus}</p>`;
  }
}

function updateClock() {
  const fixedDate = new Date();
  fixedDate.setHours(fixedHour);
  fixedDate.setMinutes(fixedMinute);

  const hours24 = fixedDate.getHours();
  const hours12 = hours24 > 12 ? hours24 - 12 : hours24;
  const minutes = fixedDate.getMinutes();

  const hands = [
    {
      hand: 'hours',
      angle: (hours12 * 30) + (minutes / 2),
    },
    {
      hand: 'minutes',
      angle: minutes * 6,
    },
  ];

  for (const hand of hands) {
    const elements = document.querySelectorAll(`.${hand.hand}`);
    for (const element of elements) {
      element.style.transform = `rotate(${hand.angle}deg)`;
    }
  }
}

function nextLevel() {
  if (level <= levelNb) {
    level++;
    const randomHour = Math.floor(Math.random() * 12) + 1;
    const randomMinute = Math.floor(Math.random() * 12) * 5;
    
    fixedHour = randomHour;
    fixedMinute = randomMinute;
    updateClock();
  } else {
    endGame(2);
  }
}
// Modes
const qcm = document.querySelector('#qcm');
const classic = document.querySelector('#classic');
const hard = document.querySelector('#hard');
const custom = document.querySelector('#custom');
let modes = [qcm, classic, hard, custom]
let selected = modes[0]
selected.classList.add('selected')
modes.forEach(mode => {
  mode.addEventListener('click', function(){
    qcm.classList.remove('selected')
    classic.classList.remove('selected')
    hard.classList.remove('selected')
    custom.classList.remove('selected')
    mode.classList.add('selected')  })
    selected = mode;
})

// Initial call to nextLevel() to update the clock to a random time
nextLevel();
