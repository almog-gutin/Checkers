/*----------- Object Makers ----------*/
const Piece = function(id, indexOnTheBoard, color) {
    this.id = id;
    this.indexOnTheBoard = indexOnTheBoard;
    this.color = color;
    this.isKing = false;
    this.canMove = (endLocation, board) => {
        if (!this.isKing) {
            let direction7 = this.color ? -7 : 7;
            let direction9 = this.color ? -9 : 9;
            if (endLocation - this.indexOnTheBoard === direction7 && typeof board[endLocation] !== undefined && board[endLocation] === null)
                return true;
            if (endLocation - this.indexOnTheBoard === direction9 && board[endLocation] === null)
                return true;
            if (this.checkForJumps(this.indexOnTheBoard ,endLocation, board))
                return true;
            return false;
        } else {
            if (this.checkForJumps(this.indexOnTheBoard, endLocation, board))
                return true;
            let calc = endLocation - this.indexOnTheBoard;
            let numOfPossibleMoves;
            let direction;
            if (calc % 7 === 0 && this.indexOnTheBoard != endLocation) {
                numOfPossibleMoves = Math.abs(calc / 7);
                direction = calc < 0 ? -7 : 7;
                for (let i = 1; i <= numOfPossibleMoves; i++)
                    if (board[this.indexOnTheBoard + (direction * i)] !== null)
                        return false;
                return true;
            }
            if (calc % 9 === 0 && this.indexOnTheBoard != endLocation) {
                numOfPossibleMoves = Math.abs(calc / 9);
                direction = calc < 0 ? -9 : 9;
                for (let i = 1; i <= numOfPossibleMoves; i++) 
                    if (board[this.indexOnTheBoard + (direction * i)] !== null)
                        return false;
                return true
            }
            return false;
        }
    };
    this.checkForJumps =  (startLocation, endLocation, board) => {
        if (!board[startLocation].isKing) {
            let direction7 = board[startLocation].color ? -7 : 7;
            let direction9 = board[startLocation].color ? -9 : 9;
            if (endLocation-startLocation === (direction7 * 2) && typeof board[endLocation] !== undefined && board[endLocation] === null && board[startLocation + direction7] !== null && board[startLocation + direction7].color !== board[startLocation].color)
                return true;
            if (endLocation-startLocation === (direction9 * 2) && typeof board[endLocation] !== undefined && board[endLocation] === null && board[startLocation + direction9] !== null && board[startLocation + direction9].color !== board[startLocation].color)
                return true;
            return false;
        } else {
            let calc = endLocation - this.indexOnTheBoard;
            let numOfPossibleMoves;
            let direction;
            let countEnemyPieces = 0;
            if (calc % 7 === 0 && this.indexOnTheBoard != endLocation && board[endLocation] === null) {
                numOfPossibleMoves = Math.abs(calc / 7);
                direction = calc < 0 ? -7 : 7;
                for (let i = 1; i < numOfPossibleMoves; i++) {
                    if (board[this.indexOnTheBoard + (direction * i)] !== null && board[this.indexOnTheBoard + (direction * i)].color != this.color)
                        countEnemyPieces++;
                }
                if (countEnemyPieces > 1 || countEnemyPieces === 0)
                    return false;
                else
                    return true;
            }
            if (calc % 9 === 0 && this.indexOnTheBoard != endLocation && board[endLocation] === null) {
                numOfPossibleMoves = Math.abs(calc / 9);
                direction = calc < 0 ? -9 : 9;
                for (let i = 1; i < numOfPossibleMoves; i++) {
                    if (board[this.indexOnTheBoard + (direction * i)] !== null && board[this.indexOnTheBoard + (direction * i)].color != this.color)
                        countEnemyPieces++;
                    if (countEnemyPieces > 1)
                        return false;
                }
                if (countEnemyPieces > 1 || countEnemyPieces === 0)
                    return false;
                else
                    return true;
            }
            return false;
        }
    };
};
const Move = function(startLocation, endLocation, isMandatory) {
    this.startLocation = startLocation;
    this.endLocation = endLocation;
    this.isMandatory = isMandatory;
    this.Equals = (move) => {
        if (this.startLocation === move.startLocation && this.endLocation === move.endLocation && this.isMandatory === move.isMandatory)
            return true;
        return false;
    };
};
const Player = function(color) {
    this.color = color;
    this.arsenal = document.querySelectorAll(color ? '.white-piece' : '.black-piece');
}

