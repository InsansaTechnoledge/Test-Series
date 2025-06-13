export const downloadCertificate = ({
    certificateType,
    recipientName,
    courseName,
    date,
    backgroundColor,
    borderColor,
    textColor,
    accentColor,
    elements,
    orgLogo,
    ourLogo
  }) => {
    // Create high-resolution canvas for download
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const scale = 2; // Higher resolution for better quality
    canvas.width = 800 * scale;
    canvas.height = 600 * scale;
    
    // Scale the context to match the higher resolution
    ctx.scale(scale, scale);
    
    // Use original dimensions for drawing (before scaling)
    const originalWidth = 800;
    const originalHeight = 600;
    
    // Draw certificate background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, originalWidth, originalHeight);
    
    // Draw border
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 8;
    ctx.strokeRect(20, 20, originalWidth - 40, originalHeight - 40);
    
    // Draw decorative corners
    ctx.fillStyle = accentColor;
    const cornerSize = 30;
    // Top corners
    ctx.fillRect(20, 20, cornerSize, cornerSize);
    ctx.fillRect(originalWidth - 50, 20, cornerSize, cornerSize);
    // Bottom corners
    ctx.fillRect(20, originalHeight - 50, cornerSize, cornerSize);
    ctx.fillRect(originalWidth - 50, originalHeight - 50, cornerSize, cornerSize);
    
    // Function to draw image with aspect ratio preservation
    const drawImage = (imageSrc, x, y, maxWidth, maxHeight) => {
      return new Promise((resolve) => {
        if (!imageSrc) {
          resolve();
          return;
        }
        
        const img = new Image();
        img.onload = () => {
          // Calculate aspect ratio
          const imgAspectRatio = img.width / img.height;
          const maxAspectRatio = maxWidth / maxHeight;
          
          let drawWidth, drawHeight;
          
          if (imgAspectRatio > maxAspectRatio) {
            // Image is wider, fit to width
            drawWidth = maxWidth;
            drawHeight = maxWidth / imgAspectRatio;
          } else {
            // Image is taller, fit to height
            drawHeight = maxHeight;
            drawWidth = maxHeight * imgAspectRatio;
          }
          
          // Center the image within the allocated space
          const drawX = x + (maxWidth - drawWidth) / 2;
          const drawY = y + (maxHeight - drawHeight) / 2;
          
          // Enable image smoothing for better quality
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          
          ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
          resolve();
        };
        img.onerror = () => {
          console.warn('Failed to load image:', imageSrc);
          resolve();
        };
        img.src = imageSrc;
      });
    };
    
    // Draw logos and text
    const drawCertificate = async () => {
      // Draw organization logo (top left) - reduced size for better proportion
      if (orgLogo) {
        await drawImage(orgLogo, 60, 60, 60, 60);
      }
      
      // Draw our logo (top right) - reduced size for better proportion
      if (ourLogo) {
        await drawImage(ourLogo, originalWidth - 120, 60, 60, 60);
      }
      
      // Add text
      ctx.fillStyle = textColor;
      ctx.textAlign = 'center';
      
      // Title
      ctx.font = `bold ${elements.title.fontSize}px serif`;
      ctx.fillText(
        certificateType === 'merit' ? 'Certificate of Merit' : 'Certificate of Participation',
        elements.title.x,
        elements.title.y
      );
      
      // Recipient
      ctx.font = `bold ${elements.recipient.fontSize}px serif`;
      ctx.fillText(`Awarded to ${recipientName}`, elements.recipient.x, elements.recipient.y);
      
      // Course
      ctx.font = `${elements.course.fontSize}px serif`;
      ctx.fillText(
        certificateType === 'merit' 
          ? `For outstanding achievement in ${courseName}`
          : `For successful participation in ${courseName}`,
        elements.course.x,
        elements.course.y
      );
      
      // Date
      ctx.font = `${elements.date.fontSize}px serif`;
      ctx.fillText(`Date: ${date}`, elements.date.x, elements.date.y);
      
      // Download with higher quality
      const link = document.createElement('a');
      link.download = `certificate-${recipientName.replace(/\s+/g, '-').toLowerCase()}.png`;
      link.href = canvas.toDataURL('image/png', 1.0); // Maximum quality
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
    
    // Execute the drawing
    drawCertificate();
  };