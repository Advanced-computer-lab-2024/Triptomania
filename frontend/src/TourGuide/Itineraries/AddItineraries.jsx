import React, { useState } from 'react';
import { 
    BookText, 
    FileText, 
    Activity, 
    MapPin, 
    Timer, 
    Clock, 
    Languages, 
    DollarSign, 
    Calendar, 
    Car, 
    Image 
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import './AddItineraries.css';
import axiosInstance from '@/axiosInstance';

const AddItinerary = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        activities: [],
        locationsToVisit: [],
        timeline: '',
        duration: '',
        language: '',
        price: '',
        availableDates: [],
        availableTimes: [],
        accessibility: '', 
        pickUpLocation: '',
        dropOffLocation: '',
        image: null,
        tags: [],
        preferenceTags: [] // Added preference tags
    });

    const [previewUrl, setPreviewUrl] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleArrayInput = (e) => {
        const { name, value } = e.target;
        setFormData({ 
            ...formData, 
            [name]: value.split(',').map(item => item.trim())
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, image: file });
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
        
        // Append all form data to FormData object
        Object.keys(formData).forEach(key => {
            if (Array.isArray(formData[key])) {
                formDataToSend.append(key, JSON.stringify(formData[key]));
            } else if (key === 'image' && formData[key]) {
                formDataToSend.append('image', formData[key]);
            } else {
                formDataToSend.append(key, formData[key]);
            }
        });

        try {
            const response = await axiosInstance.post('/api/tourGuide/itinerary/addItinerary', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 201) {
                alert('Itinerary added successfully!');
                // Reset form
                setFormData({
                    title: '',
                    description: '',
                    activities: [],
                    locationsToVisit: [],
                    timeline: '',
                    duration: '',
                    language: '',
                    price: '',
                    availableDates: [],
                    availableTimes: [],
                    accessibility: '',
                    pickUpLocation: '',
                    dropOffLocation: '',
                    image: null,
                    tags: [],
                    preferenceTags: []
                });
                setPreviewUrl(null);
            }
        } catch (error) {
            console.error('Error adding itinerary:', error);
            alert('Error adding itinerary. Please try again.');
        }
    };

    return (
        <div className="add-product-container">
            <h2>Add New Itinerary</h2>
            <form className="add-product-form" onSubmit={handleSubmit}>
                <div className="input-group">
                    <BookText className="input-icon" />
                    <Input 
                        type="text" 
                        name="title" 
                        placeholder="Itinerary Title" 
                        value={formData.title}
                        onChange={handleChange} 
                        required 
                    />
                </div>

                <div className="input-group">
                    <FileText className="input-icon" />
                    <Textarea 
                        name="description" 
                        placeholder="Itinerary Description" 
                        value={formData.description}
                        onChange={handleChange} 
                        required 
                    />
                </div>

                <div className="input-group">
                    <Activity className="input-icon" />
                    <Input 
                        type="text" 
                        name="activities" 
                        placeholder="Activities (comma separated)" 
                        value={formData.activities.join(',')}
                        onChange={handleArrayInput} 
                        required 
                    />
                </div>

                <div className="input-group">
                    <MapPin className="input-icon" />
                    <Input 
                        type="text" 
                        name="locationsToVisit" 
                        placeholder="Locations (comma separated)" 
                        value={formData.locationsToVisit.join(',')}
                        onChange={handleArrayInput} 
                        required 
                    />
                </div>

                <div className="input-group">
                    <Timer className="input-icon" />
                    <Input 
                        type="text" 
                        name="timeline" 
                        placeholder="Timeline" 
                        value={formData.timeline}
                        onChange={handleChange} 
                        required 
                    />
                </div>

                <div className="input-group">
                    <Clock className="input-icon" />
                    <Input 
                        type="text" 
                        name="duration" 
                        placeholder="Duration" 
                        value={formData.duration}
                        onChange={handleChange} 
                        required 
                    />
                </div>

                <div className="input-group">
                    <Languages className="input-icon" />
                    <Input 
                        type="text" 
                        name="language" 
                        placeholder="Language" 
                        value={formData.language}
                        onChange={handleChange} 
                        required 
                    />
                </div>

                <div className="input-group">
                    <DollarSign className="input-icon" />
                    <Input 
                        type="number" 
                        name="price" 
                        placeholder="Price" 
                        value={formData.price}
                        onChange={handleChange} 
                        required 
                    />
                </div>

                <div className="input-group">
                    <Calendar className="input-icon" />
                    <Input 
                        type="text" 
                        name="availableDates" 
                        placeholder="Available Dates (comma separated)" 
                        value={formData.availableDates.join(',')}
                        onChange={handleArrayInput} 
                        required 
                    />
                </div>

                <div className="input-group">
                    <Clock className="input-icon" />
                    <Input 
                        type="text" 
                        name="availableTimes" 
                        placeholder="Available Times (comma separated)" 
                        value={formData.availableTimes.join(',')}
                        onChange={handleArrayInput} 
                        required 
                    />
                </div>

                <div className="input-group">
                    <Car className="input-icon" />
                    <Input 
                        type="text" 
                        name="pickUpLocation" 
                        placeholder="Pick Up Location" 
                        value={formData.pickUpLocation}
                        onChange={handleChange} 
                        required 
                    />
                </div>

                <div className="input-group">
                    <Car className="input-icon" />
                    <Input 
                        type="text" 
                        name="dropOffLocation" 
                        placeholder="Drop Off Location" 
                        value={formData.dropOffLocation}
                        onChange={handleChange} 
                        required 
                    />
                </div>

                <div className="input-group">
                    <BookText className="input-icon" />
                    <Input 
                        type="text" 
                        name="tags" 
                        placeholder="Tags (comma separated)" 
                        value={formData.tags.join(',')}
                        onChange={handleArrayInput} 
                    />
                </div>

                <div className="input-group">
                    <BookText className="input-icon" />
                    <Input 
                        type="text" 
                        name="accessibility" 
                        placeholder="Accessibility details" 
                        value={formData.accessibility}
                        onChange={handleChange} 
                        required 
                    />
                </div>

                <div className="input-group file-upload-group">
                    <Image className="input-icon" />
                    <div className="file-upload-container">
                        <Input 
                            type="file" 
                            id="itinerary-image"
                            name="image" 
                            accept="image/*" 
                            onChange={handleFileChange} 
                            className="file-input"
                            required 
                        />
                        <div className="file-upload-label">
                            <span>Choose a file</span>
                            <small>Upload a clear image for your itinerary</small>
                        </div>
                    </div>
                    {previewUrl && (
                        <div className="image-preview">
                            <img src={previewUrl} alt="Itinerary preview" />
                        </div>
                    )}
                </div>

                <Button type="submit">Add Itinerary</Button>
            </form>
        </div>
    );
};

export default AddItinerary;
