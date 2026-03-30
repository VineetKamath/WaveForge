export function detectCycle(services) {
  const adj = new Map();
  for (const s of services) {
    adj.set(s.id, s.dependencies);
  }

  const visited = new Set();
  const recStack = new Set();
  const path = [];

  function dfs(node) {
    if (recStack.has(node)) {
      path.push(node);
      return true;
    }
    if (visited.has(node)) return false;

    visited.add(node);
    recStack.add(node);
    path.push(node);

    const neighbors = adj.get(node) || [];
    for (const neighbor of neighbors) {
      if (dfs(neighbor)) return true;
    }

    recStack.delete(node);
    path.pop();
    return false;
  }

  for (const s of services) {
    if (!visited.has(s.id)) {
      if (dfs(s.id)) {
        // Extract the cycle from the path
        const cycleStart = path.indexOf(path[path.length - 1]);
        return path.slice(cycleStart);
      }
    }
  }

  return null;
}

export function topologicalSort(services) {
  const adj = new Map();
  const inDegree = new Map();
  for (const s of services) {
    adj.set(s.id, []);
    inDegree.set(s.id, 0);
  }

  for (const s of services) {
    for (const dep of s.dependencies) {
      if (adj.has(dep)) {
        adj.get(dep).push(s.id);
        inDegree.set(s.id, inDegree.get(s.id) + 1);
      }
    }
  }

  const queue = [];
  for (const [node, degree] of inDegree.entries()) {
    if (degree === 0) queue.push(node);
  }

  const sorted = [];
  while (queue.length > 0) {
    const node = queue.shift();
    sorted.push(node);
    for (const neighbor of adj.get(node) || []) {
      inDegree.set(neighbor, inDegree.get(neighbor) - 1);
      if (inDegree.get(neighbor) === 0) {
        queue.push(neighbor);
      }
    }
  }

  return sorted;
}
