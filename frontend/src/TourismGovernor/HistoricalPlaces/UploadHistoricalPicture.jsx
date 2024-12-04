// UploadHistoricalPicture.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '@/axiosInstance';
import { Button } from "@/components/ui/button";

const UploadHistoricalPicture = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [placeData, setPlaceData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedData = localStorage.getItem('historicalPlaceData');
        if (storedData) {
            setPlaceData(JSON.parse(storedData));
        } else {
            alert('No historical place data found');
            navigate('/addhistoricalplace');
        }
    }, [navigate]);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        
        if (!selectedFile || !placeData._id) {
            alert('Please select a file and ensure place data is available');
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('id', placeData._id);

        try {
            const response = await axiosInstance.post(
                '/api/tourismGovernor/uploadPicture',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (response.status === 200) {
                alert('Picture uploaded successfully!');
                localStorage.removeItem('historicalPlaceData'); // Clean up
                navigate('/historical-places'); // Navigate to your places list
            }
        } catch (error) {
            console.error('Error uploading picture:', error);
            alert('Failed to upload picture. Please try again.');
        }
    };

    return (
        <div className="upload-container p-6 max-w-xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Upload Historical Place Picture</h2>
            
            <form onSubmit={handleUpload} className="space-y-6">
                <div className="file-input-container">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="file-input"
                    />
                    <label 
                        htmlFor="file-input"
                        className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Select Image
                    </label>
                </div>

                {previewUrl && (
                    <div className="preview-container">
                        <img 
                            src={previewUrl} 
                            alt="Preview" 
                            className="max-w-full h-auto rounded-lg shadow-lg"
                        />
                    </div>
                )}

                <Button 
                    type="submit" 
                    disabled={!selectedFile}
                    className="w-full"
                >
                    Upload Picture
                </Button>
            </form>
        </div>
    );
};

export default UploadHistoricalPicture;