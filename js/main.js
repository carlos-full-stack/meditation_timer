let intervalId;
let remainingTime;
let pausedTime;
let bellStart;
let bellFinish;
let bellStartFinish;
let silence;
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
        <li>
            <label for="start" class="option-container">
                <i class="fa-solid fa-hourglass-start"></i>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                    <path d="M208 16c0-8.8 7.2-16 16-16s16 7.2 16 16l0 16.8c80.9 8 144 76.2 144 159.2l0 29.1c0 43.7 17.4 85.6 48.3 116.6l2.8 2.8c8.3 8.3 13 19.6 13 31.3c0 24.5-19.8 44.3-44.3 44.3L44.3 416C19.8 416 0 396.2 0 371.7c0-11.7 4.7-23 13-31.3l2.8-2.8C46.6 306.7 64 264.8 64 221.1L64 192c0-83 63.1-151.2 144-159.2L208 16zm16 48C153.3 64 96 121.3 96 192l0 29.1c0 52.2-20.7 102.3-57.7 139.2L35.6 363c-2.3 2.3-3.6 5.4-3.6 8.7c0 6.8 5.5 12.3 12.3 12.3l359.4 0c6.8 0 12.3-5.5 12.3-12.3c0-3.3-1.3-6.4-3.6-8.7l-2.8-2.8c-36.9-36.9-57.7-87-57.7-139.2l0-29.1c0-70.7-57.3-128-128-128zM193.8 458.7c4.4 12.4 16.3 21.3 30.2 21.3s25.8-8.9 30.2-21.3c2.9-8.3 12.1-12.7 20.4-9.8s12.7 12.1 9.8 20.4C275.6 494.2 251.9 512 224 512s-51.6-17.8-60.4-42.7c-2.9-8.3 1.4-17.5 9.8-20.4s17.5 1.4 20.4 9.8z"/>
                </svg>
                <input type="radio" name="options" id="start" checked>
                <span class="option-label">Start</span>
            </label>
        </li>
        <li>
            <label for="finish" class="option-container">
                <i class="fa-solid fa-hourglass-end"></i>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                    <path d="M208 16c0-8.8 7.2-16 16-16s16 7.2 16 16l0 16.8c80.9 8 144 76.2 144 159.2l0 29.1c0 43.7 17.4 85.6 48.3 116.6l2.8 2.8c8.3 8.3 13 19.6 13 31.3c0 24.5-19.8 44.3-44.3 44.3L44.3 416C19.8 416 0 396.2 0 371.7c0-11.7 4.7-23 13-31.3l2.8-2.8C46.6 306.7 64 264.8 64 221.1L64 192c0-83 63.1-151.2 144-159.2L208 16zm16 48C153.3 64 96 121.3 96 192l0 29.1c0 52.2-20.7 102.3-57.7 139.2L35.6 363c-2.3 2.3-3.6 5.4-3.6 8.7c0 6.8 5.5 12.3 12.3 12.3l359.4 0c6.8 0 12.3-5.5 12.3-12.3c0-3.3-1.3-6.4-3.6-8.7l-2.8-2.8c-36.9-36.9-57.7-87-57.7-139.2l0-29.1c0-70.7-57.3-128-128-128zM193.8 458.7c4.4 12.4 16.3 21.3 30.2 21.3s25.8-8.9 30.2-21.3c2.9-8.3 12.1-12.7 20.4-9.8s12.7 12.1 9.8 20.4C275.6 494.2 251.9 512 224 512s-51.6-17.8-60.4-42.7c-2.9-8.3 1.4-17.5 9.8-20.4s17.5 1.4 20.4 9.8z"/>
                </svg>
                <input type="radio" name="options" id="finish">
                <span class="option-label">End</span>
            </label>
        </li>
        <li>
            <label for="both" class="option-container">
                <i class="fa-solid fa-hourglass-start"></i>
                <i class="fa-solid fa-hourglass-end"></i>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                    <path d="M208 16c0-8.8 7.2-16 16-16s16 7.2 16 16l0 16.8c80.9 8 144 76.2 144 159.2l0 29.1c0 43.7 17.4 85.6 48.3 116.6l2.8 2.8c8.3 8.3 13 19.6 13 31.3c0 24.5-19.8 44.3-44.3 44.3L44.3 416C19.8 416 0 396.2 0 371.7c0-11.7 4.7-23 13-31.3l2.8-2.8C46.6 306.7 64 264.8 64 221.1L64 192c0-83 63.1-151.2 144-159.2L208 16zm16 48C153.3 64 96 121.3 96 192l0 29.1c0 52.2-20.7 102.3-57.7 139.2L35.6 363c-2.3 2.3-3.6 5.4-3.6 8.7c0 6.8 5.5 12.3 12.3 12.3l359.4 0c6.8 0 12.3-5.5 12.3-12.3c0-3.3-1.3-6.4-3.6-8.7l-2.8-2.8c-36.9-36.9-57.7-87-57.7-139.2l0-29.1c0-70.7-57.3-128-128-128zM193.8 458.7c4.4 12.4 16.3 21.3 30.2 21.3s25.8-8.9 30.2-21.3c2.9-8.3 12.1-12.7 20.4-9.8s12.7 12.1 9.8 20.4C275.6 494.2 251.9 512 224 512s-51.6-17.8-60.4-42.7c-2.9-8.3 1.4-17.5 9.8-20.4s17.5 1.4 20.4 9.8z"/>
                </svg>
                <input type="radio" name="options" id="both">
                <span class="option-label">Start and end</span>
            </label>
        </li>
        <li>
            <label for="silence" class="option-container">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                    <path d="M208 16c0-8.8 7.2-16 16-16s16 7.2 16 16l0 16.8c80.9 8 144 76.2 144 159.2l0 29.1c0 43.7 17.4 85.6 48.3 116.6l2.8 2.8c8.3 8.3 13 19.6 13 31.3c0 24.5-19.8 44.3-44.3 44.3L44.3 416C19.8 416 0 396.2 0 371.7c0-11.7 4.7-23 13-31.3l2.8-2.8C46.6 306.7 64 264.8 64 221.1L64 192c0-83 63.1-151.2 144-159.2L208 16zm16 48C153.3 64 96 121.3 96 192l0 29.1c0 52.2-20.7 102.3-57.7 139.2L35.6 363c-2.3 2.3-3.6 5.4-3.6 8.7c0 6.8 5.5 12.3 12.3 12.3l359.4 0c6.8 0 12.3-5.5 12.3-12.3c0-3.3-1.3-6.4-3.6-8.7l-2.8-2.8c-36.9-36.9-57.7-87-57.7-139.2l0-29.1c0-70.7-57.3-128-128-128zM193.8 458.7c4.4 12.4 16.3 21.3 30.2 21.3s25.8-8.9 30.2-21.3c2.9-8.3 12.1-12.7 20.4-9.8s12.7 12.1 9.8 20.4C275.6 494.2 251.9 512 224 512s-51.6-17.8-60.4-42.7c-2.9-8.3 1.4-17.5 9.8-20.4s17.5 1.4 20.4 9.8z"/>
                    <path d="M64 64L384 448" stroke="black" stroke-width="16" stroke-linecap="round"/>
                </svg>
                <input type="radio" name="options" id="silence">
                <span class="option-label">Silence</span>
            </label>
        </li>
    </ul>
