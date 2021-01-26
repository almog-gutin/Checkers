/*----------- Object Makers ----------*/
const Piece = function(color) {
    this.color = color;
    this.isKing = false;
};
const Move = function(startLocation, endLocation, isMandatory) {
    this.startLocation = startLocation;
    this.endLocation = endLocation;
    this.isMandatory = isMandatory;
};
const Player = function(color) {
    this.color = color;
    this.arsenal = document.querySelectorAll(color ? '.white-piece' : '.black-piece');
}

/*----------- Creating The HTML Board and Data Board ----------*/
const htmlBoard = () => {
    const board = document.getElementById('board');
    let element;
    for (let row = 0; row < 8; row++) 
        for (let column = 0; column < 8; column++) {
            element = document.createElement('div');
            if (row % 2 === 0) {
                if (column % 2 === 0) {
                    element.className = 'no-piece';
                    board.appendChild(element);
                } else {
                    if (row >=0 && row <=2) {
                        element.innerHTML = '<p class="black-piece"></p>'
                        board.appendChild(element);
                    } else if (row > 2 && row < 5) 
                        board.appendChild(element);
                    else {
                        element.innerHTML = '<p class="white-piece"></p>'
                        board.appendChild(element);
                    }
                    element.addEventListener('click', makeMove);
                }
            } else {
                if (column % 2 === 0) {
                    if (row >=0 && row <=2) {
                        element.innerHTML = '<p class="black-piece"></p>'
                        board.appendChild(element);
                    } else if (row > 2 && row < 5) 
                        board.appendChild(element);
                    else {
                        element.innerHTML = '<p class="white-piece"></p>'
                        board.appendChild(element);
                    }
                    element.addEventListener('click', makeMove);
                } else {
                    element.className = 'no-piece';
                    board.appendChild(element);
                }
            }
        }
};
const newBoard = () => {
    return [
        undefined, new Piece (false), undefined, new Piece (false), undefined, new Piece (false), undefined, new Piece (false),
        new Piece (false), undefined, new Piece (false), undefined, new Piece (false), undefined, new Piece (false), undefined,
        undefined, new Piece (false), undefined, new Piece (false), undefined, new Piece (false), undefined, new Piece (false),
        null, undefined, null, undefined, null, undefined, null, undefined,
        undefined, null, undefined, null, undefined, null, undefined, null,
        new Piece (true) , undefined, new Piece (true), undefined, new Piece (true), undefined, new Piece (true), undefined,
        undefined, new Piece (true), undefined, new Piece (true), undefined, new Piece (true), undefined, new Piece (true),
        new Piece (true), undefined, new Piece (true), undefined, new Piece (true), undefined, new Piece (true), undefined
    ];
}
htmlBoard();

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
let cellsArray = [...cells];
let indexClickedPiece = null;

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

