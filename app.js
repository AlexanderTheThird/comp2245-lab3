const fruits = [
{ name: "apple", symbol: "🍎 " },
{ name: "banana", symbol: "🍌 " },
{ name: "cherry", symbol: "🍒 " },
{ name: "coconut", symbol: "🥥 " },
{ name: "grapes", symbol: "🍇 " },
{ name: "mango", symbol: "🥭 " },
{ name: "pineapple", symbol: "🍍 " },
{ name: "watermelon", symbol: "🍉 " },
];

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
}
    return array;
}

let deck = [];
const board = document.getElementById("board");
const flippedCards = [];

let moves = 0;
const movesDisplay = document.getElementById("moves");
const statusDisplay = document.getElementById("status");

let waiting = false;

let matchedPairs = 0;

const newGameButton = document.getElementById("new-game");
let flipTimer = null;

function buildBoard() {
    deck = shuffle([...fruits, ...fruits]);

    board.replaceChildren();

    for (let i = 0; i < deck.length; i++) {
            const button = document.createElement("button");

            button.type = "button";
            button.classList.add("card")

            button.setAttribute("aria-label", `Card ${i+1}, face down`);

            button.dataset.index = i;

            board.appendChild(button);
        }
}

function newGame() {
    if (flipTimer !== null) {
        clearTimeout(flipTimer);
        flipTimer = null;
    }

    waiting = false;

    moves = 0;
    movesDisplay.textContent = moves;

    matchedPairs = 0;

    flippedCards.length = 0;

    statusDisplay.textContent = "Turn over two cards to find a matching pair.";

    statusDisplay.classList.remove("you-won");

    buildBoard();
}

newGameButton.addEventListener("click", newGame);

board.addEventListener("click", function(event){ 
    const card = event.target;
    
    if (waiting) {
        return;
    }

    if (!card.classList.contains("card")) {
        return;
    }

    if (card.classList.contains("flipped")) {
        return;
    }

    const index = card.dataset.index;
    const fruit = deck[index];

    card.textContent = fruit.symbol

    card.classList.add("flipped");

    card.setAttribute("aria-label", `Card ${Number(index) + 1}, ${fruit.name}`);

    flippedCards.push(card);

    if (flippedCards.length === 2) {
        moves++;
        movesDisplay.textContent = moves;

        const firstCard = flippedCards[0];
        const secondCard = flippedCards[1];

        const firstFruit = deck[firstCard.dataset.index];
        const secondFruit = deck[secondCard.dataset.index];

        if (firstFruit.name === secondFruit.name) {
            firstCard.classList.add("matched");
            secondCard.classList.add("matched");

            firstCard.disabled = true;
            secondCard.disabled = true;

            statusDisplay.textContent = "That's a pair";

            flippedCards.length = 0;

            matchedPairs++;

            if (matchedPairs === fruits.length) {
                statusDisplay.textContent = `You found all the pairs in ${moves} moves!`;
                
                statusDisplay.classList.add("you-won");
            }

          }

        else {
            waiting = true;
            statusDisplay.textContent = "Not a pair. Try again.";
            
            setTimeout(function(){

                firstCard.textContent = "";
                secondCard.textContent = "";

                firstCard.classList.remove("flipped");
                secondCard.classList.remove("flipped");

                firstCard.setAttribute(
                    "aria-label",
                    `Card ${Number(firstCard.dataset.index) + 1}, face down`
                );

                secondCard.setAttribute(
                    "aria-label",
                    `Card ${Number(firstCard.dataset.index) + 1}, face down`
                );

                flippedCards.length = 0;

                waiting = false;
                flipTimer = null;

                waiting = false;


            }, 1000);

        }
    }
});


newGame();