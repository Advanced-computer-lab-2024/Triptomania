import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '@/axiosInstance';
import { Button } from "@/components/ui/button";

const UploadSellerPicture = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Get the seller ID from the state passed during navigation
    const sellerId = location.state?.sellerId;

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setError('File size should be less than 5MB');
                return;
            }
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            setError('');
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();

        if (!selectedFile || !sellerId) {
            setError('Please select a file and ensure signup is complete');
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await axiosInstance.put(
                `/api/seller/uploadProfilePicture?type=seller&id=${sellerId}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (response.status === 200) {
                setSuccess(true);
                // Redirect to dashboard after successful upload
                setTimeout(() => {
                    navigate('/seller-dashboard');
                }, 2000);
            }
        } catch (error) {
            console.error('Error uploading picture:', error);
            setError(error.response?.data?.message || 'Failed to upload picture. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="upload-container max-w-xl mx-auto bg-card rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold mb-6 text-center">Upload Profile Picture</h2>
                
                <form onSubmit={handleUpload} className="space-y-6">
                    <div className="file-input-container text-center">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="hidden"
                            id="file-input"
                        />
                        <label 
                            htmlFor="file-input"
                            className="inline-block cursor-pointer bg-primary text-primary-foreground px-6 py-3 rounded-md hover:bg-primary/90 transition-colors"
                        >
                            Select Image
                        </label>
                        {selectedFile && (
                            <p className="mt-2 text-sm text-gray-600">
                                Selected: {selectedFile.name}
                            </p>
                        )}
                    </div>

                    {previewUrl && (
                        <div className="preview-container mt-6">
                            <div className="aspect-square w-48 mx-auto overflow-hidden rounded-full">
                                <img 
                                    src={previewUrl} 
                                    alt="Preview" 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    )}

                    {error && (
                        <p className="text-red-500 text-center text-sm">
                            {error}
                        </p>
                    )}

                    {success && (
                        <p className="text-green-500 text-center text-sm">
                            Profile picture uploaded successfully! Redirecting to dashboard...
                        </p>
                    )}

                    <div className="space-y-4">
                        <Button 
                            type="submit" 
                            disabled={!selectedFile || !sellerId}
                            className="w-full"
                        >
                            Upload Profile Picture
                        </Button>

                        <Button 
                            type="button" 
                            variant="outline"
                            className="w-full"
                            onClick={() => navigate('/seller-dashboard')}
                        >
                            Skip for Now
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UploadSellerPicture;