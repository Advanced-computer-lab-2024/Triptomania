// UploadPicture.jsx
import React, { useState, useEffect } from 'react';
import { Image } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axiosInstance from '@/axiosInstance';
import './UploadPicture.css';

const UploadPicture = () => {
    const [productData, setProductData] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        const storedData = JSON.parse(localStorage.getItem('sellerData')) || {};
        setProductData(storedData);
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        
        if (!selectedFile || !productData._id) {
            alert('Please select a file and ensure product data is available');
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('id', productData._id); // Changed from 'productId' to 'id'

        try {
            const response = await axiosInstance.post(
                '/api/seller/product/uploadPicture',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (response.status === 200) {
                alert('Picture uploaded successfully!');
                setSelectedFile(null);
                setPreviewUrl(null);
            }
        } catch (error) {
            console.error('Full error:', error);
            if (error.response) {
                alert(error.response.data.message || 'Upload failed');
            } else {
                alert('Failed to upload picture. Please try again.');
            }
        }
    };

    if (!productData) {
        return <div className="no-data">No product data found</div>;
    }

    return (
        <div className="upload-picture-container">
            <h2>Upload Picture</h2>
            
            <div className="product-details">
                <h3>Product Details</h3>
                <div className="details-grid">
                    <div className="detail-item">
                        <span className="label">Name:</span>
                        <span className="value">{productData.Name}</span>
                    </div>
                    <div className="detail-item">
                        <span className="label">Description:</span>
                        <span className="value">{productData.Description}</span>
                    </div>
                    <div className="detail-item">
                        <span className="label">Price:</span>
                        <span className="value">${productData.Price}</span>
                    </div>
                    <div className="detail-item">
                        <span className="label">Quantity:</span>
                        <span className="value">{productData.Quantity}</span>
                    </div>
                    <div className="detail-item">
                        <span className="label">Product ID:</span>
                        <span className="value">{productData._id}</span>
                    </div>
                </div>
            </div>

            <form onSubmit={handleUpload} className="upload-form">
                <div className="file-upload-group">
                    <Image className="input-icon" />
                    <div className="file-upload-container">
                        <Input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleFileChange} 
                            className="file-input"
                            required
                        />
                        <div className="file-upload-label">
                            <span>Choose a file</span>
                            <small>Upload a clear image of your product</small>
                        </div>
                    </div>
                </div>

                {previewUrl && (
                    <div className="image-preview">
                        <img src={previewUrl} alt="Preview" />
                    </div>
                )}

                <Button 
                    type="submit" 
                    className="upload-button"
                    disabled={!selectedFile}
                >
                    Upload Picture
                </Button>
            </form>
        </div>
    );
};

export default UploadPicture;