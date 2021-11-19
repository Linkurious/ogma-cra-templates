import React, { useState, useCallback } from 'react';
import './App.css';

import Ogma from './components/Ogma';
import Tooltip from './components/Tooltip';

// random 4 letters
const randomName = () => (Math.random() + 1).toString(36).substring(8);

function App() {
  const [graph, setGraph] = useState({
    nodes: [
      { id: 0, data: { name: 'A' } },
      { id: 1, data: { name: 'B' } },
    ],
    edges: [{ source: 0, target: 1 }],
  });

  const [currentNode, setCurrentNode] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [tooltipData, setTooltipData] = useState(null);

  const addNode = useCallback(() => {
    if (graph.nodes.length === 0) {
      return setGraph({
        nodes: [{ id: 0, data: { name: randomName() } }],
        edges: [],
      });
    }
    const lastNode = graph.nodes[graph.nodes.length - 1];
    setGraph({
      nodes: [
        ...graph.nodes,
        {
          id: graph.nodes.length,
          data: { name: randomName() },
        },
      ],
      edges: [
        ...graph.edges,
        { source: lastNode.id, target: graph.nodes.length },
      ],
    });
  }, [graph.nodes, graph.edges]);

  const removeNode = useCallback(() => {
    const r = graph.nodes.pop();
    if (!r) return;
    setGraph({
      nodes: [...graph.nodes],
      edges: [
        ...graph.edges.filter(e => e.source !== r.id && e.target !== r.id),
      ],
    });
  }, [graph.nodes, graph.edges]);

  function onNodeHover(target) {
    if (target) {
      const { node, position } = target;
      setTooltipData(node.getData() || {});
      setTooltipPosition({
        x: position.x,
        y: position.y,
      });
    } else {
      setTooltipData(null); //setTooltipPos
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <span>
          <span className="brand">Ogma</span> + react
        </span>
      </header>
      <main className="Workspace">
        <section className="Ogma">
          <Ogma
            graph={graph}
            onNodeClick={setCurrentNode}
            onNodeHover={onNodeHover}
          />
          {tooltipData && (
            <Tooltip position={tooltipPosition} data={tooltipData} />
          )}
        </section>
        <nav className="Controls">
          <div className="buttons">
            <button onClick={addNode}>Add node</button>
            <button onClick={removeNode}>Remove node</button>
            <div>
              Clicked node: {currentNode === null ? 'none' : currentNode}
            </div>
          </div>
          <div className="data">
            <code>
              <pre>{JSON.stringify(graph, null, 2)}</pre>
            </code>
          </div>
        </nav>
      </main>
    </div>
  );
}

export default App;
