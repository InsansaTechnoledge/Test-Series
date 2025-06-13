export const handleFileUpload = (event, logoType, setOrgLogo, setOurLogo) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (logoType === 'org') {
          setOrgLogo(e.target.result);
        } else {
          setOurLogo(e.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  export const validateImageFile = (file) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB
  
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Invalid file type. Please upload a valid image file.');
    }
  
    if (file.size > maxSize) {
      throw new Error('File size too large. Please upload an image smaller than 5MB.');
    }
  
    return true;
  };