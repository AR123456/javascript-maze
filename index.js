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
  // reoreder elements in array
  // get the length of the array and set it to the variable counter
  let counter = arr.length;

  while (counter > 0) {
    //get a random index inside of the array
    const index = Math.floor(Math.random() * counter);
    //decrease the counter var by one
    counter--;
    //swap the elements that are at the index of index with what is at  index of counter
    // this ensures that we swap each element at least one time
    const temp = arr[counter];
    // update value at index of counter
    arr[counter] = arr[index];
    // update index to be what it was previously at counter
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
  // assemble randomly ordered list of neighbors need the indices(corredinates ) of the neighbors
  // wrap the neighbors const in the shuffle function
  const neighbors = shuffle([
    [row - 1, column],
    [row, column + 1],
    [row + 1, column],
    [row, column - 1]
  ]);
  console.log(neighbors);
  // for each neighbor
  // see if that neighbor is out of bounds
  // see if I have visited that neghbor , continue to next neigbhor
  //remove wall from either horizontals or verticals
  // visit next cell
  //
};

stepThroughCell(1, 1); // to test the shuffle
// stepThroughCell(startRow, startColumn);
