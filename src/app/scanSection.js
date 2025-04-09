import React, { useRef } from 'react';
import { UploadCloud } from 'lucide-react';
import axios from 'axios';

const uploadFileToCloudinaryUnsigned = async (file) => {
    const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const CLOUDINARY_UPLOAD_PRESET = 'receipt_upload_preset';
    const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    try {
        const response = await axios.post(UPLOAD_URL, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        if (response.data?.secure_url) {
            return response.data.secure_url;
        } else {
            console.error('No secure_url returned by Cloudinary.');
            return null;
        }
    } catch (error) {
        console.error('Cloudinary upload error:', error.response?.data || error.message);
        return null;
    }
};

const ScanSection = ({ onScanStart, onScanComplete, isLoading, scanStatus }) => {
    const fileInputRef = useRef(null);

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (fileInputRef.current) {
            fileInputRef.current.value = null;
        }

        if (!file) return;

        onScanStart();

        try {
            // Step 1: Upload image to Cloudinary
            const uploadedFileUrl = await uploadFileToCloudinaryUnsigned(file);

            if (!uploadedFileUrl) {
                onScanComplete(null, 'Failed to upload image to Cloudinary.');
                return;
            }

            // Step 2: Send uploaded file URL to your backend API route
            const response = await axios.post('/api/scan-receipt', {
                file_url: uploadedFileUrl,
            });

            console.log('Veryfi API success:', response.data);
            onScanComplete(response.data);
        } catch (error) {
            console.error('Scan error:', error);

            let message = 'Unexpected error during scanning.';
            if (axios.isAxiosError(error)) {
                if (error.response?.data?.error) {
                    message = `API Error: ${error.response.data.error}`;
                } else if (error.message) {
                    message = `Error: ${error.message}`;
                }
            }

            onScanComplete(null, message);
        }
    };

    return (
        <div className="mb-10 p-6 border border-dashed border-gray-200 rounded-xl text-center bg-gradient-to-br from-indigo-50 to-blue-50">
            <h2 className="text-xl font-semibold text-gray-700 mb-3">Step 1: Upload Receipt</h2>
            <p className="text-gray-500 mb-5 text-sm max-w-md mx-auto">
                Upload a clear image of your receipt to extract items.
            </p>
            <label
                htmlFor="receipt-upload"
                className={`inline-flex items-center px-7 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-indigo-50 transition duration-200 ease-in-out transform hover:-translate-y-0.5 active:translate-y-0 ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                }`}
            >
                <UploadCloud className="mr-2 h-5 w-5" />
                {isLoading ? 'Processing...' : 'Upload / Scan Receipt'}
            </label>
            <input
                id="receipt-upload"
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isLoading}
                className="hidden"
            />
            {scanStatus && (
                <p className="text-sm text-indigo-700 mt-4 font-medium">{scanStatus}</p>
            )}
        </div>
    );
};

export default ScanSection;
