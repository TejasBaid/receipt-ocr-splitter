import axios from 'axios';

export const uploadFileToCloudinaryUnsigned = async (file) => {
    const CLOUDINARY_CLOUD_NAME = 'dqfvbhs8u';
    const CLOUDINARY_UPLOAD_PRESET = 'receipt_upload_preset';
    const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    try {
        const response = await axios.post(UPLOAD_URL, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        return response.data.secure_url || null;
    } catch (error) {
        console.error('Error uploading file to Cloudinary:', error);
        return null;
    }
};