/*----------- DOM References ----------*/
const homepage = document.getElementById('homepage');
const game = document.getElementById('game');
const drawModal = document.getElementById('drawModal');
const endpage = document.getElementById('endpage');
const homepageStartButton = document.getElementById('homepage-start-button');
const gameResignButton = document.getElementById('game-resign-button');
const gameDrawButton = document.getElementById('game-draw-button');
const endpageHomeButton = document.getElementById('endpage-home-button');
const endpageNewgameButton = document.getElementById('endpage-newgame-button');
const drawModalYesButton = document.getElementById('drawModal-yes-button');
const drawModalNoButton = document.getElementById('drawModal-no-button');
const whiteTurn = document.getElementById('whiteTurn');
const blackTurn = document.getElementById('blackTurn');
const cells = document.getElementById('board').children;

/*----------- New Board Function ----------*/
function newBoard() {
    return [
        undefined, new Piece (1, 1, false), undefined, new Piece (2, 3, false), undefined, new Piece (3, 5, false), undefined, new Piece (4, 7, false),
        new Piece (5, 8, false), undefined, new Piece (6, 10, false), undefined, new Piece (7, 12, false), undefined, new Piece (8, 14, false), undefined,
        undefined, new Piece (9, 17, false), undefined, new Piece (10, 19, false), undefined, new Piece (11, 21, false), undefined, new Piece (12, 23, false),
        null, undefined, null, undefined, null, undefined, null, undefined,
        undefined, null, undefined, null, undefined, null, undefined, null,
        new Piece (13, 40, true) , undefined, new Piece (14, 42, true), undefined, new Piece (15,44, true), undefined, new Piece(16,46, true), undefined,
        undefined, new Piece (17, 49, true), undefined, new Piece (18, 51, true), undefined, new Piece (19, 53, true), undefined, new Piece (20, 55, true),
        new Piece (21, 56, true), undefined, new Piece (22, 58, true), undefined, new Piece (23, 60, true), undefined, new Piece (24, 62, true), undefined
    ];
}

/*----------- Game Properties ----------*/
let board = newBoard();
const whitePlayer = new Player (true);
const blackPlayer = new Player (false);
let playerTurn = true;
let isGameOver = false;
let isDraw = false;
let totalPieces = 24;
let kingMoves = 0;
let allAvailbleMoves = getAllAvailbleMoves();
let playerArsenal = playerTurn ? whitePlayer.arsenal : blackPlayer.arsenal;

/*----------- Functions For Buttons ----------*/
homepageStartButton.addEventListener('click', () => {
    homepage.style.display = 'none';
    game.style.display = '';
});
gameResignButton.addEventListener('click', () => {
    gameOver();
});
gameDrawButton.addEventListener('click', () => {
    drawModal.firstElementChild.innerHTML = playerTurn === true ? 'BLACK PLAYER, DO YOU ACCEPT?': 'WHITE PLAYER, DO YOU ACCEPT?';
    game.style.display = 'none';
    drawModal.style.display = '';
});
drawModalYesButton.addEventListener('click', () => {
    isDraw = true;
    drawModal.style.display = 'none';
    gameOver();
});
drawModalNoButton.addEventListener('click', () => {
    drawModal.style.display = 'none';
    game.style.display = '';
});

