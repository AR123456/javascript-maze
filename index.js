const { Engine, Render, Runner, World, Bodies } = Matter;
// boilerplate code related to Matter JS

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
const grid = Array(cells) //rows
  .fill(null)
  .map(() => Array(cells).fill(false)); //columns
console.log("Grid", grid);

// vertical lines
const verticals = Array(cells) //rows
  .fill(null)
  .map(() => Array(cells - 1).fill(false)); //columns
console.log("Verticals", verticals);

// horizontal lines
const horizontals = Array(cells - 1) //rows
  .fill(null)
  .map(() => Array(cells).fill(false)); //columns
console.log("Horizontals", horizontals);
