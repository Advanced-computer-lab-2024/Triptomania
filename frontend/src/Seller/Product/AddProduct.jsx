import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, FileText, DollarSign, Hash } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import './AddProduct.css';
import axiosInstance from '@/axiosInstance';
import { Header } from '../../components/SellerHeader';

const AddProduct = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        Name: '',
        Description: '',
        Price: '',
        Reviews: [],
        Quantity: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'Price' || name === 'Quantity') {
            setFormData({ ...formData, [name]: Number(value) });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post(
                '/api/seller/product/addProduct',
                formData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.status === 201) {
                const productData = {
                    ...formData,
                    _id: response.data.product._id,
                    Seller: response.data.product.Seller
                };

                localStorage.setItem('sellerData', JSON.stringify(productData));
                alert('Product added successfully!');
                setFormData({
                    Name: '',
                    Description: '',
                    Price: '',
                    Reviews: [],
                    Quantity: ''
                });
                navigate('/seller/product/uploadPicture');
            }
        } catch (error) {
            console.error('Error adding product:', error);
            if (error.response) {
                alert(error.response.data.message);
            } else {
                alert('Failed to add product. Please try again.');
            }
        }
    };

    return (
        <>
            <Header />
            <div className="add-product-container">
                <h2>Add New Product</h2>
                <form className="add-product-form" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <Package id="input-icon" />
                        <Input
                            type="text"
                            name="Name"
                            placeholder="Name"
                            value={formData.Name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <FileText id="input-icon" />
                        <Textarea
                            name="Description"
                            placeholder="Description"
                            value={formData.Description}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <DollarSign id="input-icon" />
                        <Input
                            type="number"
                            name="Price"
                            placeholder="Price"
                            value={formData.Price}
                            onChange={handleChange}
                            required
                            min="0"
                            step="any"
                        />
                    </div>

                    <div className="input-group">
                        <Hash id="input-icon" />
                        <Input
                            type="number"
                            name="Quantity"
                            placeholder="Quantity"
                            value={formData.Quantity}
                            onChange={handleChange}
                            required
                            min="0"
                        />
                    </div>

                    <Button type="submit">Add Product</Button>
                </form>
            </div>
        </>
    );
};

export default AddProduct;