</div>
    `);
        const bellOptions = document.querySelector('.bell-options')
        const startRadio = document.querySelector('#start');
        const finishRadio = document.querySelector('#finish');
        const bothRadio = document.querySelector('#both');
        const silenceRadio = document.querySelector('#silence');

        const optionContainers = document.querySelectorAll('.option-container');


        if (bellStart) {
            startRadio.closest('.option-container').classList.add('option-container--active');
        } else if (bellFinish) {
            finishRadio.closest('.option-container').classList.add('option-container--active');
        } else if (bellStartFinish) {
            bothRadio.closest('.option-container').classList.add('option-container--active');
        } else if (silence) {
            silenceRadio.closest('.option-container').classList.add('option-container--active');
        }


        if (startRadio) startRadio.addEventListener('change', () => {
            optionContainers.forEach(option => {
                option.classList.remove('option-container--active');
            });
            updateBellOptions('start')
            startRadio.closest('.option-container').classList.add('option-container--active');
        });
        if (finishRadio) finishRadio.addEventListener('change', () => {
            optionContainers.forEach(option => {
                option.classList.remove('option-container--active');
            });
            updateBellOptions('finish')
            finishRadio.closest('.option-container').classList.add('option-container--active');
        });
        if (bothRadio) bothRadio.addEventListener('change', () => {
            optionContainers.forEach(option => {
                option.classList.remove('option-container--active');
            });
            updateBellOptions('both')
            bothRadio.closest('.option-container').classList.add('option-container--active');
        });
        if (silenceRadio) silenceRadio.addEventListener('change', () => {
            optionContainers.forEach(option => {
                option.classList.remove('option-container--active');
            });
            updateBellOptions('silence')
            silenceRadio.closest('.option-container').classList.add('option-container--active');

        });




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