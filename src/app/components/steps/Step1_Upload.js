'use client';
import StepContainer from "@/app/components/StepContainer";
import StepNavigation from "@/app/components/StepNavigation";
import {UploadCloud} from "lucide-react";
import {useRef} from "react";

const Step1_Upload = ({ onScanStart, onScanComplete, isLoading, scanStatus, onNext }) => {
    const fileInputRef = useRef(null);

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (fileInputRef.current) { fileInputRef.current.value = null; }

        if (file) {
            onScanStart();

            try {
                // --- Step 1: Upload the file to Cloudinary (Unsigned) ---
                const uploadedFileUrl = await uploadFileToCloudinaryUnsigned(file);
                if (!uploadedFileUrl) { throw new Error('upload_failed'); } // Use custom error message
                console.log("File uploaded via Unsigned Preset, URL:", uploadedFileUrl);

                // --- Step 2: Prepare Veryfi API Call ---
                const dataPayload = JSON.stringify({ "file_url": uploadedFileUrl });


                const response = await axios.post('/api/scan-receipt', {
                    file_url: uploadedFileUrl,
                });

                console.log('Veryfi API success:', response.data);
                onScanComplete(response.data);


            } catch (error) {
                console.error('Error during scan process:', error);
                let userErrorMessage = 'An unexpected error occurred.';
                if (axios.isAxiosError(error)) {
                    if (error.response) { // Error from API (less likely due to CORS block)
                        const apiErrorMsg = error.response.data?.error || error.response.data?.message || error.response.statusText;
                        userErrorMessage = `API Error: ${apiErrorMsg || 'Unknown API error'}`;
                    } else if (error.request) { // CORS block usually triggers this (Network Error)
                        console.error('API No Response (Likely CORS):', error.request);
                        userErrorMessage = 'Network Error: Could not connect to scanning service (check CORS/proxy).';
                    } else { // Setup error
                        userErrorMessage = `Error setting up API request: ${error.message}`;
                    }
                } else if (error.message === 'upload_failed') { // Custom error from upload function
                    userErrorMessage = 'Failed to upload receipt image.';
                }
                // Pass error info
                onScanComplete(null, userErrorMessage);
            }
        } else { console.log("No file selected."); }
    };

    return (
        <StepContainer title="Step 1: Upload Receipt">
            <div className="text-center">
                <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm max-w-md mx-auto">
                    Upload a clear image of your receipt. Processing happens in the background, you can proceed to add people.
                </p>
                <label
                    htmlFor="receipt-upload"
                    className={`inline-flex items-center px-7 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200 ease-in-out transform hover:-translate-y-0.5 active:translate-y-0 ${isLoading ? 'opacity-50 cursor-not-allowed animate-pulse' : 'cursor-pointer'}`}
                >
                    <UploadCloud className="mr-2 h-5 w-5" />
                    {isLoading ? 'Processing...' : 'Upload / Scan Receipt'}
                </label>
                <input id="receipt-upload" ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} disabled={isLoading} className="hidden" />
                {scanStatus && <p className={`text-sm mt-4 font-medium ${scanStatus.startsWith('Error') ? 'text-red-600 dark:text-red-400' : 'text-indigo-700 dark:text-indigo-300'}`}>{scanStatus}</p>}
            </div>
            <StepNavigation onNext={onNext} nextLabel="Add People" />
        </StepContainer>
    );
};

export default Step1_Upload;