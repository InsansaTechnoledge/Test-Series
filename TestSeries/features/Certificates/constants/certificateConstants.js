export const initialElements = ({ titleSize, recipientSize, courseSize, dateSize }) => ({
    orgLogo: { x: 50, y: 50, width: 80, height: 80 },
    ourLogo: { x: 570, y: 50, width: 80, height: 80 },
    title: { x: 300, y: 120, fontSize: titleSize },
    recipient: { x: 300, y: 250, fontSize: recipientSize },
    course: { x: 300, y: 320, fontSize: courseSize },
    date: { x: 300, y: 400, fontSize: dateSize }
  });
  
  export const certificateTypes = {
    MERIT: 'merit',
    PARTICIPATION: 'participation'
  };
  
  export const defaultColors = {
    BACKGROUND: '#ffffff',
    BORDER: '#d4af37',
    TEXT: '#333333',
    ACCENT: '#1e40af'
  };
  
  export const canvasConfig = {
    WIDTH: 800,
    HEIGHT: 600,
    BORDER_WIDTH: 8,
    CORNER_SIZE: 30,
    MARGIN: 20
  };