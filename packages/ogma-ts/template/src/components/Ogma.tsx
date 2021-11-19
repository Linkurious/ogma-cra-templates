import React, { useEffect, useRef } from "react";
import Ogma, {
  MouseButtonEvent,
  MouseOverEvent,
  Node,
  NodeId,
  Point,
  RawGraph,
} from "@linkurious/ogma";

import "./Ogma.css";

// expose the data we need to transfer from Ogma click events to the tooltip
export type HoverData<ND, ED> = {
  node: Node<ND, ED>;
  position: Point;
};

// here and after the generics are optional but we want to use strict typing
// to use the correct data field in the tooltip formatting function
export default function OgmaWrapper<ND = any, ED = any>({
  graph,
  onNodeClick,
  onNodeHover,
}: {
  graph: RawGraph;
  onNodeClick: (node: NodeId | null) => unknown;
  onNodeHover: (
    node: { node: Node<ND, ED>; position: Point } | null
  ) => unknown;
}) {
  const containerId = "ogma-container";
  // initialize ogma and get a reference to it
  const ogmaRef = useRef<Ogma<ND, ED>>();
  useEffect(() => {
    ogmaRef.current = new Ogma({ container: containerId });
  }, []);

  // setup events and more
  useEffect(() => {
    // as suggested by react debug tools, due to ref lifecycle
    const ogma = ogmaRef.current as Ogma<ND, ED>;
    const clickHandler = ({ target }: MouseButtonEvent<ND, ED>) => {
      if (target && target.isNode) onNodeClick(target.getId());
      else onNodeClick(null); // background was clicked
    };

    const container = ogma.getContainer() as HTMLElement;
    const hoverHandler = ({ target }: MouseOverEvent<ND, ED>) => {
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
      .on("click", clickHandler)
      .on("mouseover", hoverHandler)
      .on("mouseout", outHandler);

    // remove event listeners on unmount
    return () => {
      ogma.events.off(clickHandler as any);
      ogma.events.off(hoverHandler as any);
      ogma.events.off(outHandler);
    };
  }, [onNodeClick, onNodeHover]);

  // update graph
  useEffect(() => {
    const ogma = ogmaRef.current as Ogma<ND, ED>;
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
          .toJSON({ attributes: ["x", "y", "radius"] });
        graph.edges = ogma.getEdges().toJSON({ attributes: ["width"] });
      });
  }, [graph]);

  return <div id={containerId} className="visualization" />;
}
