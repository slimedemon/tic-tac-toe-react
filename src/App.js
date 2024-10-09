import { useState } from 'react';

function Square({ value, onSquareClick, isWinningSquare}) {
  return (
    <button className={`square ${isWinningSquare ? 'winning-square' : ''}`} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares, i);
  }

  const result = calculateWinner(squares);
  const winner = result ? result.winner : null;
  const winningLine = result ? result.line : [];

  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else if (squares.filter(square => square === null).length === 0) {
    status = 'Draw: No winner';
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }


  const renderSquare = (i) => {
    const isWinningSquare = winningLine.includes(i);
    return(
      <Square 
        value={squares[i]} 
        onSquareClick={() => handleClick(i)} 
        key={i} 
        isWinningSquare={isWinningSquare}
        />
    );
  };

  const renderRow = (rowIndex) => (
    <div className="board-row" key={rowIndex}>
      {Array(3)
        .fill(null)
        .map((_, colIndex) => renderSquare(rowIndex * 3 + colIndex))}
    </div>
  );

  return (
    <>
      <div className="status">{status}</div>
      {Array(3)
        .fill(null)
        .map((_, rowIndex) => renderRow(rowIndex))}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([{squares: Array(9).fill(null), location: [null, null]}]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove].squares;
  const location = history[currentMove].location;
  const [isAscending, setIsAscending] = useState(true);

  function handlePlay(nextSquares, index) {
    const row = Math.floor(index / 3);
    const col = index % 3;
    const nextHistory = [...history.slice(0, currentMove + 1), {squares: nextSquares, location: [row, col]}];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const toggleSortOrder = () => {
    setIsAscending(!isAscending);
  };

  const moves = history.map((value, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move + ' at location (' + value.location[0] + ', '+ value.location[1] + ')';
    } else {
      description = 'Go to game start';
    }

    if(move == currentMove){
      return;
    }
    
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  if (!isAscending) {
    moves.reverse();
  }

  return (
    <div className="game">
      
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <div>You are at move #{currentMove} {location[0] !== null ? `at location (${location[0]}, ${location[1]})` : ''} </div>
        <button onClick={toggleSortOrder}>
          {isAscending ? 'Sort Descending' : 'Sort Ascending'}
        </button>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return null;
}
