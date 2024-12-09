import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '@/axiosInstance';
import './AdvertiserUploadDocument.css';

const AdvertiserUploadDocument = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Get ID from location state or localStorage
        const id = location.state?.advertiserId || localStorage.getItem('advertiserId');
        console.log('Location state:', location.state);
        console.log('ID from localStorage:', localStorage.getItem('advertiserId'));
        console.log('Retrieved ID:', id);

        if (!id) {
            console.error('No advertiser ID found');
            setError('Advertiser ID not found. Please complete signup first.');
            setTimeout(() => {
                navigate('/advertiser-signup');
            }, 2000);
        }
    }, [navigate, location]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file size (5MB limit)
            if (file.size > 5 * 1024 * 1024) {
                setError('File size should be less than 5MB');
                return;
            }
            setSelectedFile(file);
            // Create preview URL for images
            if (file.type.startsWith('image/')) {
                setPreviewUrl(URL.createObjectURL(file));
            } else {
                setPreviewUrl(null);
            }
            setError('');
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();

        if (!selectedFile) {
            setError('Please select a file');
            return;
        }

        // Get the ID directly from localStorage
        const currentAdvertiserId = localStorage.getItem('advertiserId');
        console.log('Current Advertiser ID:', currentAdvertiserId);

        if (!currentAdvertiserId) {
            console.error('No advertiser ID available');
            setError('Advertiser ID not found. Please complete signup first.');
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            // Log request details
            console.log('Making upload request:', {
                id: currentAdvertiserId,
                fileName: selectedFile.name,
                fileType: selectedFile.type
            });

            const response = await axiosInstance.put(
                `/api/advertiser/uploadDocument`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    params: {
                        type: 'advertiser',
                        id: currentAdvertiserId
                    }
                }
            );

            console.log('Upload response:', response);

            if (response.status === 200) {
                setSuccess(true);
                // Update localStorage with new document path
                const currentData = JSON.parse(localStorage.getItem('advertiserData') || '{}');
                currentData.documents = response.data.documents;
                localStorage.setItem('advertiserData', JSON.stringify(currentData));

                setTimeout(() => {
                    navigate('/advertiser/uploadPicture', { 
                        state: { 
                            advertiserId: currentAdvertiserId,
                            documents: response.data.documents 
                        } 
                    });
                }, 2000);
            }
        } catch (error) {
            console.error('Upload error details:', {
                error: error,
                response: error.response?.data,
                status: error.response?.status
            });
            setError(error.response?.data?.message || 'Failed to upload document. Please try again.');
        }
    };

    // Cleanup function for preview URL
    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    return (
        <div className="upload-document-container">
            <div className="upload-content">
                <h2>Upload Business Documents</h2>
                <p className="upload-description">
                    Please upload your business registration or relevant documents
                </p>

                <form onSubmit={handleUpload} className="upload-form">
                    <div className="file-input-container">
                        <label className="file-input-label">
                            <input
                                type="file"
                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
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
                            disabled={!selectedFile}
                        >
                            Upload Document
                        </button>
                        <button 
                            type="button" 
                            className="cancel-button"
                            onClick={() => navigate('/login')}
                        >
                            Skip for Now
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdvertiserUploadDocument;