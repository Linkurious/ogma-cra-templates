import React from 'react';
import './Tooltip.css';

export default function Tooltip({ position, data }) {
  return (
    <div className="tooltip" style={{ top: position.y + 50, left: position.x }}>
      <div className="tooltip-content">
        Node <code>{JSON.stringify(data)}</code>
      </div>
    </div>
  );
}
