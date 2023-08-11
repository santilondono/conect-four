import { useState } from "react"
import { Square } from "./components/Square"
import { TURNS } from "./constants"
import { WinnerModal } from "./components/WinnerModal"

function App() {
  const [board, setBoard] = useState(() => {
    const boardFromStorage = window.localStorage.getItem('board')
    if (boardFromStorage) return JSON.parse(boardFromStorage)
    return new Array(42).fill(null)
  })

  const [turn, setTurn] = useState(() => {
    const turnFromStorage = window.localStorage.getItem('turn')
    return turnFromStorage ?? TURNS.R
  })

  const [winner, setWinner] = useState(null) //null: no hay gandor,false: hay empate

  const updateBoard = (index) => {
    //Si ya hay algo o hay ganador no hacer nada 
    if (board[index] || winner) return
    //Actualizar tablero
    const newBoard = [...board]
    const column = index % 7
    setBoard(columnUpdate(newBoard, column))
    //Actualizar turno
    const newTurn = turn === TURNS.R ? TURNS.Y : TURNS.R
    setTurn(newTurn)
    //guardar partida
    window.localStorage.setItem('board', JSON.stringify(newBoard))
    window.localStorage.setItem('turn', newTurn)
    //revisar si hay ganador
    const newWinner = checkWinner(newBoard, turn)
    console.log(newWinner)
    if (newWinner) {
      setWinner(newWinner)
      console.log('hay ganador');
    } else if (checkEndGame(newBoard)) {
      setWinner(false)
    }
  }

  const columnUpdate = (board, column) => {
    let finished = false
    board.map((_, index) => {
      if (index % 7 === column) {
        for (let row = 5; row >= 0; row--) {
          if (board[row * 7 + column] === null) {
            board[row * 7 + column] = turn
            finished = true
            break
          }
          if (finished) break
        }
      }
    })
    return board
  }

  const checkWinner = (board, player) => {
    const consecutive = 4;
    let count = 0;
    let winner = null

    //chequeo horizontal
    board.map((_, index) => {
      if (index % 7 === 0) count = 0
      if (board[index] === player) {
        count++
      } else {
        count = 0
      }
      if (count === consecutive) {
        console.log('hay ganador horizontal')
        winner =  player
      }
    })

    //chequeo vertical
    board.map((_, index) => {
      if (index) {
        if (board[index] === player &&
          board[index - 7] === player &&
          board[index - 14] === player &&
          board[index - 21] === player ) {
          console.log('hay ganador vertical')
          winner =  player
        }
      }
    })

    //chequeo diagonal positiva
    count = 0
    board.map((_, index) => {
      if (index && count < 4) {
        if (board[index] === player &&
          board[index - 6] === player &&
          board[index - 12] === player &&
          board[index - 18] === player) {
          console.log('hay ganador diagonal positiva')
          winner =  player
        }
      }
      count++
      if (count === 7) count = 0
    })

    //chequeo diagonal negativa
    count = 0
    board.map((_, index) => {
      if (index && count > 2) {
        if (board[index] === player &&
          board[index - 8] === player &&
          board[index - 16] === player &&
          board[index - 24] === player) {
          console.log('hay ganador diagonal negativa')
          winner =  player
        }
      }
      count++
      if (count === 7) count = 0

    })

    return winner
  }

  const checkEndGame = (newBoard) => {
    //Revisar si hay un empate
    return newBoard.every((square) => square !== null)
  }

  const resetGame = () => {
    setBoard(Array(42).fill(null))
    setTurn(TURNS.R)
    setWinner(null)

    window.localStorage.removeItem('board')
    window.localStorage.removeItem('turn')
  }

  return (
    <>
      <main className="board">
        <h1>Connect four</h1>
        <button onClick={resetGame}>Restart</button>
        <section className="game">
          {
            board.map((_, index) => {
              return (
                <Square
                  key={index}
                  index={index}
                  updateBoard={updateBoard}
                >
                  {board[index]}
                </Square>
              )
            })
          }
        </section>
        <section className="turn">
          <Square isSelected={turn === TURNS.Y}>
            {TURNS.Y}
          </Square>
          <Square isSelected={turn === TURNS.R}>
            {TURNS.R}
          </Square>
        </section>
        <WinnerModal resetGame={resetGame} winner={winner} />
      </main>
    </>
  )
}

export default App
