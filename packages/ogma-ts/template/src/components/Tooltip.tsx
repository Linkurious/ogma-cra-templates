import React from 'react';
import { Point } from '@linkurious/ogma';
import './Tooltip.css';

type TooltipProps<T extends Object> = {
  position: Point;
  data: T;
};

export default function Tooltip<T extends Object>({
  position,
  data,
}: TooltipProps<T>) {
  return (
    <div className="tooltip" style={{ top: position.y + 50, left: position.x }}>
      <div className="tooltip-content">
        Node <code>{JSON.stringify(data)}</code>
      </div>
    </div>
  );
}
