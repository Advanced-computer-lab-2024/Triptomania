import React, { useState } from 'react';
import { Button } from "@/components/ui/button"; 
import { Input } from "@/components/ui/input";    
import { Textarea } from "@/components/ui/textarea";  
import { Label } from "@/components/ui/label";    
import { Badge } from "@/components/ui/badge"; 
import './fileComplaint.css';
import axiosInstance from '@/axiosInstance'; // Import the Axios instance

const SubmitComplaint = () => {
    const [complaint, setComplaint] = useState({
        title: '',
        body: '',
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setComplaint({ ...complaint, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!complaint.title || !complaint.body) {
            setError('All fields are required.');
            return;
        }

        try {
            const response = await axiosInstance.post('api/tourist/complaint/addComplaint', {
                title: complaint.title,
                body: complaint.body,
                date: new Date().toISOString(), // Add the current date
            });

            alert('Complaint submitted successfully.');
            setComplaint({ title: '', body: '' }); // Reset form
        } catch (error) {
            // Handle errors
            const errorMessage = error.response?.data?.error || 'An error occurred while submitting your complaint.';
            setError(errorMessage);
        }
    };

    return (
        <div className="submit-complaint-container">
            <form onSubmit={handleSubmit} className="submit-complaint-form">
                <h2>Submit a Complaint</h2>

                <div className="input-group">
                    <Label htmlFor="title">Complaint Title</Label>
                    <Input
                        id="title"
                        name="title"
                        value={complaint.title}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="input-group">
                    <Label htmlFor="body">Complaint Description</Label>
                    <Textarea
                        id="body"
                        name="body"
                        value={complaint.body}
                        onChange={handleChange}
                        required
                    />
                </div>
                {error && <p className="error-message">{error}</p>}

                <Button type="submit" className="submit-btn">Submit Complaint</Button>
            </form>
        </div>
    );
};

export default SubmitComplaint;
