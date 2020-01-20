const { Engine, Render, Runner, World, Bodies } = Matter;
const cells = 3; // 3x3 grid
const width = 600;
const height = 600;

const unitLength = width / cells;

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

  const neighbors = shuffle([
    [row - 1, column, "up"],
    [row, column + 1, "right"],
    [row + 1, column, "down"],
    [row, column - 1, "left"]
  ]);
  // for each neighbor
  for (let neighbor of neighbors) {
    const [nextRow, nextColumn, direction] = neighbor;
    // see if that neighbor is out of bounds
    if (
      nextRow < 0 ||
      nextRow >= cells ||
      nextColumn < 0 ||
      nextColumn >= cells
    ) {
      continue;
    }
    if (grid[nextRow][nextColumn]) {
      continue;
    }
    //remove wall from either horizontals or verticals are we going up or down, left or right
    if (direction === "left") {
      verticals[row][column - 1] = true;
    } else if (direction === "right") {
      verticals[row][column] = true;
    } else if (direction === "up") {
      horizontals[row - 1][column] = true;
    } else if (direction === "down") {
      horizontals[row][column] = true;
    }
    // recursion visit next cell

    stepThroughCell(nextRow, nextColumn);
    // console.log(verticals, horizontals);
  }
};

stepThroughCell(startRow, startColumn);
/// will use rectangles to render maze cells to canvas
//itterate over all the verticals and horizantals and for every false value draw a rectangle onto the canvas
// will use a for each for this.
// becasue horizontals is a 2 dimentinaol array so when using forEach will get one of the inner arrays- here called row
horizontals.forEach((row, rowIndex) => {
  // for each value in row that is = true(open) there is no need to draw a wall
  row.forEach((open, columnIndex) => {
    if (open) {
      return;
    }
    // if false draw a rectancle or wall

    const wall = Bodies.rectangle(
      // for the x direction
      columnIndex * unitLength + unitLength / 2,
      // for the y direction
      rowIndex * unitLength + unitLength,
      //width
      unitLength,
      // height
      10,
      {
        isStatic: true
      }
    );
    World.add(world, wall);
  });
});
