let intervalId;
let remainingTime;
let pausedTime;
let bellFinish = false;
let bellStartFinish = false;
let silence = false;
let showBellConfigIsVisible = false;

document.addEventListener('DOMContentLoaded', () => {
    const startPauseButton = document.querySelector('.control__play-pause');
    const stopButton = document.querySelector('.control__stop');
    const bellsLink = document.querySelector('#bells');
    const timerLink = document.querySelector('#timer');
    startPauseButton.addEventListener('click', startTimer);
    stopButton.addEventListener('click', stopTimer);
    bellsLink.addEventListener('click', showBellConfig)
    // timerLink.addEventListener('click', showTimer)
    timerLink.addEventListener('click', () => console.log("Has hecho click en el enlace de timer!")
    )
});


function getTime() {

    const minutesInput = parseInt(document.querySelector('.digits_minutes').value);
    const secondsInput = parseInt(document.querySelector('.digits_seconds').value);

    // validacion?

    const totalTime = ((minutesInput * 60) + secondsInput) * 1000;
    return totalTime;

}


function startTimer() {

    const startPauseButton = document.querySelector('.control__play-pause');

    if (intervalId) {
        pauseTimer();
        startPauseButton.classList.remove('control__pause');
        startPauseButton.querySelector('span').textContent = 'Play';
        startPauseButton.classList.remove('fa-pause');
        startPauseButton.classList.add('fa-play');
    } else {

        let totalTime = pausedTime || getTime()

        remainingTime = totalTime;

        startPauseButton.classList.add('control__pause');
        startPauseButton.classList.remove('fa-play');
        startPauseButton.classList.add('fa-pause');
        startPauseButton.querySelector('span').textContent = 'Pause';

        playBell();


        intervalId = setInterval(() => {
            remainingTime -= 1000;

            if (remainingTime <= 0) {
                clearInterval(intervalId)
                intervalId = null;
                // llamar a funcion que se ejecuta al terminar una sesion
                remainingTime = null;


            } else {
                updateDisplay(remainingTime);
            }

        }, 1000);
    }
}

function updateDisplay(miliseconds) {

    const totalSeconds = Math.floor(miliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    document.querySelector('.digits_minutes').value = minutes;
    document.querySelector('.digits_seconds').value = seconds;
}


function pauseTimer() {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
        pausedTime = remainingTime;
    }
}


function stopTimer() {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }
    remainingTime = null;
    pausedTime = null;

    document.querySelector('.digits_minutes').value = 15;
    document.querySelector('.digits_seconds').value = 0;

    const startPauseButton = document.querySelector('.control__play-pause');

    startPauseButton.classList.remove('fa-pause');
    startPauseButton.classList.add('fa-play');
}


function playBell() {
    const bellSound = new Audio('../audio/bells/meditation-bell.mp3');
    bellSound.play();
}

function updateBellOptions(option) {
    bellFinish = (option === 'finish');
    bellStartFinish = (option === 'both');
    silence = (option === 'silence');
}

function showBellConfig(event) {
    event.preventDefault();
    const timerContainer = document.querySelector('.timer_container');
    const timer = document.querySelector('.timer');
    const music = document.querySelector('.music');
    const control = document.querySelector('.control');

    timer.remove();
    music.remove();
    control.remove();

    timerContainer.innerHTML += `
    <div class="bell-options">
    <h2>Set when bell is played:</h2>
        <ul>
            <li><input type="radio" name="options" id="start" checked>Play at start (by default)</li>
            <li><input type="radio" name="options" id="finish">Play at finish</li>
            <li><input type="radio" name="options" id="both">Play at start and finish</li>
            <li><input type="radio" name="options" id="silence">Don’t play bell</li>
        </ul>
    </div>
`;
    const finishRadio = document.querySelector('#finish');
    const bothRadio = document.querySelector('#both');
    const silenceRadio = document.querySelector('#silence');

    finishRadio.addEventListener('change', () => updateBellOptions('finish'));
    bothRadio.addEventListener('change', () => updateBellOptions('both'));
    silenceRadio.addEventListener('change', () => updateBellOptions('silence'))

    showBellConfigIsVisible = true;

}

function showTimer() {

    console.log("Has hecho click en el enlace del timer");

    if (showBellConfigIsVisible) {
        let bellOptionsDiv = document.querySelector('.bell-options')
        bellOptionsDiv.remove();
    }
}