const { Engine, Render, Runner, World, Bodies } = Matter;

// boilerplate code related to Matter JS
const engine = Engine.create();
const { world } = engine;
// telling matterjs where to draw the canvas
const render = Render.create({
  element: document.body, // addatvie doesnt destroy
  engine: engine,
  options: {
    // this is the height and width of the canvas - this will eventualy be responsive
    width: 800,
    height: 600
  }
});
Render.run(render);
Runner.run(Runner.create(), engine);

///////////////////// end of boilerplate
// create the shape
const shape = Bodies.rectangle(200, 200, 50, 50, {
  // postiion of rect in world and its height and width
  isStatic: true
});
// draws the shape on the screen  check out the world  variable in the console - it has a lot of properties
World.add(world, shape);
