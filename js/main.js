let intervalId;
let remainingTime;
let pausedTime = null;
let currentPage = 'timer';
let music = null;
let selectedSong = {};
let bellSound;
let bellTime = 'start';

document.addEventListener('DOMContentLoaded', () => {
    const startPauseButton = document.querySelector('.control__play-pause');
    const stopButton = document.querySelector('.control__stop');
    const reloadButton = document.querySelector('.control__reload');
    const bellsLink = document.querySelector('#bells');
    const timerLink = document.querySelector('#timer');
    const musicPlaylistLink = document.querySelector('#playlist');
    const increaseTimeLink = document.querySelector('.timer__increase-time');
    const decreaseTimeLink = document.querySelector('.timer__decrease-time');
    startPauseButton.addEventListener('click', startTimer);
    stopButton.addEventListener('click', stopTimer);
    reloadButton.addEventListener('click', restoreSession);
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

    if (intervalId) {     // Si hay un contandor en marcha -> parar

        pauseTimer();
        stopBell();
        pauseMusic();

        startPauseButton.classList.remove('control__pause');
        startPauseButton.querySelector('span').textContent = 'Play';
        startPauseButton.classList.remove('fa-pause');
        startPauseButton.classList.add('fa-play');
    } else {

        let totalTime = pausedTime || getTime()  // Si no hay un contandor en marcha / esta detenido -> empezar / reanudar

        remainingTime = totalTime;

        startPauseButton.classList.add('control__pause');
        startPauseButton.classList.remove('fa-play');
        startPauseButton.classList.add('fa-pause');
        startPauseButton.querySelector('span').textContent = 'Pause';


        if (!pausedTime) {

            playMusic();

            if (bellTime !== 'silence' && bellTime !== 'finish') { // Play the bell if is not silence or played at the end

                playBell();
            }

        } else {
            resumeMusic();

        }


        intervalId = setInterval(() => {
            remainingTime -= 1000;

            if (remainingTime <= 0) {
                clearInterval(intervalId)
                intervalId = null;
                remainingTime = null;

                updateDisplay(remainingTime);

                if (bellTime === 'finish' || bellTime == 'startFinish') {

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
function stopTimer(event) {

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

    if (event instanceof Event) {
        selectedSong = {};
        updateMusicTitle();
        console.log(`-> (BOTON) Se ha pulsado el boton de STOP. El valor de selectedSong es de ${selectedSong} `);

    }

    stopBell();
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

function showBellConfig() {

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
                <input type="radio" name="options" id="start">
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
            <label for="startFinish" class="option-container">
                <i class="fa-solid fa-hourglass-start"></i>
                <i class="fa-solid fa-hourglass-end"></i>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                    <path d="M208 16c0-8.8 7.2-16 16-16s16 7.2 16 16l0 16.8c80.9 8 144 76.2 144 159.2l0 29.1c0 43.7 17.4 85.6 48.3 116.6l2.8 2.8c8.3 8.3 13 19.6 13 31.3c0 24.5-19.8 44.3-44.3 44.3L44.3 416C19.8 416 0 396.2 0 371.7c0-11.7 4.7-23 13-31.3l2.8-2.8C46.6 306.7 64 264.8 64 221.1L64 192c0-83 63.1-151.2 144-159.2L208 16zm16 48C153.3 64 96 121.3 96 192l0 29.1c0 52.2-20.7 102.3-57.7 139.2L35.6 363c-2.3 2.3-3.6 5.4-3.6 8.7c0 6.8 5.5 12.3 12.3 12.3l359.4 0c6.8 0 12.3-5.5 12.3-12.3c0-3.3-1.3-6.4-3.6-8.7l-2.8-2.8c-36.9-36.9-57.7-87-57.7-139.2l0-29.1c0-70.7-57.3-128-128-128zM193.8 458.7c4.4 12.4 16.3 21.3 30.2 21.3s25.8-8.9 30.2-21.3c2.9-8.3 12.1-12.7 20.4-9.8s12.7 12.1 9.8 20.4C275.6 494.2 251.9 512 224 512s-51.6-17.8-60.4-42.7c-2.9-8.3 1.4-17.5 9.8-20.4s17.5 1.4 20.4 9.8z"/>
                </svg>
                <input type="radio" name="options" id="startFinish">
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
        const bellOptions = document.querySelector('.bell-options');
        const radioButtons = document.querySelectorAll('input[type="radio"]');
        const optionContainers = document.querySelectorAll('.option-container');

        radioButtons.forEach(radioButton => {
            if (bellTime == radioButton.id) {
                radioButton.closest('.option-container').classList.add('option-container--active');
            }
        });

        radioButtons.forEach(radioButton => {
            radioButton.addEventListener('change', () => {
                optionContainers.forEach(option => {
                    option.classList.remove('option-container--active');
                });

                radioButton.closest('.option-container').classList.add('option-container--active');
                bellTime = radioButton.id;

                saveSession(bellTime);

            });
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
            <div class="music">
                <i class="music__icon fa-brands fa-itunes-note"></i>
                <h2 class="music__title">No music selected</h2>
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
        const reloadButton = document.querySelector('.control__reload');
        const increaseTimeLink = document.querySelector('.timer__increase-time');
        const decreaseTimeLink = document.querySelector('.timer__decrease-time');
        const timerContainerDiv = document.querySelector('.timer-container');
        increaseTimeLink.addEventListener('click', increaseTime);
        decreaseTimeLink.addEventListener('click', decreaseTime);
        startPauseButton.addEventListener('click', startTimer);
        stopButton.addEventListener('click', stopTimer);
        reloadButton.addEventListener('click', restoreSession);

        updateMusicTitle();

        applyTransition(timerContainerDiv);


    }


    currentPage = 'timer';

}

function showMusicPlaylist() {

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
<ul class="playlist">
    <label for="song1">
        <li class="song">
            <img class="song__img" src="./images/audio-covers/zen.jpg" alt="">
            <h3 class="song__title">That Zen Moment</h3>
            <input type="radio" name="options" id="song1">
        </li>
    </label>
    <label for="song2">
        <li class="song">
            <img class="song__img" src="./images/audio-covers/river.jpg" alt="">
            <h3 class="song__title">River Flute</h3>
            <input type="radio" name="options" id="song2">
        </li>
    </label>
    <label for="song3">
        <li class="song">
            <img class="song__img" src="./images/audio-covers/mindful.jpg" alt="">
            <h3 class="song__title">Ever Mindful</h3>
            <input type="radio" name="options" id="song3">
        </li>
    </label>
    <label for="song4">
        <li class="song">
            <img class="song__img" src="./images/audio-covers/relaxation.jpg" alt="">
            <h3 class="song__title">Ethereal Relaxation</h3>
            <input type="radio" name="options" id="song4">
        </li>
    </label>
</ul>
        `);

        const songRadioButtons = document.querySelectorAll('input[type="radio"]');
        const songImgs = document.querySelectorAll('img');
        const playlistDiv = document.querySelector('.playlist');



        songRadioButtons.forEach(songButton => {
            if (selectedSong.id == songButton.id) {
                songButton.parentElement.querySelector('img').classList.add('song__img--active');
            }
        });


        songRadioButtons.forEach(songButton => {
            songButton.addEventListener('change', () => {
                songImgs.forEach(img => {
                    img.classList.remove('song__img--active');
                });

                songButton.parentElement.querySelector('img').classList.add('song__img--active');
                selectedSong.id = songButton.id;
                selectedSong.title = songs[songButton.id].title;

                saveSession(selectedSong);


            });
        });


        applyTransition(playlistDiv);

    }

    currentPage = 'musicPlaylist';

}

function playMusic() {

    if (selectedSong && selectedSong.id) {

        if (songs[selectedSong.id]) {
            music = new Audio(songs[selectedSong.id].url);
        }
    }

    if (music) music.play();


}
function pauseMusic() {
    if (music) {
        pausedTime = music.currentTime;
        music.pause();
    }
}

function resumeMusic() {
    if (music) music.currentTime = pausedTime;
    music.play();
}

function stopMusic() {
    if (music) {
        music.pause();
        music.currentTime = 0;
        music = null;
    }
}
function updateMusicTitle() {


    const musicDiv = document.querySelector('.music');
    const musicTitle = document.querySelector('.music__title');

    if (selectedSong.title) {
        musicTitle.textContent = selectedSong.title;
    } else {
        musicTitle.textContent = 'No music selected'

    }


    if (musicDiv) {
        musicDiv.classList.add('music--hidden');
        setTimeout(() => {
            musicDiv.classList.add('music--active');
        }, 200);

    }
}
function saveSession() {

    if (bellTime) {
        sessionStorage.setItem('bellTime', bellTime);
        console.log(`La campana guardada es ${sessionStorage.getItem('bellTime')}`);

    } if (selectedSong) {
        sessionStorage.setItem('selectedSong', JSON.stringify(selectedSong));
        console.log(`La musica guardada es ${sessionStorage.getItem('selectedSong')}`);
    }

}

function restoreSession() {

    if (sessionStorage.getItem('bellTime')) {
        bellTime = sessionStorage.getItem('bellTime');
        console.log(`Has restaurado el valor de bellTime a: ${bellTime}`);

    } if (sessionStorage.getItem('selectedSong')) {
        selectedSong = JSON.parse(sessionStorage.getItem('selectedSong'));
        console.log(`La musica guardada es ${selectedSong}`);

        updateMusicTitle()
        stopTimer()
        startTimer();

    }
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