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
        const player1 = Player('Player 1', '🐱');
        const player2 = Player('Player 2', '🐶');
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
                [0,1,2],[3,4,5],[6,7,8],
                [0,3,6],[1,4,7],[2,5,8],
                [0,4,8],[2,4,6]
            ];

            for (let pattern of winPatterns) {
                const [a,b,c] = pattern;
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

        return { getCurrentPlayer, switchTurn, checkWinner, resetGame, isGameOver };
    })();

    // ===== Stats Controller =====
    const statsController = (function() {
        let stats = {
            player1Wins: 0,
            player2Wins: 0,
            draws: 0,
            totalGames: 0
        };

        const addWin = (playerMarker) => {
            if (playerMarker === 'X') stats.player1Wins++;
            else stats.player2Wins++;
            stats.totalGames++;
        };

        const addDraw = () => {
            stats.draws++;
            stats.totalGames++;
        };

        const resetStats = () => {
            stats = { player1Wins:0, player2Wins:0, draws:0, totalGames:0 };
        };

        const getStats = () => stats;

        return { addWin, addDraw, resetStats, getStats };
    })();

    // ===== Display Controller =====
    const displayController = (function () {
        const boardElement = document.getElementById('game-board');
        const statusMessage = document.getElementById('status-message');
        const restartButton = document.getElementById('restart-button');
        const resetStatsButton = document.getElementById('reset-stats');

        const render = () => {
            boardElement.innerHTML = '';
            const board = gameBoard.getBoard();

            board.forEach((value, index) => {
                const square = document.createElement('div');
                square.classList.add('square');
                square.textContent = value;
                if (value === '') square.classList.add('empty');

                square.dataset.hover = gameController.getCurrentPlayer().marker;

                square.addEventListener('click', () => handleMove(index));
                boardElement.appendChild(square);
            });

            updateHoverClass();
        };

        const updateHoverClass = () => {
            boardElement.classList.remove('x-turn', 'o-turn');
            if (!gameController.isGameOver()) {
                boardElement.classList.add(
                    gameController.getCurrentPlayer().marker === 'X'
                        ? 'x-turn'
                        : 'o-turn'
                );
            }
        };

        const handleMove = (index) => {
            if (gameController.isGameOver()) return;
            if (gameBoard.getBoard()[index] !== '') return;

            gameBoard.setBoard(index, gameController.getCurrentPlayer().marker);

            const result = gameController.checkWinner();

            if (result === 'draw') {
                statusMessage.textContent = "It's a draw!";
                statsController.addDraw();
            } else if (result) {
                statusMessage.textContent = `${result} wins!`;
                statsController.addWin(result);
            } else {
                gameController.switchTurn();
                statusMessage.textContent =
                    `${gameController.getCurrentPlayer().marker}'s turn`;
            }

            render();
            updateStatsDisplay();
        };

        const updateStatsDisplay = () => {
            const stats = statsController.getStats();
            document.getElementById('player1-stats').textContent = `Player X Wins: ${stats.player1Wins}`;
            document.getElementById('player2-stats').textContent = `Player O Wins: ${stats.player2Wins}`;
            document.getElementById('draws').textContent = `Draws: ${stats.draws}`;
            document.getElementById('total-games').textContent = `Total Games: ${stats.totalGames}`;
        };

        const init = () => {
            statusMessage.textContent =
                `${gameController.getCurrentPlayer().marker}'s turn`;
            render();
            updateStatsDisplay();
        };

        restartButton.addEventListener('click', () => {
            gameController.resetGame();
            statusMessage.textContent =
                `${gameController.getCurrentPlayer().marker}'s turn`;
            render();
        });

        resetStatsButton.addEventListener('click', () => {
            statsController.resetStats();
            updateStatsDisplay();
        });

        return { init };
    })();

    // ===== Start Game =====
    displayController.init();