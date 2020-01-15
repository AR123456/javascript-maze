const { Engine, Render, Runner, World, Bodies } = Matter;
// boilerplate code related to Matter JS
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

//Maze generation - using for loops
// const grid = [];
// for (let i = 0; i < 3; i++) {
//   grid.push([]);
//   for (let j = 0; j < 3; j++) {
//     grid[i].push(false);
//   }
// }
// console.log(grid);

// Maze generation - better way using map
// this is more scalable if later we wanted more rows and or columns can just increase the
const grid = Array(3) //rows
  .fill(null)
  .map(() => Array(3).fill(false));//columns 

console.log(grid);
