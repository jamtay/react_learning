import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const lines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

function Square(props) {
  return (
      <button className={"square " + (props.isWinning ? "square--winning" : "square--normal")}
              onClick={props.onClick}>
        {props.value}
      </button>
  )
}

class Board extends React.Component {
  renderSquare(i) {
    return <Square
        isWinning={this.props.winningSquares.includes(i)}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
    />;
  }

  renderRow(n) {
    let squares = [];
    for (let i = n*3; i < (n*3) + 3; i++) {
      squares.push(this.renderSquare(i))
    }

    return squares;
  }

  renderBoard() {
    let board = [];
    for (let i = 0; i < 3; i++) {
      board.push(<div className="board-row">{this.renderRow(i)}</div>)
    }

    return board;
  }


  render() {
    return (
        <div>
          {this.renderBoard()}
        </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        moveMade: {
          row: '',
          col: ''
        }
      }],
      stepNumber: 0,
      xIsNext: true,
      isDescending: true
    }
  }

  handleClick(i) {
    // Slice() means this.state.squares is not mutated
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (isMoveAvailable(squares, i)) {
      return;
    }

    const moveMade = calcMoveMade(i);

    squares[i] = whoIsNext(this.state.xIsNext);
    //Concat is similar to push but it does not mutate the original array
    this.setState({
      history: history.concat([{
        squares: squares,
        moveMade: moveMade
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    })
  }

  sortHistory() {
    this.setState({
      isDescending: !this.state.isDescending
    })
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const description = move ?
          getMoveDesc(move, step) :
          'Go to game start';
      const isCurrentlySelected = move === this.state.stepNumber;
      return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}>
              {isCurrentlySelected ? <b>{description}</b> : description}
            </button>
          </li>
      );
    });
    let status;
    if (winner) {
      status = 'Winner: ' + winner.player + ' @ squares: ' + winner.line;
    } else if (!current.squares.includes(null)) {
      status = "Draw";
    } else {
      status = 'Next player: ' + (whoIsNext(this.state.xIsNext));
    }

    return (
        <div className="game">
          <div className="game-board">
            <Board
                winningSquares={winner ? winner.line: []}
                squares={current.squares}
                onClick={(i) => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <button onClick={() => this.sortHistory()}>
              Sort by {this.state.isDescending ? "oldest first" : "latest first"}
            </button>
            <ol>{this.state.isDescending ? moves : moves.reverse()}</ol>
          </div>
        </div>
    );
  }
}

const getMoveDesc = (move, step) => {
  return 'Go to move #' + move + ' MoveMade (col, row): ( '
      + step.moveMade.col + ', ' + step.moveMade.row + ')'
};

const calcMoveMade = movePosition => {
  const col = (movePosition % 3) + 1;
  const row = Math.round((movePosition+1)/3)

  return {
    row: row,
    col: col
  }
};

const whoIsNext = xIsNext => {
  return xIsNext ? 'X' : 'O'
};

const calculateWinner = squares => {
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      const arr = []
      arr.push(a)
      arr.push(b)
      arr.push(c)
      return {player: squares[a], line: arr};
    }
  }
  return null;
};

const isMoveAvailable = (squares, i) => {
  return calculateWinner(squares) || squares[i]
};

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);