import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '@/axiosInstance';
import './UploadSellerDocument.css';

const UploadSellerDocument = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Get the seller ID from the state passed during navigation
    const sellerId = location.state?.sellerId;

    useEffect(() => {
        if (!sellerId) {
            setError('Seller ID not found. Please complete signup first.');
        }
        console.log("Seller ID:", sellerId); // Debug log
    }, [sellerId]);

    const handleFileChange = (e) => {
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
                `/api/seller/uploadDocument?type=seller&id=${sellerId}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
    
            if (response.status === 200) {
                setSuccess(true);
                // Changed navigation to profile picture upload page
                setTimeout(() => {
                    navigate('/seller/uploadPicture', { 
                        state: { sellerId } // Pass the seller ID to the next page
                    });
                }, 2000);
            }
        } catch (error) {
            console.error('Error uploading document:', error);
            setError(error.response?.data?.message || 'Failed to upload document. Please try again.');
        }
    };
    return (
        <div className="upload-document-container">
            <div className="upload-content">
                <h2>Upload Required Documents</h2>
                <p className="upload-description">
                    Please upload your business registration documents or relevant certifications
                </p>

                <form onSubmit={handleUpload} className="upload-form">
                    <div className="file-input-container">
                        <label className="file-input-label">
                            <input
                                type="file"
                                accept=".pdf,.doc,.docx,.jpg,.png"
                                onChange={handleFileChange}
                                className="actual-file-input"
                            />
                            Select Document
                        </label>
                        {selectedFile && (
                            <span className="selected-file-name">
                                Selected: {selectedFile.name}
                            </span>
                        )}
                    </div>

                    {previewUrl && selectedFile?.type.startsWith('image/') && (
                        <div className="preview-container">
                            <img 
                                src={previewUrl} 
                                alt="Preview" 
                                className="preview-image"
                            />
                        </div>
                    )}

                    {error && <p className="error-message">{error}</p>}
                    {success && (
    <p className="success-message">
        Document uploaded successfully! Redirecting to profile picture upload...
    </p>
)}

                    <div className="button-container">
                        <button 
                            type="submit" 
                            className="submit-button"
                            disabled={!selectedFile || !sellerId}
                        >
                            Upload Document
                        </button>
                        <button 
                            type="button" 
                            className="cancel-button"
                            onClick={() => navigate('/login')}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UploadSellerDocument;