/*----------- Event Listeners ----------*/
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
addClickToArsenal();
function addClickToArsenal() {
    for (let i = 0; i < playerArsenal.length; i++)
        playerArsenal[i].addEventListener('click', logicOfClick);
}
function logicOfClick (event) {
    event.stopPropagation();
    indexClickedPiece = null;
    removePiecesAndMovesColor();
    givePieceAndMovesColor(event);
}
function removePiecesAndMovesColor() {
    for (let i = 0; i < playerArsenal.length; i++)
        playerArsenal[i].style = '';
    for (let i = 0; i < cells.length; i++)
        cells[i].style = '';
}
function givePieceAndMovesColor(event) {
    if (indexClickedPiece === null)
        indexClickedPiece = cellsArray.indexOf((event.target).parentElement);
    cells[indexClickedPiece].firstChild.style = 'border: 3px solid green';
    for (let i = 0; i < allAvailbleMoves.length; i++)
        if (indexClickedPiece === allAvailbleMoves[i].startLocation) 
            cells[allAvailbleMoves[i].endLocation].style = 'background-color: yellow;';
}
function makeMove (event) {
    let indexMove = findIndexMove(cellsArray.indexOf(event.target));
    if (indexClickedPiece === null || indexMove === null) return;
    let move = allAvailbleMoves[indexMove];
    let piece = cells[indexClickedPiece].firstChild;
    kingMoves += board[move.startLocation].isKing ? 1 : 0 ;
    if (playerTurn ? (move.endLocation >= 0 && move.endLocation <= 7) : (move.endLocation >= 56 && move.endLocation <= 63))
        board[move.startLocation].isKing = true;
    updateCells(piece, move);
    whitePlayer.arsenal = document.querySelectorAll('.white-piece');
    blackPlayer.arsenal = document.querySelectorAll('.black-piece');
    updateBoard(move); 
    removePiecesAndMovesColor();
    removeClickToArsenal();
    indexClickedPiece = move.endLocation;
    if (move.isMandatory && checkForSuccessiveMoves()) {
        allAvailbleMoves = getAllJumps();
        givePieceAndMovesColor();
    } else {
        indexClickedPiece = null;
        changePlayerTurn();
    }
}
function findIndexMove(endLocation) {
    for (let indexMove = 0; indexMove < allAvailbleMoves.length; indexMove++)
        if (indexClickedPiece === allAvailbleMoves[indexMove].startLocation && endLocation === allAvailbleMoves[indexMove].endLocation)
            return indexMove;
    return null;
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
    cellsArray = [...cells];
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
        playerArsenal[i].removeEventListener('click', logicOfClick);
}
function checkForSuccessiveMoves() {
    for (let endLocation = 0; endLocation < 64; endLocation++)
        if (checkForJumps(indexClickedPiece, endLocation)) return true;
    return false;
}
function getAllJumps() {
    let allJumps = [];
    for (let endLocation = 0; endLocation < 64; endLocation++)
        if (checkForJumps(indexClickedPiece, endLocation))
            allJumps.push(new Move(indexClickedPiece, endLocation, true));
    return allJumps;
}
function changePlayerTurn() {
    if (playerTurn) {
        playerTurn = false;
        whiteTurn.style.color = 'rgba(255, 255, 255, 0.2)';
        blackTurn.style.color = '#D9D9D9';
    } else {
        playerTurn = true;
        whiteTurn.style.color = '#D9D9D9';
        blackTurn.style.color = 'rgba(255, 255, 255, 0.2)';
    }
    if (isStalemate())
        gameOver();
    if (checkArsenalLength())
        gameOver();
    if (checkLengthAllAvailbleMoves())
        gameOver();
    allAvailbleMoves = getAllAvailbleMoves();
    playerArsenal = playerTurn ? whitePlayer.arsenal : blackPlayer.arsenal;
    addClickToArsenal();
}
function getAllAvailbleMoves() {
    let availbleMoves = [];
    for (let startLocation = 0; startLocation < 64; startLocation++)
        if (board[startLocation] !== undefined && board[startLocation] !== null && board[startLocation].color === playerTurn)
            for (let endLocation = 0; endLocation < 64; endLocation++) 
                if (canMove(startLocation, endLocation))
                    if (checkForJumps(startLocation, endLocation))
                        availbleMoves.push(new Move(startLocation, endLocation, true));
                    else
                        availbleMoves.push(new Move(startLocation, endLocation, false));
    return availbleMoves;
}
function canMove(startLocation, endLocation) {
    if (!board[startLocation].isKing) {
        let direction7 = board[startLocation].color ? -7 : 7;
        let direction9 = board[startLocation].color ? -9 : 9;
        if (endLocation - startLocation === direction7 && typeof board[endLocation] !== undefined && board[endLocation] === null) return true;
        if (endLocation - startLocation === direction9 && board[endLocation] === null) return true;
        if (checkForJumps(startLocation ,endLocation)) return true;
        return false;
    } else {
        if (checkForJumps(startLocation, endLocation)) return true;
        let calc = endLocation - startLocation;
        let numOfPossibleMoves;
        let direction;
        if (calc % 7 === 0 && startLocation != endLocation) {
            numOfPossibleMoves = Math.abs(calc / 7);
            direction = calc < 0 ? -7 : 7;
            for (let i = 1; i <= numOfPossibleMoves; i++)
                if (board[startLocation + (direction * i)] !== null) return false;
            return true;
            }
        if (calc % 9 === 0 && startLocation != endLocation) {
            numOfPossibleMoves = Math.abs(calc / 9);
            direction = calc < 0 ? -9 : 9;
            for (let i = 1; i <= numOfPossibleMoves; i++) 
                if (board[startLocation + (direction * i)] !== null) return false;
            return true
        }
        return false;
    }
}
function checkForJumps(startLocation, endLocation) {
    if (!board[startLocation].isKing) {
        let direction7 = board[startLocation].color ? -7 : 7;
        let direction9 = board[startLocation].color ? -9 : 9;
        if (endLocation-startLocation === (direction7 * 2) && typeof board[endLocation] !== undefined && board[endLocation] === null && board[startLocation + direction7] !== null && board[startLocation + direction7].color !== board[startLocation].color) return true;
        if (endLocation-startLocation === (direction9 * 2) && typeof board[endLocation] !== undefined && board[endLocation] === null && board[startLocation + direction9] !== null && board[startLocation + direction9].color !== board[startLocation].color) return true;
        return false;
    } else {
        let calc = endLocation - startLocation;
        let numOfPossibleMoves;
        let direction;
        let countEnemyPieces = 0;
        if (calc % 7 === 0 && startLocation != endLocation && board[endLocation] === null) {
            numOfPossibleMoves = Math.abs(calc / 7);
            direction = calc < 0 ? -7 : 7;
            for (let i = 1; i < numOfPossibleMoves; i++)
                if (board[startLocation + (direction * i)] !== null && board[startLocation + (direction * i)].color != playerTurn) countEnemyPieces++;
        }
        if (calc % 9 === 0 && startLocation != endLocation && board[endLocation] === null) {
            numOfPossibleMoves = Math.abs(calc / 9);
            direction = calc < 0 ? -9 : 9;
            for (let i = 1; i < numOfPossibleMoves; i++) {
                if (board[startLocation + (direction * i)] !== null && board[startLocation + (direction * i)].color != playerTurn) countEnemyPieces++;
            }
        }
        return !(countEnemyPieces > 1 || countEnemyPieces === 0);
    }
}
function checkLengthAllAvailbleMoves() {
    if (allAvailbleMoves.length === 0) {
        isGameOver = true;
        return true;
    }
    return false;
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