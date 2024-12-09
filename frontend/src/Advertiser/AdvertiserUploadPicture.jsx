import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '@/axiosInstance';
import './AdvertiserUploadPicture.css';

const AdvertiserUploadPicture = () => {
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
            // Check if file is an image
            if (!file.type.startsWith('image/')) {
                setError('Please select an image file');
                return;
            }
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            setError('');
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
    
        if (!selectedFile) {
            setError('Please select an image');
            return;
        }
    
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
            console.log('Making upload request:', {
                id: currentAdvertiserId,
                fileName: selectedFile.name,
                fileType: selectedFile.type
            });
    
            const response = await axiosInstance.put(
                `/api/advertiser/uploadProfilePicture`,
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
                const currentData = JSON.parse(localStorage.getItem('advertiserData') || '{}');
                currentData.profilePicture = response.data.profilePicture;
                localStorage.setItem('advertiserData', JSON.stringify(currentData));
    
                setTimeout(() => {
                    navigate('/login', { 
                        state: { 
                            advertiserId: currentAdvertiserId,
                            profilePicture: response.data.profilePicture 
                        } 
                    });
                }, 2000);
            }
        } catch (error) {
            console.error('Upload error details:', {
                error: error,
                response: error.response?.data,
                status: error.response?.status,
                endpoint: '/api/advertiser/uploadProfilePicture'
            });
            setError(error.response?.data?.message || 'Failed to upload picture. Please try again.');
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
        <div className="upload-picture-container">
            <div className="upload-content">
                <h2>Upload Profile Picture</h2>
                <p className="upload-description">
                    Please upload a clear profile picture or business logo
                </p>

                <form onSubmit={handleUpload} className="upload-form">
                    <div className="file-input-container">
                        <label className="file-input-label">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="actual-file-input"
                            />
                            Select Picture
                        </label>
                        {selectedFile && (
                            <span className="selected-file-name">
                                Selected: {selectedFile.name}
                            </span>
                        )}
                    </div>

                    {previewUrl && (
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
                            Profile picture uploaded successfully! Redirecting to dashboard...
                        </p>
                    )}

                    <div className="button-container">
                        <button 
                            type="submit" 
                            className="submit-button"
                            disabled={!selectedFile}
                        >
                            Upload Picture
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

export default AdvertiserUploadPicture;