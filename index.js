const {
  Engine,
  Render,
  Runner,
  World,
  Bodies,
  Body,
  Events,
  MouseConstraint,
  Mouse
} = Matter;

const cellsHorizontal = 8;
const cellsVertical = 6;
// now using window
const width = window.innerWidth;
const height = window.innerHeight;

const unitLengthX = width / cellsHorizontal;
const unitLengthY = height / cellsVertical;

const engine = Engine.create();
// this disables gravity
engine.world.gravity.y = 0;
const { world } = engine;
const render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    // wireframes: true,// change to false to add color
    wireframes: false,
    width,
    height
  }
});
Render.run(render);
Runner.run(Runner.create(), engine);
World.add(
  world,
  MouseConstraint.create(engine, {
    mouse: Mouse.create(render.canvas)
  })
);
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

const grid = Array(cellsVertical) //rows
  .fill(null)
  .map(() => Array(cellsHorizontal).fill(false)); //columns

// vertical lines
const verticals = Array(cellsVertical) //rows
  .fill(null)
  .map(() => Array(cellsHorizontal - 1).fill(false)); //columns

// horizontal lines
const horizontals = Array(cellsVertical - 1) //rows
  .fill(null)
  .map(() => Array(cellsHorizontal).fill(false)); //columns
const startRow = Math.floor(Math.random() * cellsVertical); //row
const startColumn = Math.floor(Math.random() * cellsHorizontal); // column

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
      nextRow >= cellsVertical ||
      nextColumn < 0 ||
      nextColumn >= cellsHorizontal
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
      columnIndex * unitLengthX + unitLengthX / 2, // center point in x direction
      // y
      rowIndex * unitLengthY + unitLengthY, // center point in y direction
      //width x direction
      unitLengthX,
      // height
      5,
      {
        // adding label of wall for win annimation
        label: "wall",
        isStatic: true,
        // to add color
        render: {
          fillStyle: "red"
        }
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
      columnIndex * unitLengthX + unitLengthX, // center point in x direction
      // y
      rowIndex * unitLengthY + unitLengthY / 2, // center point in y direction
      //width
      5,
      // height
      unitLengthY, // center point in y direction(vertical)
      // is static
      {
        // adding label of wall for win annimation
        label: "wall",
        isStatic: true,
        // to add color
        render: {
          fillStyle: "red"
        }
      }
    );
    World.add(world, wall);
  });
});

// draw goal
const goal = Bodies.rectangle(
  //x
  width - unitLengthX / 2,
  //y
  height - unitLengthY / 2,
  //width
  unitLengthY * 0.7,
  //height 70% of the size of the cell
  unitLengthX * 0.7,

  {
    // label for collision detection
    label: "goal",
    isStatic: true,
    // for color
    render: {
      fillStyle: "green"
    }
  }
);
World.add(world, goal);
// draw the ball
// taking the minumum of unit length of eiter s or y / 4
const ballRadius = Math.min(unitLengthX, unitLengthY) / 4;
const ball = Bodies.circle(
  // x
  unitLengthX / 2,
  //y
  unitLengthY / 2,
  //radius of ball
  ballRadius,
  // label it bal for collision detection
  {
    label: "ball",
    // for color
    render: {
      fillStyle: "blue"
    }
  }
);
World.add(world, ball);

// using arrow keys
document.addEventListener("keydown", event => {
  const { x, y } = ball.velocity;
  // up
  if (event.keyCode === 38) {
    // change movement of ball with key press
    Body.setVelocity(ball, { x, y: y - 5 });
  }
  //right
  if (event.keyCode === 39) {
    Body.setVelocity(ball, { x: x + 5, y });
  }
  //down
  if (event.keyCode === 40) {
    Body.setVelocity(ball, { x, y: y + 5 });
    //left
  }
  if (event.keyCode === 37) {
    Body.setVelocity(ball, { x: x - 5, y });
  }
});
// Win -
Events.on(engine, "collisionStart", event => {
  event.pairs.forEach(collision => {
    const labels = ["ball", "goal"];
    if (
      labels.includes(collision.bodyA.label) &&
      labels.includes(collision.bodyB.label)
    ) {
      document.querySelector(".winner").classList.remove("hidden");
      world.gravity.y = 1;
      world.bodies.forEach(body => {
        if (body.label === "wall") {
          Body.setStatic(body, false);
        }
      });
    }
  });
});
