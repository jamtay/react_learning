import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
      <button className="square" onClick={props.onClick}>
        {props.value}
      </button>
  )
}

class Board extends React.Component {
  renderSquare(i) {
    return <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
    />;
  }

  render() {
    return (
        <div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
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
      xIsNext: true
    }
  }

  handleClick(i) {
    // Slice() means this.state.squares is not mutated
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (isMoveAvaliable(squares, i)) {
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
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (whoIsNext(this.state.xIsNext));
    }

    return (
        <div className="game">
          <div className="game-board">
            <Board
                squares={current.squares}
                onClick={(i) => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
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
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
};

const isMoveAvaliable = (squares, i) => {
  return calculateWinner(squares) || squares[i]
};

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);