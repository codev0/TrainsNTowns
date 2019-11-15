const { createGraph } = require("./src/graphUtils");

const graph = createGraph();
const nodes = ["a", "b", "c", "d", "e"];
const edges = [
  ["a", "b", 5],
  ["b", "c", 4],
  ["c", "d", 8],
  ["d", "c", 8],
  ["d", "e", 6],
  ["a", "d", 5],
  ["c", "e", 2],
  ["e", "b", 3],
  ["a", "e", 7]
];

nodes.forEach(node => {
  graph.addNode(node);
});

edges.forEach(nodes => {
  graph.addEdge(...nodes);
});

console.log(graph.getStops("c", 3));
console.log(graph.edges);

// Tasks 1 - 5
const distanceCases = [
  ["a", "b", "c"],
  ["a", "d"],
  ["a", "d", "c"],
  ["a", "e", "b", "c", "d"],
  ["a", "e", "d"]
];
distanceCases.forEach(item => {
  const distance = graph.getDistance(item);
  console.log(distance !== -1 ? distance : "NO SUCH ROUTE");
});
