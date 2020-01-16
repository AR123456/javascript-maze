const { Engine, Render, Runner, World, Bodies } = Matter;
const cells = 3; // 3x3 grid
const width = 600;
const height = 600;
const engine = Engine.create();
const { world } = engine;
const render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    wierframes: true,
    width,
    height
  }
});
Render.run(render);
Runner.run(Runner.create(), engine);
//walls
const walls = [
  Bodies.rectangle(width / 2, 0, width, 40, { isStatic: true }),
  Bodies.rectangle(width / 2, height, width, 40, { isStatic: true }),
  Bodies.rectangle(0, height / 2, 40, height, { isStatic: true }),
  Bodies.rectangle(width, height / 2, 40, height, { isStatic: true })
];
World.add(world, walls);
// Maze generation -
// shuffle the neighbors function
const shuffle = arr => {
  let counter = arr.length;
  while (counter > 0) {
    const index = Math.floor(Math.random() * counter);
    counter--;
    const temp = arr[counter];
    arr[counter] = arr[index];
    arr[index] = temp;
  }
  return arr;
};

const grid = Array(cells) //rows
  .fill(null)
  .map(() => Array(cells).fill(false)); //columns

// vertical lines
const verticals = Array(cells) //rows
  .fill(null)
  .map(() => Array(cells - 1).fill(false)); //columns

// horizontal lines
const horizontals = Array(cells - 1) //rows
  .fill(null)
  .map(() => Array(cells).fill(false)); //columns
const startRow = Math.floor(Math.random() * cells);
const startColumn = Math.floor(Math.random() * cells);

// function to generate grid
const stepThroughCell = (row, column) => {
  // If cell at row,column has been visited return
  if (grid[row][column]) {
    return;
  }
  // mark cell as visited - make true
  grid[row][column] = true;
  // add a third element to this array to keep track of direction of travel
  const neighbors = shuffle([
    [row - 1, column, "up"], //up
    [row, column + 1, "right"], // to right
    [row + 1, column, "down"], //down
    [row, column - 1, "left"] // to left
  ]);
  // for each neighbor
  for (let neighbor of neighbors) {
    // destructor neighbor a bit
    const [nextRow, nextColumn, direction] = neighbor;
    // see if that neighbor is out of bounds using the cell const
    if (
      nextRow < 0 ||
      nextRow >= cells ||
      nextColumn < 0 ||
      nextColumn >= cells
    ) {
      //continue the for loop if any of this is true but do not do anything
      continue;
    }
    // see if I have visited that neghbor , continue to next neigbhor
    // using grid to keep track of visits so
    if (grid[nextRow][nextColumn]) {
      continue;
    }
    //remove wall from either horizontals or verticals are we going up or down, left or right
  }
  // visit next cell
  //
};

stepThroughCell(startRow, startColumn);
