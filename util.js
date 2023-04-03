export const GRID_SIZE = 9;
export const BOX_SIZE = 3;

export function convertIndexToPosition(idx) {
    return {
        row: Math.floor(idx/GRID_SIZE),
        column: idx % GRID_SIZE,
    };
}

export function convertPositionToIndex(row, column) {
    return row * GRID_SIZE + column;
}