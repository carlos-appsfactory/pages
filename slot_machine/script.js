/* Pregunta al usuario con cuanto dinero quiere empezar a jugar */
function getAmount(){
  let amount = 0;

  do{
    amount = prompt("Introduce una cantidad para empezar a jugar");
  } while(!amount || isNaN(amount) || amount <= 0);

  amountContainer.value = amount;
}

/* Cambia los valores de las casillas de display, para simular el juego */
function spin(){
  spinning = true;

  const reels = [reel1, reel2, reel3];
  const maxTimes = 60;
  let counter = 0;

  const interval = setInterval(() => {
    counter++;

    if (counter >= maxTimes) {
      spinning = false;
      checkResult();
      clearInterval(interval);
    
    } else if (counter === 20 || counter === 40) {
      reels.shift();
    }

    for (const reel of reels){
      let imageIndex = reel.src.split("/").pop().split(".")[0];
      let newImageIndex;

      do {
        newImageIndex = Math.floor(Math.random() * 10);
      } while (imageIndex === newImageIndex);

      reel.src = `images/${newImageIndex}.png`;
    }
  }, 150);
}


function checkResult(){
  const prizes = [1, 2, 3, 5, 10, 20, 100, 300, 500, 1000];

  const result = [
    reel1.src.split("/").pop().split(".")[0],
    reel2.src.split("/").pop().split(".")[0],
    reel3.src.split("/").pop().split(".")[0]
  ];

  const realResults = result.filter(r => r !== 9);

  let prizeMultiplier = 0;

  if (realResults.length === 0){
    prizeMultiplier = prizes[9];
  
  } else if (realResults.every(r => r === realResults[0])){
    prizeMultiplier = prizes[realResults[0]];
  }

  if (prizeMultiplier > 0) {
    let bet = parseInt(betContainer.value);
    let amount = parseInt(amountContainer.value);
    let wins = bet * prizeMultiplier;

    winContainer.value = wins;
    amountContainer.value = amount + wins;
  }
}

function play() {
  if(spinning){
    return;
  }

  let amount = parseInt(amountContainer.value);
  let bet = parseInt(betContainer.value);

  if (amount <= 0) {
    alert("No tienes dinero para jugar");
    return;
  } else if (amount < bet) {
    alert("Tu apuesta supera tu dinero actual");
    return;
  }

  amount = amount - bet;
  amountContainer.value = amount;

  spin();
}

let amountContainer = document.getElementById("amount");
let betContainer = document.getElementById("bet");
let winContainer = document.getElementById("win");
let spinButton = document.getElementById("spin");
let reel1 = document.getElementById("reel1");
let reel2 = document.getElementById("reel2");
let reel3 = document.getElementById("reel3");

let spinning = false;

getAmount();
spinButton.addEventListener("click", play);