import React, { useState, useEffect } from 'react';
import axiosInstance from '@/axiosInstance'; // Import your axios instance for API requests
import './uploadDocuments.css'; // Use consistent styling
import { Header } from '../../components/Header'; // Import your header component

const UploadDocument = () => {
    const [tourGuideData, setTourGuideData] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        // Retrieve tour guide data from localStorage (or cookies, etc.)
        const storedData = JSON.parse(localStorage.getItem('tourGuideData')) || {};
        setTourGuideData(storedData);
    }, []);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setSelectedFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();

        if (!selectedFile ) {
            setError('Please select a file and ensure your ID is available');
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await axiosInstance.put(`/api/tourGuide/uploadDocument?type=tourGuide&id=${tourGuideData.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                setSuccess(true);
                setSelectedFile(null);
                setPreviewUrl(null);
            }
        } catch (error) {
            console.error('Error:', error);
            setError(error.response?.data?.message || 'Failed to upload document. Please try again.');
        }
    };

    if (!tourGuideData) {
        return <div>No tour guide data found</div>;
    }

    return (

        <div className="upload-document-container">
            
            <div className="upload-content">
                <h2>Upload Document</h2>

                <div className="tour-guide-details">
                    <h3>Tour Guide Details</h3>
                    <div className="details-grid">
                        <div className="detail-item">
                            <span className="label">First name:</span>
                            <span className="value">{tourGuideData.firstName}</span>
                        </div>
                        <div className="detail-item">
                            <span className="label">Last name:</span>
                            <span className="value">{tourGuideData.lastName}</span>
                        </div>
                        <div className="detail-item">
                            <span className="label">Email:</span>
                            <span className="value">{tourGuideData.email}</span>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleUpload} className="upload-form">
                    <div className="file-upload-group">
                        <div className="file-upload-container">
                            <input
                                type="file"
                                accept=".pdf,.doc,.docx,.jpg,.png"
                                onChange={handleFileChange}
                                required
                                className="file-input"
                            />
                            <div className="file-upload-label">
                                <span>Choose a document</span>
                                <small>Upload your ID or certificates (PDF, DOC, or image formats)</small>
                            </div>
                        </div>
                    </div>

                    {previewUrl && (
                        <div className="file-preview">
                            <p>Preview:</p>
                            <img src={previewUrl} alt="Document Preview" className="preview-image" />
                        </div>
                    )}

                    {error && <p className="error-message">{error}</p>}
                    {success && <p className="success-message">Document uploaded successfully!</p>}

                    <button type="submit" className="upload-button" disabled={!selectedFile}>
                        Upload Document
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UploadDocument;
