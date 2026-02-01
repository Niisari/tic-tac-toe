// ===== Game Board Module =====
const gameBoard = (function () {
    let board = ['', '', '', '', '', '', '', '', ''];

    const getBoard = () => board;

    const setBoard = (index, value) => {
        board[index] = value;
    };

    const resetBoard = () => {
        board = ['', '', '', '', '', '', '', '', ''];
    };

    return { getBoard, setBoard, resetBoard };
})();

// ===== Player Factory =====
const Player = (name, marker) => {
    return { name, marker };
};

// ===== Game Controller =====
const gameController = (function () {
    const player1 = Player('Player 1', 'X');
    const player2 = Player('Player 2', 'O');
    let currentPlayer = player1;
    let gameOver = false;

    const getCurrentPlayer = () => currentPlayer;
    const isGameOver = () => gameOver;

    const switchTurn = () => {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
    };

    const checkWinner = () => {
        const board = gameBoard.getBoard();
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        for (let pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                gameOver = true;
                return board[a];
            }
        }

        if (!board.includes('')) {
            gameOver = true;
            return 'draw';
        }

        return null;
    };

    const resetGame = () => {
        gameBoard.resetBoard();
        currentPlayer = player1;
        gameOver = false;
    };

    return {
        getCurrentPlayer,
        switchTurn,
        checkWinner,
        resetGame,
        isGameOver
    };
})();

// ===== Display Controller =====
const displayController = (function () {
    const boardElement = document.getElementById('game-board');
    const statusMessage = document.getElementById('status-message');
    const restartButton = document.getElementById('restart-button');

    const render = () => {
        boardElement.innerHTML = '';
        const board = gameBoard.getBoard();

        board.forEach((value, index) => {
            const square = document.createElement('div');
            square.classList.add('square');
            square.textContent = value;
            square.dataset.index = index;

            square.addEventListener('click', () => handleMove(index));

            boardElement.appendChild(square);
        });
    };

    const handleMove = (index) => {
        if (gameController.isGameOver()) return;
        if (gameBoard.getBoard()[index] !== '') return;

        gameBoard.setBoard(index, gameController.getCurrentPlayer().marker);

        const result = gameController.checkWinner();

        if (result === 'draw') {
            statusMessage.textContent = "It's a draw!";
        } else if (result) {
            statusMessage.textContent = `${result} wins!`;
        } else {
            gameController.switchTurn();
            statusMessage.textContent =
                `${gameController.getCurrentPlayer().marker}'s turn`;
        }

        render();
    };

    const init = () => {
        statusMessage.textContent =
            `${gameController.getCurrentPlayer().marker}'s turn`;
        render();
    };

    restartButton.addEventListener('click', () => {
        gameController.resetGame();
        statusMessage.textContent =
            `${gameController.getCurrentPlayer().marker}'s turn`;
        render();
    });

    return { init };
})();

// ===== Start Game =====
displayController.init();
