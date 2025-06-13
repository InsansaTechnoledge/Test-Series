import React from 'react';

const DraggableLogo = ({ src, alt, elementKey, element, onDragStart }) => {
  return (
    <img
      src={src}
      alt={alt}
      draggable
      onDragStart={(e) => onDragStart(e, elementKey)}
      className="absolute cursor-move hover:opacity-80 border-2 border-dashed border-transparent hover:border-blue-400"
      style={{
        left: element.x,
        top: element.y,
        width: element.width,
        height: element.height,
        objectFit: 'contain'
      }}
    />
  );
};

export default DraggableLogo;