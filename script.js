import { Sudoku } from "./sudoku.js";
import { BOX_SIZE, GRID_SIZE, convertIndexToPosition, convertPositionToIndex } from "./util.js";

const sudoku = new Sudoku();
let cells;
let selectedCellIndex;
let selectedCell;
init();

function init() {
    initCells();
    initNumbers();
    initRemover();
    initKeyEvent();
}

function initCells() {
    cells = document.querySelectorAll(".cell");
    fillCells();
    initCellsEvent();
}

function fillCells() {
    for (let i = 0;i < GRID_SIZE * GRID_SIZE; i++) {
        const {row, column} = convertIndexToPosition(i);

        if (sudoku.grid[row][column] !== null) {
            cells[i].classList.add("filled");
            cells[i].innerHTML = sudoku.grid[row][column];
        }
    }
}

function initCellsEvent() {
    cells.forEach((cell, idx) => {
        cell.addEventListener("click", () => onCellClick(cell, idx));
    })
}

function onCellClick(clickedCell, index) {
    cells.forEach(cell => cell.classList.remove("selected", "highlighted", "error"));

    if (clickedCell.classList.contains("filled") || clickedCell === selectedCell) {
        deselect();
    } else {
        selectedCellIndex = index;
        selectedCell = clickedCell;
        clickedCell.classList.add("selected");
        highlightCellBy(index);
    }

    if (clickedCell.innerHTML === "") return;
    cells.forEach(cell => {
        if (cell.innerHTML === clickedCell.innerHTML) cell.classList.add("selected");
    })
}

function highlightCellBy(index) {
    highlightColumnBy(index);
    highlightRowBy(index);
    highlightBoxBy(index);
}

function highlightColumnBy(index) {
    const column = index % GRID_SIZE;
    for (let row = 0; row < GRID_SIZE; row++) {
        const cellIdx = convertPositionToIndex(row, column);
        cells[cellIdx].classList.add("highlighted");
    }
}

function highlightRowBy(index) {
    const row = Math.floor(index / GRID_SIZE);
    for (let column = 0; column < GRID_SIZE; column++) {
        const cellIdx = convertPositionToIndex(row, column);
        cells[cellIdx].classList.add("highlighted");
    }
}

function highlightBoxBy(index) {
    const column = index % GRID_SIZE;
    const row = Math.floor(index / GRID_SIZE);
    const firstRowInBox = row - row % BOX_SIZE;
    const firstColumnInBox = column - column % BOX_SIZE;

    for(let iRow = firstRowInBox; iRow < firstRowInBox + BOX_SIZE; iRow++) {
        for(let iColumn = firstColumnInBox; iColumn < firstColumnInBox + BOX_SIZE; iColumn++) {
            const cellIdx = convertPositionToIndex(iRow, iColumn);
            cells[cellIdx].classList.add("highlighted");
        }
    }
}

function initNumbers() {
    const numbers = document.querySelectorAll(".number");
    numbers.forEach(number => {
        number.addEventListener("click", () => onNumberClick(parseInt(number.innerHTML)));
    });
}

function onNumberClick (num) {
    if (!selectedCell) return;
    if (selectedCell.classList.contains("filled")) return;

    cells.forEach(cell => cell.classList.remove("error", "shake", "zoom", "selected"));
    selectedCell.classList.add("selected");

    setValueInSelectedCell(num);

    if (!sudoku.hasEmptyCells()) {
        setTimeout(() => winAnimation(), 500);
    }
}

function setValueInSelectedCell(value) {
    const {row, column} = convertIndexToPosition(selectedCellIndex);
    const duplicatesPositions = sudoku.getDuplicatePositions(row, column, value);

    if (duplicatesPositions.length) {
        highlightDuplicates(duplicatesPositions);
        return;
    }
    sudoku.grid[row][column] = value;
    selectedCell.innerHTML = value;
    setTimeout(() => {
        cells[selectedCellIndex].classList.add("zoom");
        cells.forEach(cell => cell.classList.remove("selected", "highlighted"));
        deselect();
    }, 0);
}

function highlightDuplicates(duplicatePositions) {
    duplicatePositions.forEach(({row, column}) => {
        const idx = convertPositionToIndex(row, column);
        setTimeout(() => cells[idx].classList.add("shake", "error"), 0);
    });
}

function initRemover() {
    const remover = document.querySelector(".remove");
    remover.addEventListener("click", () => onRemoveClick());
}

function onRemoveClick() {
    if (!selectedCell) return;
    if (selectedCell.classList.contains("filled")) return;

    cells.forEach(cell => cell.classList.remove("error", "shake", "zoom", "selected"));
    selectedCell.classList.add("selected");

    const {row, column} = convertIndexToPosition(selectedCellIndex);
    selectedCell.innerHTML = "";
    sudoku.grid[row][column] = null;
}

function initKeyEvent() {
    document.addEventListener("keydown", e => {
        if (e.key === "Backspace") {
            onRemoveClick();
        } else if (e.key >= "1" && e.key <= "9") {
            onNumberClick(parseInt(e.key));
        }
    })
}

function winAnimation() {
    cells.forEach(cell => cell.classList.remove("error", "shake", "zoom", "selected", "highlighted"));
    cells.forEach((cell, i) => {
        setTimeout(() => cell.classList.add("highlighted", "zoom"), i * 15);
    });
    for (let i = 0; i < 10; i++) {
        setTimeout(() => cells.forEach(cell => cell.classList.toggle("highlighted")), 500 + cells.length*15 + 300*i);
    }
}

function deselect() {
    selectedCell = null;
    selectedCellIndex = null;
}