let intervalId;
let remainingTime;


document.addEventListener('DOMContentLoaded', () => {
    const startPauseButton = document.querySelector('.control__play-pause');
    startPauseButton.addEventListener('click', startTimer);
});


function getTime() {

    const minutesInput = parseInt(document.querySelector('.digits_minutes').value);
    const secondsInput = parseInt(document.querySelector('.digits_seconds').value);

    // validacion?

    const totalTime = ((minutesInput * 60) + secondsInput) * 1000;
    return totalTime;

}


function startTimer() {

    if (intervalId) {
        pauseTimer(); // pausarlo
        // cambiar el estilo del boton a play  
    } else {
        let totalTime = remainingTime || getTime()

        updateDisplay(totalTime);

        remainingTime = totalTime;

        console.log(remainingTime);

        intervalId = setInterval(() => {
            remainingTime -= 1000;
            console.log(remainingTime);

            if (remainingTime <= 0) {
                clearInterval(intervalId)
                intervalId = null;
                updateDisplay(0);
                // llamar a funcion que se ejecuta al terminar una sesion
                remainingTime = null;
                // cambiar el estilo del boton a play

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