/*---------- Logic Of The Game ----------*/
playerMove();
function playerMove() {
    if (isStalemate())
        gameOver();
    if (checkArsenalLength())
        gameOver();
    if (checkLengthAllAvailbleMoves())
        gameOver();
    addClickToArsenal();
}
function addClickToArsenal() {
    for (let i = 0; i < playerArsenal.length; i++)
        playerArsenal[i].setAttribute('onclick', `logicOfClick(${i})`);
}
function logicOfClick (indexClickedPiece) {
    removeClickToCells();
    removePiecesAndMovesColor();
    givePieceAndMovesColor(indexClickedPiece);
}
function removeClickToCells () {
    for (let i = 0; i < cells.length; i++)
        cells[i].removeAttribute('onclick');
}
function removePiecesAndMovesColor() {
    for (let i = 0; i < playerArsenal.length; i++)
        playerArsenal[i].style = '';
    for (let i = 0; i < cells.length; i++)
        cells[i].style = '';
}
function givePieceAndMovesColor(indexClickedPiece) {
    playerArsenal[indexClickedPiece].style = 'border: 3px solid green';
    for (let i = 0; i < allAvailbleMoves.length; i++)
        if (parseInt(playerArsenal[indexClickedPiece].id) === board[allAvailbleMoves[i].startLocation].id) 
            cells[allAvailbleMoves[i].endLocation].style = 'background-color: yellow;';
    addClickToCells(indexClickedPiece); 
}
function addClickToCells(indexClickedPiece) {
    for (let indexMove = 0; indexMove < allAvailbleMoves.length; indexMove++)
        if (parseInt(playerArsenal[indexClickedPiece].id) === board[allAvailbleMoves[indexMove].startLocation].id)
            cells[allAvailbleMoves[indexMove].endLocation].setAttribute('onclick', `makeMove(${indexClickedPiece}, ${indexMove})`);
}
function makeMove (indexClickedPiece, indexMove) {
    let move = allAvailbleMoves[indexMove];
    let piece = playerArsenal[indexClickedPiece];
    let didPromote = false;
    kingMoves += board[move.startLocation].isKing ? 1 : 0 ;
    if (playerTurn ? (move.endLocation >= 0 && move.endLocation <= 7) : (move.endLocation >= 56 && move.endLocation <= 63)) {
        board[move.startLocation].isKing = true;
        didPromote = true;
    }
    updateCells(piece, move);
    whitePlayer.arsenal = document.querySelectorAll('.white-piece');
    blackPlayer.arsenal = document.querySelectorAll('.black-piece');
    updateBoard(move); 
    if (board[move.endLocation] != null)
        board[move.endLocation].indexOnTheBoard = move.endLocation;
    removePiecesAndMovesColor();
    removeClickToCells();
    removeClickToArsenal();
    if (move.isMandatory && checkForSuccessiveMoves(move.endLocation) && !didPromote) {
        allAvailbleMoves = getAllJumps(move.endLocation);
        givePieceAndMovesColor(indexClickedPiece);
    } else
        changePlayerTurn();
}
function getAllJumps(startLocation) {
    let allJumps = [];
    for (let endLocation = 0; endLocation < 64; endLocation++)
        if (board[startLocation].checkForJumps(startLocation, endLocation, board))
            allJumps.push(new Move(startLocation, endLocation, true));
    return allJumps;
}
function getSuccessiveMoves(indexOfPiece) {
    let successiveMoves = [];
    for (let endLocation = 0; endLocation < 64; endLocation++)
        if (board[indexOfPiece].checkForJumps(indexOfPiece, endLocation, board))
            successiveMoves.push(new Move (indexOfPiece, endLocation));
    return successiveMoves;
}
function checkForSuccessiveMoves(indexOfPiece) {
    for (let endLocation = 0; endLocation < 64; endLocation++)
        if (board[indexOfPiece].checkForJumps(indexOfPiece, endLocation, board))
            return true;
    return false;
}
function updateCells (piece, move) {
    if (board[move.startLocation].isKing)
        cells[move.endLocation].innerHTML = `<p class="${playerTurn ? 'white-piece king' : 'black-piece king'}" id="${piece.id}"></p>`;
    else
        cells[move.endLocation].innerHTML = `<p class="${playerTurn ? 'white-piece' : 'black-piece'}" id="${piece.id}"></p>`;  
    let direction = (move.endLocation - move.startLocation) % 7 === 0 ? 7 : 9;
    if (move.endLocation - move.startLocation < 0)
        direction = -direction;
        if (move.endLocation - move.startLocation > 0) 
            for (let i = move.startLocation; i < move.endLocation ; i+= direction)
                cells[i].innerHTML = '';
        else 
            for (let i = move.startLocation; i > move.endLocation ; i+= direction)
                cells[i].innerHTML = '';
    let countMandatoryMoves = 0;
    for (let i = 0; i < allAvailbleMoves.length; i++)
        if (allAvailbleMoves[i].isMandatory)
            countMandatoryMoves++;
    if (!move.isMandatory && countMandatoryMoves > 0)
        for (let i = 0; i < allAvailbleMoves.length; i++) {
            if (allAvailbleMoves[i].isMandatory)
                cells[allAvailbleMoves[i].startLocation].innerHTML = '';
            if (!move.isMandatory && allAvailbleMoves[i].startLocation === move.startLocation && allAvailbleMoves[i].isMandatory)
                cells[move.endLocation].innerHTML = '';
        }
}
function updateBoard(move) {
    let direction = (move.endLocation - move.startLocation) % 7 === 0 ? 7 : 9;
    if (move.endLocation - move.startLocation < 0)
        direction = -direction;
    board[move.endLocation] = board[move.startLocation];
    if (move.endLocation - move.startLocation > 0) 
        for (let i = move.startLocation; i < move.endLocation ; i+= direction)
            board[i] = null;
    else 
        for (let i = move.startLocation; i > move.endLocation ; i+= direction)
            board[i] = null;
    let countMandatoryMoves = 0;
    for (let i = 0; i < allAvailbleMoves.length; i++)
        if (allAvailbleMoves[i].isMandatory)
            countMandatoryMoves++;
    if (!move.isMandatory && countMandatoryMoves > 0)
        for (let i = 0; i < allAvailbleMoves.length; i++) {
            if (allAvailbleMoves[i].isMandatory)
                board[allAvailbleMoves[i].startLocation] = null;
            if (!move.isMandatory && allAvailbleMoves[i].startLocation === move.startLocation && allAvailbleMoves[i].isMandatory)
                board[move.endLocation] = null;
        }
}
function removeClickToArsenal() {
    for (let i = 0; i < playerArsenal.length; i++)
        playerArsenal[i].removeAttribute('onclick');
}
function changePlayerTurn() {
    if (checkArsenalLength())
        gameOver();
    if (playerTurn) {
        playerTurn = false;
        whiteTurn.style.color = 'rgba(255, 255, 255, 0.2)';
        blackTurn.style.color = '#D9D9D9';
    } else {
        playerTurn = true;
        whiteTurn.style.color = '#D9D9D9';
        blackTurn.style.color = 'rgba(255, 255, 255, 0.2)';
    }
    allAvailbleMoves = getAllAvailbleMoves();
    playerArsenal = playerTurn ? whitePlayer.arsenal : blackPlayer.arsenal;
    playerMove();
}
function checkLengthAllAvailbleMoves() {
    if (allAvailbleMoves.length === 0) {
        isGameOver = true;
        return true;
    }
    return false;
}
function getAllAvailbleMoves() {
    let availbleMoves = [];
    for (let startLocation = 0; startLocation < 64; startLocation++)
        if (board[startLocation] !== undefined && board[startLocation] !== null && board[startLocation].color === playerTurn)
            for (let endLocation = 0; endLocation < 64; endLocation++) 
                if (board[startLocation].canMove(endLocation, board))
                    if (board[startLocation].checkForJumps(startLocation, endLocation, board))
                        availbleMoves.push(new Move(startLocation, endLocation, true));
                    else
                        availbleMoves.push(new Move(startLocation, endLocation, false));
    return availbleMoves;
}
function checkArsenalLength() {
    if ((playerTurn ? whitePlayer.arsenal.length : blackPlayer.arsenal.length) === 0) {
        isGameOver = true;
        return true;
    }
    return false;
}
function isStalemate() {
    if (kingMoves === 15) {
        isGameOver = true;
        isDraw = true;
        return true;
    }
    return false;
}
function gameOver() {
    endpage.firstElementChild.innerHTML = isDraw ? 'DRAW!' : (playerTurn ? 'BLACK PLAYER WON!' : 'WHITE PLAYER WON!');
    game.style.display = 'none';
    endpage.style.display = '';
}