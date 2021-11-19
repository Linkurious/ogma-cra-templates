import React, { useEffect, useRef } from 'react';
import Ogma from '@linkurious/ogma';

import './Ogma.css';

// here and after the generics are optional but we want to use strict typing
// to use the correct data field in the tooltip formatting function
export default function OgmaWrapper({ graph, onNodeClick, onNodeHover }) {
  const containerId = 'ogma-container';
  // initialize ogma and get a reference to it
  const ogmaRef = useRef();
  useEffect(() => {
    ogmaRef.current = new Ogma({ container: containerId });
  }, []);

  // setup events and more
  useEffect(() => {
    // as suggested by react debug tools, due to ref lifecycle
    const ogma = ogmaRef.current;
    const clickHandler = ({ target }) => {
      if (target && target.isNode) onNodeClick(target.getId());
      else onNodeClick(null); // background was clicked
    };

    const container = ogma.getContainer();
    const hoverHandler = ({ target }) => {
      if (target && target.isNode) {
        const pos = target.getPositionOnScreen();
        // shift by ogma container position
        const x = pos.x + container.offsetLeft;
        const y = pos.y + container.offsetTop;
        // send all the data to the callback
        onNodeHover({
          node: target,
          position: { x, y },
        });
      }
    };

    const outHandler = () => onNodeHover(null);

    ogma.events
      .on('click', clickHandler)
      .on('mouseover', hoverHandler)
      .on('mouseout', outHandler);

    // remove event listeners on unmount
    return () => {
      ogma.events.off(clickHandler);
      ogma.events.off(hoverHandler);
      ogma.events.off(outHandler);
    };
  }, [onNodeClick, onNodeHover]);

  // update graph
  useEffect(() => {
    const ogma = ogmaRef.current;
    ogma.clearGraph();
    ogma
      .setGraph(graph)
      .then(() => ogma.layouts.force({ locate: graph.nodes.length !== 0 }))

      // primitive tracking of the current attributes
      // this is where you can send the updates to your state management,
      // e.g. redux, etc
      .then(() => {
        graph.nodes = ogma
          .getNodes()
          .toJSON({ attributes: ['x', 'y', 'radius'] });
        graph.edges = ogma.getEdges().toJSON({ attributes: ['width'] });
      });
  }, [graph]);

  return <div id={containerId} className="visualization" />;
}
