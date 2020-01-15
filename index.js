const {
  Engine,
  Render,
  Runner,
  World,
  Bodies,
  MouseConstraint,
  Mouse
} = Matter;
// boilerplate code related to Matter JS
const width = 800;
const height = 600;
const engine = Engine.create();
const { world } = engine;
const render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    width,
    height
  }
});
Render.run(render);
Runner.run(Runner.create(), engine);
//////////////Maze algorithm
// create a grid of cells - 2 dimentional array
// pick a random starting cell
// for that cell build a randomly ordered list of neighbors
// if a neighbor has been visited before, reomove it from the list
// for each remaiing neighbor, "move " to it and remvoe the wall between those two cells
// repeat this for new neighbor
