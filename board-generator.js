import { NUMBERS_CNT, GRID_SIZE, DIFFICULTIES } from "./util.js";

export function generateBoard(difficulty, mistakes) {
  const wrap = document.querySelector(".wrap");
  generateStatus(wrap, difficulty, mistakes);
  generateGrid(wrap);
  generateNumbers(wrap);
}

function generateStatus(wrap, difficulty, mistakes) {
  const statusBox = document.createElement("div");
  statusBox.classList.add("status");
  statusBox.innerHTML = `
    <div>Difficulty: <span class="status-difficulty">${DIFFICULTIES[difficulty].name}</span></div>
    <div>Mistakes: <span class="status-mistakes">${mistakes}</span></div>
    <div>Time: <span class="status-time">00:00</span></div>
  `;
  wrap.appendChild(statusBox);
}

function generateGrid(wrap) {
  const grid = document.createElement("div");
  grid.classList.add("grid");
  for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");

    grid.appendChild(cell);
  }
  wrap.appendChild(grid);
}

function generateNumbers(wrap) {
  const numbers = document.createElement("div");
  numbers.classList.add("numbers");
  for (let i = 0; i < NUMBERS_CNT; i++) {
    const numberElement = document.createElement("div");
    if (i === NUMBERS_CNT - 1) {
      numberElement.classList.add("remove");
      numberElement.innerHTML = "x";
    } else {
      numberElement.classList.add("number");
      numberElement.innerHTML = `${i + 1}`;
    }
    numbers.appendChild(numberElement);
  }
  wrap.appendChild(numbers);
}
