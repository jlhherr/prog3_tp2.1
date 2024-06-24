class Card {
    constructor(name, img) {
        this.name = name;
        this.img = img;
        this.isFlipped = false;
        this.element = this.#createCardElement();
    }

    #createCardElement() {
        const cardElement = document.createElement("div");
        cardElement.classList.add("cell");
        cardElement.innerHTML = `
          <div class="card" data-name="${this.name}">
              <div class="card-inner">
                  <div class="card-front"></div>
                  <div class="card-back">
                      <img src="${this.img}" alt="${this.name}">
                  </div>
              </div>
          </div>
      `;
        return cardElement;
    }

    //flip() {
    toggleFlip(){
        this.isFlipped= !this.isFlipped;
        const cardElement = this.element.querySelector(".card");
        cardElement.classList.toggle("flipped", this.isFlipped);
        //cardElement.classList.add("flipped", this.isFlipped);
    }

    unflip() {
        const cardElement = this.element.querySelector(".card");
       cardElement.classList.remove("flipped");
    }
    matches(otherCard) {
        return this.name === otherCard.name;
    }
}


class Board {
    constructor(cards) {
        this.cards = cards;
        this.fixedGridElement = document.querySelector(".fixed-grid");
        this.gameBoardElement = document.getElementById("game-board");
    }

    #calculateColumns() {
        const numCards = this.cards.length;
        let columns = Math.floor(numCards / 2);

        columns = Math.max(2, Math.min(columns, 12));

        if (columns % 2 !== 0) {
            columns = columns === 11 ? 12 : columns - 1;
        }

        return columns;
    }

    #setGridColumns() {
        const columns = this.#calculateColumns();
        this.fixedGridElement.className = `fixed-grid has-${columns}-cols`;
    }

    render() {
        this.#setGridColumns();
        this.gameBoardElement.innerHTML = "";
        this.cards.forEach((card) => {
            card.element
                .querySelector(".card")
                .addEventListener("click", () => this.onCardClicked(card));
            this.gameBoardElement.appendChild(card.element);
        });
    }

    shuffleCards() {
        this.cards.sort(() => Math.random() - 0.5);
    }

    reset() {
        this.shuffleCards();
        this.render();
    }


    onCardClicked(card) {
        if (this.onCardClick) {
            this.onCardClick(card);
        }
    }
    flipDownAllCards() {
        this.cards.forEach(card => {
            if (card.isFlipped) {
                card.toggleFlip();
            }
        });
    }
}

class MemoryGame {
    constructor(board, flipDuration = 500) {
        this.board = board;
        this.flippedCards = [];
        this.matchedCards = [];
        this.moves = 0;
        this.score = 0;
        this.startTime = null;
        this.endTime = null;



        if (flipDuration < 350 || isNaN(flipDuration) || flipDuration > 3000) {
            flipDuration = 350;
            alert(
                "La duración de la animación debe estar entre 350 y 3000 ms, se ha establecido a 350 ms"
            );
        }
        this.flipDuration = flipDuration;
        this.board.onCardClick = this.#handleCardClick.bind(this);
        this.resetGame();
        this.updateMoves();
        this.updateScore();
        //this.startTimer();
    
    }

    starGame(){
        this.resetGame();
        this.startTime();
    }

    startTimer() {
        this.startTime = Date.now();
        this.timerInterval = setInterval(() => {
            const currentTime = Date.now();
            const elapsedTime = currentTime - this.startTime;
            const seconds = Math.floor(elapsedTime / 1000) % 60;
            const minutes = Math.floor(elapsedTime / 60000);
            document.getElementById("timer").textContent = `Time: ${minutes}m ${seconds}s`;
        }, 1000);
    }

    stopTimer() {
        clearInterval(this.timerInterval);
        this.endTime = Date.now();
    }

    updateMoves() {
        const movesElement = document.getElementById("moves");
        if (movesElement) {
            movesElement.textContent = `Moves: ${this.moves}`;
        }
    }
       //document.getElementById("moves").textContent = `Moves: ${this.moves}`;
    //}

    updateScore() {
        const timeTaken = (this.endTime - this.startTime) / 1000; 
        this.score = Math.max(0, Math.round((10000 / (this.moves * timeTaken)) * this.matchedCards.length));
        const scoreElement = document.getElementById("score");
        if (scoreElement) {
            scoreElement.textContent = `Score: ${this.score}`;
        }
    }
//document.getElementById("score").textContent = `Score: ${this.score}`;
    

    resetGame() {
        this.stopTimer();
        this.board.flipDownAllCards();
        this.flippedCards = [];
        this.matchedCards = [];
        this.moves = 0;
        this.score = 0;
        this.updateMoves();
        this.updateScore();
        this.board.reset();
        this.startTimer();
    }


    #handleCardClick(card) {
        if (this.flippedCards.length < 2 && !card.isFlipped) {
            card.toggleFlip();
            this.flippedCards.push(card);

            this.moves += 1;
            this.updateMoves();

            if (this.flippedCards.length === 2) {
                setTimeout(() => this.checkForMatch(), this.flipDuration);
            
        }
    }
}

checkForMatch() {
    const [firstCard, secondCard] = this.flippedCards;

    if (firstCard.matches(secondCard)) {
        this.matchedCards.push(firstCard, secondCard);
        this.flippedCards = [];

        if (this.matchedCards.length === this.board.cards.length) {
            this.stopTimer();
            this.updateScore();
            alert("Congratulations! You've completed the game.");
        }
    } else {
        firstCard.toggleFlip();
        secondCard.toggleFlip();
        this.flippedCards = [];
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
    const cardsData = [
        { name: "Python", img: "./img/Python.svg" },
        { name: "JavaScript", img: "./img/JS.svg" },
        { name: "Java", img: "./img/Java.svg" },
        { name: "CSharp", img: "./img/CSharp.svg" },
        { name: "Go", img: "./img/Go.svg" },
        { name: "Ruby", img: "./img/Ruby.svg" },
    ];

    const cards = cardsData.flatMap((data) => [
        new Card(data.name, data.img),
        new Card(data.name, data.img),
    ]);
    const board = new Board(cards);
    const memoryGame = new MemoryGame(board, 1000);

    document.getElementById("restart-button").addEventListener("click", () => {
        memoryGame.resetGame();

    
        });
    });

