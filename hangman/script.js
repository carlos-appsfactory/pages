/* Captura las teclas pulsadas para marcar si se va por buen camino o se ha fallado */
function letterEvents(){
  document.addEventListener("keyup", function(event) {
    const letter = event.key.toUpperCase();

    if (!/^[A-Z]$/.test(letter) || triedLetters.includes(letter)) {
      return;
    }

    if (wordGuess.includes(letter)) {
      const spans = wordContainer.querySelectorAll('span');
      for (let i = 0; i < wordGuess.length; i++) {
        if (wordGuess[i] === letter) {
          spans[i].textContent = letter;
          successes++;
        }
      }

      if (successes === wordGuess.length) {
        setTimeout(() => alert("¡Has ganado!"), 0);
        location.reload();
      }
    } else {
      const span = document.createElement('span');
      span.textContent = letter;
      incorrectLettersContainer.appendChild(span);
      errors++;

      if (errors === 7) {
        setTimeout(() => {
          alert(`¡Has perdido! La palabra era ${wordGuess}`);
          location.reload();
        }, 0);
      
      } else {
        hangmanImage.src = `images/hangman${errors}.png`;
      }
    }

    triedLetters.push(letter);    
  });
}

/* Crea una palabra aleatoria y añade sus cuadros al juego */
function createWordToGuess(word) {
  wordGuess = word.toUpperCase();

  for (let letter of wordGuess){
    const span = document.createElement('span');
    span.textContent = '';
    wordContainer.appendChild(span);
  }
}

let wordContainer;
let incorrectLettersContainer;
let hangmanImage;
let wordGuess;
let triedLetters = [];
let successes = 0;
let errors = 0;

document.addEventListener('DOMContentLoaded', () => {
  wordContainer = document.getElementById('word-container');
  incorrectLettersContainer = document.getElementById('incorrect-letters');
  hangmanImage = document.getElementById('hangman-image');

  try {
    const randomId = Math.floor(Math.random() * 1025) + 1;
    const apiUrl = `https://pokeapi.co/api/v2/pokemon/${randomId}`;

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Error en la solicitud');
        }
        return response.json();
      })
      .then(data => {
        createWordToGuess(data['name']);
        letterEvents();

        console.log(wordGuess);
      })
      .catch(error => {
        console.error('Hubo un problema con la solicitud fetch:', error);
      });

  } catch (error) {
    console.error('Error al obtener la palabra:', error);
  }
});