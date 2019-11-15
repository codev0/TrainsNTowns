const { createQueue } = require("./createQueue");

function createNode(key) {
  const children = [];

  return {
    key,
    children,
    addChild(node) {
      children.push(node);
    }
  };
}

function createGraph() {
  const nodes = [];
  const edges = [];

  return {
    nodes,
    edges,

    addNode(key) {
      nodes.push(createNode(key));
    },

    getNode(key) {
      return nodes.find(n => n.key === key);
    },

    addEdge(node1Key, node2Key, weight) {
      const node1 = this.getNode(node1Key);
      const node2 = this.getNode(node2Key);

      node1.addChild(node2);

      edges.push({ from: node1Key, to: node2Key, weight });
    },

    print() {
      return nodes
        .map(({ children, key }) => {
          let result = `${key}`;

          if (children.length) {
            result += ` => ${children.map(node => node.key).join(" ")}`;
          }

          return result;
        })
        .join("\n");
    },

    getDistance(nodes) {
      let distance = 0;
      for (let i = 0; i < nodes.length - 1; i++) {
        const weight = this.getWeight(nodes[i], nodes[i + 1]);
        if (weight === -1) {
          distance = -1;
          break;
        }
        distance += weight;
      }
      return distance;
    },

    getWeight(src, dst) {
      const edge = edges.find(edge => edge.from === src && edge.to === dst);
      return edge ? edge.weight : -1;
    },

    getStops(startingNodeKey, max) {
      let counter = 0;
      let adjacents = [];
      let path = `${startingNodeKey}`;
      this.bfs(startingNodeKey, node => {
        adjacents.push(node);
      });

      for (let i = 0; i < adjacents.length; i++) {
        adjacents[i].children.forEach(child => {
          if (child.key === startingNodeKey) {
            path += adjacents[i].key;
            counter++;
          }
        });
      }
      return path;
    },

    bfs(startingNodeKey, visitFn) {
      const startingNode = this.getNode(startingNodeKey);
      const visitedHash = nodes.reduce((acc, cur) => {
        acc[cur.key] = false;
        return acc;
      }, {});
      const queue = createQueue();
      queue.enqueue(startingNode);

      while (!queue.isEmpty()) {
        const currentNode = queue.dequeue();

        if (!visitedHash[currentNode.key]) {
          visitFn(currentNode);
          visitedHash[currentNode.key] = true;
        }

        currentNode.children.forEach(node => {
          if (!visitedHash[node.key]) {
            queue.enqueue(node);
          }
        });
      }
    },

    dfs(startingNodeKey, visitFn) {
      const startingNode = this.getNode(startingNodeKey);
      const visitedHash = nodes.reduce((acc, cur) => {
        acc[cur.key] = false;
        return acc;
      }, {});

      function explore(node) {
        if (visitedHash[node.key]) {
          return;
        }

        visitFn(node);
        visitedHash[node.key] = true;

        node.children.forEach(child => {
          explore(child);
        });
      }

      explore(startingNode);
    }
  };
}

exports.createNode = createNode;
exports.createGraph = createGraph;
