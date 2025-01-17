const url = `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/auto/upload`;

const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset',process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);

  try {
    const response = await fetch(url, {
      method: 'post',
      
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

export default uploadFile;