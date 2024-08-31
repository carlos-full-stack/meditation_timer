let intervalId;
let remainingTime;
let pausedTime;

document.addEventListener('DOMContentLoaded', () => {
    const startPauseButton = document.querySelector('.control__play-pause');
    const stopButton = document.querySelector('.control__stop');
    const bellsLink = document.querySelector('#bells');
    startPauseButton.addEventListener('click', startTimer);
    stopButton.addEventListener('click', stopTimer);
    bellsLink.addEventListener('click', showBellConfig)

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

function showBellConfig(event) {
    event.preventDefault();
    const timerContainer = document.querySelector('.timer_container');
    const timer = document.querySelector('.timer');
    const music = document.querySelector('.music');
    const control = document.querySelector('.control');

    timer.remove();
    music.remove();
    control.remove();

    timerContainer.innerHTML += '<span>Set when bell is played:<ul><li>Play at start</li><li>Play at finish</li><li>Play at start and finish</li><li>Don´t play bell</li></ul>'



}