import React from "react";
import ReactDOM, { render } from "react-dom";
import "./index.css";

const BOARD_SIZE = 3;

function Square(props) {
  return (
    <button
      className="square"
      onClick={props.onClick}
      style={props.isWinSquare ? { color: "red" } : { color: "black" }}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        isWinSquare={
          this.props.winLine
            ? this.props.winLine.includes(i)
              ? true
              : false
            : false
        }
      />
    );
  }
  render() {
    let board = [];
    for (let i = 0; i < 3; i++) {
      let boardRow = [];
      for (let j = 0; j < 3; j++) {
        boardRow.push(this.renderSquare(i * BOARD_SIZE + j));
      }
      board.push(
        <div key={i} className="board-row">
          {boardRow}
        </div>
      );
    }
    return <div>{board}</div>;
  }
}
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          lastTurn: -1,
        },
      ],
      xIsNext: true,
      stepNumber: 0,
      sortIsAscending: true,
    };
  }
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
          lastTurn: i,
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }
  toggleSort() {
    let sortOrder = this.state.sortIsAscending;
    this.setState({
      sortIsAscending: !sortOrder,
    });
  }
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    let winLine;
    let position;
    if (current.lastTurn === -1) {
      position = "";
    } else {
      position =
        "(" +
        Math.floor(current.lastTurn / 3 + 1) +
        "," +
        Math.round((current.lastTurn % 3) + 1) +
        ")";
    }

    let moves = history.map((step, move) => {
      const desc = move
        ? "Go to move #" +
          move +
          " " +
          "(" +
          Math.floor(history[move].lastTurn / 3 + 1) +
          "," +
          Math.round((history[move].lastTurn % 3) + 1) +
          ")"
        : "Go to gamestart";
      return (
        <li key={move}>
          <button
            onClick={() => this.jumpTo(move)}
            style={
              move === this.state.stepNumber
                ? { fontWeight: "bold" }
                : { fontWeight: "normal" }
            }
          >
            {desc}
          </button>
        </li>
      );
    });
    if (this.state.sortIsAscending) {
      moves = moves.reverse();
    }
    let status;
    if (winner) {
      status = "Winner: " + winner.winner;
      winLine = Object.values(winner.winResult);
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }
    if (winner === null && allVisited(current.squares)) {
      status = "Draw";
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winLine={winLine}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => this.toggleSort()}>
            {this.state.sortIsAscending
              ? "Ascending Moves"
              : "Descending Moves"}
          </button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
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
      return {
        winner: squares[a],
        winResult: [a, b, c],
      };
    }
  }
  return null;
}
function allVisited(square) {
  let result = true;
  for (let i = 0; i < square.length; i++) {
    if (square[i] === null) {
      return false;
    }
  }
  return result;
}
ReactDOM.render(<Game />, document.getElementById("root"));
