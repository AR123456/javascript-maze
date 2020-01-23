const { Engine, Render, Runner, World, Bodies, Body, Events } = Matter;
const cells = 6; // 3x3 grid
// const width = 600;
// const height = 600;
const width = window.innerWidth;
const height = window.innerHeight;

const unitLength = width / cells;

const engine = Engine.create();
// this disables gravity
engine.world.gravity.y = 0;
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
  Bodies.rectangle(width / 2, 0, width, 2, { isStatic: true }),
  Bodies.rectangle(width / 2, height, width, 2, { isStatic: true }),
  Bodies.rectangle(0, height / 2, 2, height, { isStatic: true }),
  Bodies.rectangle(width, height / 2, 2, height, { isStatic: true })
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
  }
};

stepThroughCell(startRow, startColumn);

horizontals.forEach((row, rowIndex) => {
  row.forEach((open, columnIndex) => {
    if (open) {
      return;
    }
    const wall = Bodies.rectangle(
      // x
      columnIndex * unitLength + unitLength / 2,
      // y
      rowIndex * unitLength + unitLength,
      //width
      unitLength,
      // height
      5,
      {
        // adding label of wall for win annimation
        label: "wall",
        isStatic: true
      }
    );
    World.add(world, wall);
  });
});
verticals.forEach((row, rowIndex) => {
  row.forEach((open, columnIndex) => {
    if (open) {
      return;
    }
    //create the wall
    const wall = Bodies.rectangle(
      //x
      columnIndex * unitLength + unitLength,
      // y
      rowIndex * unitLength + unitLength / 2,
      //width
      5,
      // height
      unitLength,
      // is static
      {
        // adding label of wall for win annimation
        label: "wall",
        isStatic: true
      }
    );
    World.add(world, wall);
  });
});

// draw goal
const goal = Bodies.rectangle(
  //x
  width - unitLength / 2,
  //y
  height - unitLength / 2,
  //height 70% of the size of the cell
  unitLength * 0.7,
  //width
  unitLength * 0.7,
  {
    // label for collision detection
    label: "goal",
    isStatic: true
  }
);
World.add(world, goal);
// draw the ball
const ball = Bodies.circle(
  // x
  unitLength / 2,
  //y
  unitLength / 2,
  //radius of ball
  unitLength / 4,
  // label it bal for collision detection
  {
    label: "ball"
  }
);
World.add(world, ball);
// add event listener
document.addEventListener("keydown", event => {
  const { x, y } = ball.velocity;
  if (event.keyCode === 87) {
    // change movement of ball with key press
    Body.setVelocity(ball, { x, y: y - 5 });
  }
  if (event.keyCode === 68) {
    Body.setVelocity(ball, { x: x + 5, y });
  }
  if (event.keyCode === 83) {
    Body.setVelocity(ball, { x, y: y + 5 });
  }
  if (event.keyCode === 65) {
    Body.setVelocity(ball, { x: x - 5, y });
  }
});
// Win
Events.on(engine, "collisionStart", event => {
  // the event object gets reused by matterjs, so it keeps getting reset and removed
  //
  event.pairs.forEach(collision => {
    // using this array for coparison for code efficiency
    const labels = ["ball", "goal"];

    if (
      labels.includes(collision.bodyA.label) &&
      labels.includes(collision.bodyB.label)
    ) {
      // console.log("win!");
      // with win co/lapse all the parts of the game
      //turn gravity back on
      world.gravity.y = 1;
      // loop over walls and remove the static flag - add a label of vertical and horizontal wall above, update is static to false
      world.bodies.forEach(body => {
        if (body.label === "wall") {
          Body.setStatic(body, false);
        }
      });
    }
  });
});
