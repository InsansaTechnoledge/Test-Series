import React, { forwardRef } from 'react';
import DraggableLogo from './DraggableLogo';
import DraggableText from './DraggableText';
import DecorativeElements from './DecorativeElements';

const CertificateCanvas = forwardRef(({ data, handlers }, ref) => {
  const {
    certificateType,
    recipientName,
    courseName,
    date,
    backgroundColor,
    borderColor,
    textColor,
    accentColor,
    orgLogo,
    ourLogo,
    elements
  } = data;

  const { handleDragStart, handleDragOver, handleDrop } = handlers;

  return (
    <div
      ref={ref}
      className="relative border-2 border-gray-300 cursor-move"
      style={{
        width: '800px',
        height: '600px',
        backgroundColor: backgroundColor,
        backgroundImage: `linear-gradient(45deg, ${backgroundColor}00 25%, ${accentColor}10 25%, ${accentColor}10 50%, ${backgroundColor}00 50%, ${backgroundColor}00 75%, ${accentColor}10 75%)`
      }}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Decorative Border */}
      <div
        className="absolute inset-4 border-4 rounded-lg"
        style={{ borderColor: borderColor }}
      >
        {/* Corner Decorations */}
        <div className="absolute -top-2 -left-2 w-6 h-6 rotate-45" style={{ backgroundColor: accentColor }}></div>
        <div className="absolute -top-2 -right-2 w-6 h-6 rotate-45" style={{ backgroundColor: accentColor }}></div>
        <div className="absolute -bottom-2 -left-2 w-6 h-6 rotate-45" style={{ backgroundColor: accentColor }}></div>
        <div className="absolute -bottom-2 -right-2 w-6 h-6 rotate-45" style={{ backgroundColor: accentColor }}></div>
      </div>

      {/* Organization Logo */}
      {orgLogo && (
        <DraggableLogo
          src={orgLogo}
          alt="Organization Logo"
          elementKey="orgLogo"
          element={elements.orgLogo}
          onDragStart={handleDragStart}
        />
      )}

      {/* Our Logo */}
      {ourLogo && (
        <DraggableLogo
          src={ourLogo}
          alt="Our Logo"
          elementKey="ourLogo"
          element={elements.ourLogo}
          onDragStart={handleDragStart}
        />
      )}

      {/* Certificate Title */}
      <DraggableText
        text={certificateType === 'merit' ? 'Certificate of Achievement' : 'Certificate of Participation'}
        elementKey="title"
        element={elements.title}
        textColor={textColor}
        onDragStart={handleDragStart}
        style={{
          fontSize: elements.title.fontSize,
          fontWeight: 'bold',
          fontFamily: 'serif'
        }}
      />

      {/* Recipient Name */}
      <DraggableText
        text={`Awarded to ${recipientName}`}
        elementKey="recipient"
        element={elements.recipient}
        textColor={textColor}
        onDragStart={handleDragStart}
        style={{
          fontSize: elements.recipient.fontSize,
          fontWeight: 'bold',
          fontFamily: 'serif'
        }}
      />

      {/* Course/Event Description */}
      <DraggableText
        text={certificateType === 'merit' 
          ? `For outstanding achievement in ${courseName}`
          : `For successful participation in ${courseName}`
        }
        elementKey="course"
        element={elements.course}
        textColor={textColor}
        onDragStart={handleDragStart}
        style={{
          fontSize: elements.course.fontSize,
          fontFamily: 'serif'
        }}
        width="500px"
      />

      {/* Date */}
      <DraggableText
        text={`Date: ${date}`}
        elementKey="date"
        element={elements.date}
        textColor={textColor}
        onDragStart={handleDragStart}
        style={{
          fontSize: elements.date.fontSize,
          fontFamily: 'serif'
        }}
        width="200px"
      />

      {/* Decorative Elements */}
      <DecorativeElements 
        certificateType={certificateType}
        borderColor={borderColor}
        accentColor={accentColor}
      />

    </div>
  );
});

CertificateCanvas.displayName = 'CertificateCanvas';

export default CertificateCanvas;