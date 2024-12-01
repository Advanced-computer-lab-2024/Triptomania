import React, { useState } from 'react';
import { Package, FileText, DollarSign, User, Hash, Image } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import './AddProduct.css';
import axiosInstance from '@/axiosInstance';

const AddProduct = () => {
    const [formData, setFormData] = useState({
        Name: '',
        Description: '',
        Price: '',
        Seller: '',
        Quantity: '',
        Image: null
    });

    const [previewUrl, setPreviewUrl] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, Image: file });
            const fileReader = new FileReader();
            fileReader.onload = () => {
                setPreviewUrl(fileReader.result);
            };
            fileReader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        for (const key in formData) {
            formDataToSend.append(key, formData[key]);
        }

        try {
            const response = await axiosInstance.post('/api/seller/product/addProduct', formDataToSend);
            const data = await response.json();
            if (response.status === 201) {
                alert(data.message);
                setFormData({
                    Name: '',
                    Description: '',
                    Price: '',
                    Seller: '',
                    Quantity: '',
                    Image: null
                });
                setPreviewUrl(null);
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error adding product:', error);
        }
    };

    return (
        <div className="add-product-container">
            <h2>Add New Product</h2>
            <form className="add-product-form" onSubmit={handleSubmit}>
                <div className="input-group">
                    <Package className="input-icon" />
                    <Input 
                        type="text" 
                        name="Name" 
                        placeholder="Product Name" 
                        value={formData.Name}
                        onChange={handleChange} 
                        required 
                    />
                </div>

                <div className="input-group">
                    <FileText className="input-icon" />
                    <Textarea 
                        name="Description" 
                        placeholder="Product Description" 
                        value={formData.Description}
                        onChange={handleChange} 
                        required 
                    />
                </div>

                <div className="input-group">
                    <DollarSign className="input-icon" />
                    <Input 
                        type="number" 
                        name="Price" 
                        placeholder="Price" 
                        value={formData.Price}
                        onChange={handleChange} 
                        required 
                    />
                </div>

                <div className="input-group">
                    <User className="input-icon" />
                    <Input 
                        type="text" 
                        name="Seller" 
                        placeholder="Seller" 
                        value={formData.Seller}
                        onChange={handleChange} 
                        required 
                    />
                </div>

                <div className="input-group">
                    <Hash className="input-icon" />
                    <Input 
                        type="number" 
                        name="Quantity" 
                        placeholder="Quantity" 
                        value={formData.Quantity}
                        onChange={handleChange} 
                        required 
                    />
                </div>

                <div className="input-group file-upload-group">
                    <Image className="input-icon" />
                    <div className="file-upload-container">
                        <Input 
                            type="file" 
                            id="product-image"
                            name="Image" 
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
                    {previewUrl && (
                        <div className="image-preview">
                            <img src={previewUrl} alt="Product preview" />
                        </div>
                    )}
                </div>

                <Button type="submit">Add Product</Button>
            </form>
        </div>
    );
};

export default AddProduct;