import React from 'react';

const DraggableText = ({ 
  text, 
  elementKey, 
  element, 
  textColor, 
  onDragStart, 
  style = {}, 
  width = '400px' 
}) => {
  const widthOffset = width === '500px' ? 250 : width === '200px' ? 100 : 200;
  const heightOffset = style.fontSize ? Math.ceil(style.fontSize / 2) : 15;

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, elementKey)}
      className=" w-full absolute cursor-move hover:bg-blue-50 hover:bg-opacity-50 p-2 rounded border-2 border-dashed border-transparent hover:border-blue-400"
      style={{
        left: element.x - widthOffset,
        top: element.y - heightOffset,
        width: width,
        textAlign: 'center',
        color: textColor,
        ...style
      }}
    >
      {text}
    </div>
  );
};

export default DraggableText;