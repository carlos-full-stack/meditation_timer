let intervalId;
let remainingTime;
let pausedTime;
let bellStart;
let bellFinish = false;
let bellStartFinish = false;
let silence = false;
let currentPage = 'timer';
let music;
let songtitle;
let bellSound;

document.addEventListener('DOMContentLoaded', () => {
    const startPauseButton = document.querySelector('.control__play-pause');
    const stopButton = document.querySelector('.control__stop');
    const bellsLink = document.querySelector('#bells');
    const timerLink = document.querySelector('#timer');
    const musicPlaylistLink = document.querySelector('#playlist');
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
        stopBell();
        pauseMusic();

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

        playMusic();


        if (!pausedTime) {

            if (!silence && !bellFinish) { // Play the bell if is not silence or played at the end

                playBell();
            }

            if (music) playMusic(music);
        }

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

    if (minutes) document.querySelector('.digits_minutes').value = minutes;
    if (seconds) document.querySelector('.digits_seconds').value = seconds;
}
function pauseTimer() {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
        pausedTime = remainingTime;

    }
}
function stopTimer() {

    stopBell();


    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }
    remainingTime = null;
    pausedTime = null;

    document.querySelector('.digits_minutes').value = 15;
    document.querySelector('.digits_seconds').value = '00';

    const startPauseButton = document.querySelector('.control__play-pause');

    if (startPauseButton) {
        startPauseButton.querySelector('span').textContent = 'Play';
        startPauseButton.classList.remove('fa-pause'); startPauseButton.classList.add('fa-play');
    }

    stopMusic();
}
function playBell() {

    bellSound = new Audio('../audio/bells/meditation-bell.mp3');
    bellSound.play();
}
function stopBell() {
    if (bellSound && !bellSound.ended) {
        bellSound.pause();
        bellSound.currentTime = 0;
    }
}
function updateBellOptions(option) {
    bellStart = (option === 'start');
    bellFinish = (option === 'finish');
    bellStartFinish = (option === 'both');
    silence = (option === 'silence');

}
function showBellConfig(event) {

    if (currentPage !== 'bellConfig') {

        if (currentPage === 'timer') {

            const timerContainerDiv = document.querySelector('.timer-container');
            if (timerContainerDiv) timerContainerDiv.remove();

        }

        if (currentPage === 'musicPlaylist') {

            let musicplaylistDiv = document.querySelector('.playlist');
            if (musicplaylistDiv) musicplaylistDiv.remove();
        }

        const container = document.querySelector('.container');

        container.insertAdjacentHTML('beforeend', `
        <div class="bell-options">
            <ul>
                <li><input type="radio" name="options" id="start" checked>Play only at start (by default)</li>
                <li><input type="radio" name="options" id="finish">Play only at finish only</li>
                <li><input type="radio" name="options" id="both">Play at start and finish</li>
                <li><input type="radio" name="options" id="silence">Don’t play bell</li>
            </ul>
        </div>
    `);
        const bellOptions = document.querySelector('.bell-options')
        const startRadio = document.querySelector('#start');
        const finishRadio = document.querySelector('#finish');
        const bothRadio = document.querySelector('#both');
        const silenceRadio = document.querySelector('#silence');


        if (bellStart) {
            startRadio.checked = true;
        } else if (bellFinish) {
            finishRadio.checked = true;
        } else if (bellStartFinish) {
            bothRadio.checked = true;
        } else if (silence) {
            silenceRadio.checked = true;
        }


        if (startRadio) startRadio.addEventListener('change', () => updateBellOptions('start'));
        if (finishRadio) finishRadio.addEventListener('change', () => updateBellOptions('finish'));
        if (bothRadio) bothRadio.addEventListener('change', () => updateBellOptions('both'));
        if (silenceRadio) silenceRadio.addEventListener('change', () => updateBellOptions('silence'))


        applyTransition(bellOptions);

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

            let musicplaylistDiv = document.querySelector('.playlist');
            if (musicplaylistDiv) musicplaylistDiv.remove();
        }


        const container = document.querySelector('.container');

        container.insertAdjacentHTML('beforeend', `
                    <div class="timer-container">
            <div class="timer">
                <div class="timer__increase-time">+</div>
                <div class="digits">
                    <input type="number" class="digits_minutes" min="0" max="60" value="15"><span>:</span><input
                        type="number" class="digits_seconds" min="0" max="60" value="00">
                </div>
                <div class="timer__decrease-time">-</div>
            </div>
            <div class="song">
                <i class="song__icon fa-brands fa-itunes-note"></i>
                <h2 class="song__title">No song selected</h2>
            </div>
            <div class="control">
                <i class="control__stop fa-solid fa-stop fa-2x"></i>
                <i class="control__play-pause control__play fa-solid fa-play fa-2x"><span>Play</span></i>
                <i class="control__reload fa-solid fa-rotate-right fa-2x"></i>
            </div>
        </div>
        `);

        const startPauseButton = document.querySelector('.control__play-pause');
        const stopButton = document.querySelector('.control__stop');
        const increaseTimeLink = document.querySelector('.timer__increase-time');
        const decreaseTimeLink = document.querySelector('.timer__decrease-time');
        const timerContainerDiv = document.querySelector('.timer-container');
        const songDiv = document.querySelector('.song');
        increaseTimeLink.addEventListener('click', increaseTime);
        decreaseTimeLink.addEventListener('click', decreaseTime);
        startPauseButton.addEventListener('click', startTimer);
        stopButton.addEventListener('click', stopTimer);


        if (songtitle) {
            showSongTitle(songtitle);

            if (songDiv) {
                songDiv.classList.add('song--hidden');
                setTimeout(() => {
                    songDiv.classList.add('song--active');
                }, 200);
            }
        }


        applyTransition(timerContainerDiv);
    }




    currentPage = 'timer';

}
function showMusicPlaylist(event) {

    if (currentPage !== 'musicPlaylist') {

        if (currentPage === 'bellConfig') {

            let bellOptionsDiv = document.querySelector('.bell-options')
            if (bellOptionsDiv) bellOptionsDiv.remove();
        }

        if (currentPage === 'timer') {

            const timerContainerDiv = document.querySelector('.timer-container');
            if (timerContainerDiv) timerContainerDiv.remove();

        }


        const container = document.querySelector('.container');

        container.insertAdjacentHTML('beforeend', `
                    <div class="playlist">
                        <div class="playlist__tracks">
            <div class="track" id="track1">
                <img class="track__img" src="./images/audio-covers/zen.jpg" alt="">
                <h3 class="track__title">That Zen Moment</h3>
            </div>
            <div class="track" id="track2">
                <img class="track__img" src="./images/audio-covers/river.jpg" alt="">
                <h3 class="track__title">River Flute</h3>
            </div>
            <div class="track" id="track3">
                <img class="track__img" src="./images/audio-covers/mindful.jpg" alt="">
                <h3 class="track__title">Ever Mindful</h3>
            </div>
            <div class="track" id="track4">
                <img class="track__img" src="./images/audio-covers/relaxation.jpg" alt="">
                <h3 class="track__title">Ethereal Relaxation</h3>
            </div>
        </div>
        `);

        const track1 = document.querySelector('#track1');
        const track2 = document.querySelector('#track2');
        const track3 = document.querySelector('#track3');
        const track4 = document.querySelector('#track4');
        const tracksImg = document.querySelectorAll('.track__img');
        const playlistDiv = document.querySelector('.playlist');


        if (music == 'track1') {
            track1.querySelector('img').classList.add('track__img--active');
        } else if (music == 'track2') {
            track2.querySelector('img').classList.add('track__img--active');
        } else if (music == 'track3') {
            track3.querySelector('img').classList.add('track__img--active');
        } else if (music == 'track4') {
            track4.querySelector('img').classList.add('track__img--active');
        }


        if (track1) track1.addEventListener('click', () => {

            const imgElement = track1.querySelector('img');

            if (!music) {
                if (imgElement) imgElement.classList.add('track__img--active');
                music = 'track1';
                songtitle = 'That Zen Moment';


            } else {
                tracksImg.forEach(tracksImg => {
                    tracksImg.classList.remove('track__img--active');
                });
                music = null;
                songtitle = 'No song selected';
            }
        });

        if (track2) track2.addEventListener('click', () => {

            const imgElement = track2.querySelector('img');
            if (!music) {

                if (imgElement) imgElement.classList.add('track__img--active');
                music = 'track2';
                songtitle = 'River Flute';

            } else {
                tracksImg.forEach(tracksImg => {
                    tracksImg.classList.remove('track__img--active');
                });
                music = null;
                songtitle = 'No song selected';
            }
        });

        if (track3) track3.addEventListener('click', () => {

            const imgElement = track3.querySelector('img');
            if (!music) {
                if (imgElement) imgElement.classList.add('track__img--active');
                music = 'track3';
                songtitle = 'Ever Mindful';

            } else {
                tracksImg.forEach(tracksImg => {
                    tracksImg.classList.remove('track__img--active');
                });
                music = null;
                songtitle = 'No song selected';
            }

        });

        if (track4) track4.addEventListener('click', () => {

            const imgElement = track4.querySelector('img');

            if (!music) {
                if (imgElement) imgElement.classList.add('track__img--active');
                music = 'track4';
                songtitle = 'Ethereal Relaxation';
            } else {
                tracksImg.forEach(tracksImg => {
                    tracksImg.classList.remove('track__img--active');
                });
                music = null;
                songtitle = 'No song selected';
            }
        });

        applyTransition(playlistDiv);

    }

    currentPage = 'musicPlaylist';

}
function playMusic(track) {

    if (music && music.paused) {
        music.play();
    } else {

        switch (track) {
            case 'track1':
                music = new Audio('../audio/music/That%20Zen%20Moment.mp3');
                if (music) music.play();
                break;
            case 'track2':
                music = new Audio('../audio/music/River%20Flute.mp3');
                if (music) music.play();

                break;
            case 'track3':
                music = new Audio('../audio/music/Ever%20Mindful.mp3');
                if (music) music.play();
                break;
            case 'track4':
                music = new Audio('../audio/music/Ethereal%20Relaxation.mp3');
                if (music) music.play();
                break;

            default:
                break;
        }
    }

}
function pauseMusic() {

    if (music) music.pause();
}
function stopMusic() {
    if (music) {
        music.pause();
        music.currentTime = 0;
        music = null;
    }
}
function showSongTitle(songtitle) {

    const songTitleH2 = document.querySelector('.song__title');
    if (songTitleH2) songTitleH2.textContent = songtitle;

}
function increaseTime() {
    document.querySelector('.digits_minutes').value++;
}
function decreaseTime() {
    document.querySelector('.digits_minutes').value--;
}

function applyTransition(content) {
    if (content) {
        content.classList.add('content--hidden');
        setTimeout(() => {
            content.classList.add('content--active');
        }, 200);
    }
}