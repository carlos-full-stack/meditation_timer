let intervalId;
let remainingTime;
let pausedTime;
let bellFinish = false;
let bellStartFinish = false;
let silence = false;
let currentPage = 'timer';
let backgroundMusic;

document.addEventListener('DOMContentLoaded', () => {
    const startPauseButton = document.querySelector('.control__play-pause');
    const stopButton = document.querySelector('.control__stop');
    const bellsLink = document.querySelector('#bells');
    const timerLink = document.querySelector('#timer');
    const musicPlaylistLink = document.querySelector('#music-playlist');
    const increaseTimeLink = document.querySelector('.timer__increase-time');
    const decreaseTimeLink = document.querySelector('.timer__decrease-time');
    startPauseButton.addEventListener('click', startTimer);
    stopButton.addEventListener('click', stopTimer);
    bellsLink.addEventListener('click', showBellConfig)
    timerLink.addEventListener('click', showTimer)
    musicPlaylistLink.addEventListener('click', showMusicPlaylist)
    increaseTimeLink.addEventListener('click', increaseTime)
    decreaseTimeLink.addEventListener('click', decreaseTime)
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

        if (!silence && !bellFinish) {

            playBell();
        }

        if (backgroundMusic) playBackgroundMusic(backgroundMusic);

        intervalId = setInterval(() => {
            remainingTime -= 1000;

            if (remainingTime <= 0) {
                clearInterval(intervalId)
                intervalId = null;
                remainingTime = null;

                updateDisplay(remainingTime);

                if (bellFinish || bellStartFinish) {

                    playBell();
                }

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
    document.querySelector('.digits_seconds').value = '00';

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

    if (currentPage !== 'bellConfig') {

        if (currentPage === 'timer') {

            const timer = document.querySelector('.timer');
            const music = document.querySelector('.music');
            const control = document.querySelector('.control');

            if (timer) { timer.remove() };
            if (music) { music.remove() };
            if (control) { control.remove() };

        }

        if (currentPage === 'musicPlaylist') {

            let musicplaylistDiv = document.querySelector('.music-playlist');
            if (musicplaylistDiv) musicplaylistDiv.remove();
        }

        const timerContainer = document.querySelector('.timer_container');

        timerContainer.insertAdjacentHTML('beforeend', `
        <div class="bell-options">
            <h2>Set when bell is played:</h2>
            <ul>
                <li><input type="radio" name="options" id="start" checked>Play only at start (by default)</li>
                <li><input type="radio" name="options" id="finish">Play only at finish only</li>
                <li><input type="radio" name="options" id="both">Play at start and finish</li>
                <li><input type="radio" name="options" id="silence">Don’t play bell</li>
            </ul>
        </div>
    `);

        const finishRadio = document.querySelector('#finish');
        const bothRadio = document.querySelector('#both');
        const silenceRadio = document.querySelector('#silence');

        finishRadio.addEventListener('change', () => updateBellOptions('finish'));
        bothRadio.addEventListener('change', () => updateBellOptions('both'));
        silenceRadio.addEventListener('change', () => updateBellOptions('silence'))

        currentPage = 'bellConfig';

    }
}

function showTimer() {

    if (currentPage !== 'timer') {

        if (currentPage === 'bellConfig') {

            let bellOptionsDiv = document.querySelector('.bell-options');
            if (bellOptionsDiv) bellOptionsDiv.remove();
        }

        if (currentPage === 'musicPlaylist') {

            let musicplaylistDiv = document.querySelector('.music-playlist');
            if (musicplaylistDiv) musicplaylistDiv.remove();
        }


        const timerContainer = document.querySelector('.timer_container');

        timerContainer.insertAdjacentHTML('beforeend', `
        <div class="timer">
            <div class="timer__increase-time">+</div>
            <div class="digits">
                <input type="number" class="digits_minutes" min="0" max="60" value="15"><span>:</span><input
                    type="number" class="digits_seconds" min="0" max="60" value="00">
            </div>
            <div class="timer__decrease-time">-</div>
        </div>
        <div class="music">
            <i class="music__icon fa-brands fa-itunes-note"></i>
            <h2 class="music__title">Song name</h2>
        </div>
        <div class="control">
            <i class="control__stop fa-solid fa-stop fa-2x"></i>
            <i class="control__play-pause control__play fa-solid fa-play fa-2x"><span>Play</span></i>
            <i class="control__reload fa-solid fa-rotate-right fa-2x"></i>
        </div>
        `);

        const startPauseButton = document.querySelector('.control__play-pause');
        const stopButton = document.querySelector('.control__stop');
        const increaseTimeLink = document.querySelector('.timer__increase-time');
        const decreaseTimeLink = document.querySelector('.timer__decrease-time');
        increaseTimeLink.addEventListener('click', increaseTime);
        decreaseTimeLink.addEventListener('click', decreaseTime);
        startPauseButton.addEventListener('click', startTimer);
        stopButton.addEventListener('click', stopTimer);


        currentPage = 'timer';

    }

}
function showMusicPlaylist(event) {

    if (currentPage !== 'musicPlaylist') {

        if (currentPage === 'bellConfig') {

            let bellOptionsDiv = document.querySelector('.bell-options')
            if (bellOptionsDiv) bellOptionsDiv.remove();
        }

        if (currentPage === 'timer') {

            const timer = document.querySelector('.timer');
            const music = document.querySelector('.music');
            const control = document.querySelector('.control');

            if (timer) timer.remove();
            if (music) music.remove();
            if (control) control.remove();

        }


        const timerContainer = document.querySelector('.timer_container');

        timerContainer.insertAdjacentHTML('beforeend', `
                    <div class="music-playlist">
                        <h2>Set background music:</h2>
                        <div class="playlist-container">
            <div id="track1">
                <img src="./images/audio-covers/relaxing-peace.jpg" alt="">
                <h3>Relaxing peace</h3>
                <span>Soothing melodies.</span>
            </div>
            <div id="track2">
                <img src="./images/audio-covers/relaxing-peace.jpg" alt="">
                <h3>Relaxing peace</h3>
                <span>Soothing melodies.</span>
            </div>
            <div id="track3">
                <img src="./images/audio-covers/relaxing-peace.jpg" alt="">
                <h3>Relaxing peace</h3>
                <span>Soothing melodies.</span>
            </div>
            <div id="track4">
                <img src="./images/audio-covers/relaxing-peace.jpg" alt="">
                <h3>Relaxing peace</h3>
                <span>Soothing melodies.</span>
            </div>
        </div>
            </div>
        `);

        const track1 = document.querySelector('#track1');
        const track2 = document.querySelector('#track2');
        const track3 = document.querySelector('#track3');
        const track4 = document.querySelector('#track4');

        track1.addEventListener('click', () => {
            backgroundMusic = 'track1';
        });
        track2.addEventListener('click', () => {
            backgroundMusic = 'track2';
        });
        track3.addEventListener('click', () => {
            backgroundMusic = 'track3';
        });
        track4.addEventListener('click', () => {
            backgroundMusic = 'track4';
        });


    }

    currentPage = 'musicPlaylist';

}


function playBackgroundMusic(track) {
    switch (track) {
        case 'track1':
            audio = new Audio('../audio/music/relaxing-peace.mp3');
            audio.play();
            break;

        default:
            break;
    }
}

function increaseTime() {
    document.querySelector('.digits_minutes').value++;
}
function decreaseTime() {
    document.querySelector('.digits_minutes').value--;
}