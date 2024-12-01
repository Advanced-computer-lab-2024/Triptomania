import React, { useState } from 'react';
import { 
    BookText, 
    Calendar, 
    Clock, 
    MapPin, 
    DollarSign, 
    Languages, 
    Tag, 
    Timer,
    Activity,
    Car,
    Tags,
    Image,
    FileText, // Added this import
    Import
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import './AddItineraries.css';
import axiosInstance from '@/axiosInstance';

const AddItinerary = () => {
    const [formData, setFormData] = useState({
        Name: '',
        Description: '',
        activities: [],
        locationsToVisit: [],
        timeLine: '',
        duration: '',
        language: '',
        price: '',
        availableDates: [],
        availableTimes: [],
        accessibility: [],
        pickUp: '',
        dropOff: '',
        Start_date: '',
        End_date: '',
        Tags: [],
        Image: null,
        preferenceTags: []
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
            if (Array.isArray(formData[key])) {
                formDataToSend.append(key, JSON.stringify(formData[key]));
            } else {
                formDataToSend.append(key, formData[key]);
            }
        }

        try {
            const response = await axiosInstance.post('/api/tourGuide/itinerary/addItinerary', formDataToSend);
            const data = await response.json();
            if (response.status === 201) {
                alert('Itinerary added successfully!');
                setFormData({
                    Name: '',
                    Description: '',
                    activities: [],
                    locationsToVisit: [],
                    timeLine: '',
                    duration: '',
                    language: '',
                    price: '',
                    availableDates: [],
                    availableTimes: [],
                    accessibility: [],
                    pickUp: '',
                    dropOff: '',
                    Start_date: '',
                    End_date: '',
                    Tags: [],
                    Image: null,
                    preferenceTags: []
                });
                setPreviewUrl(null);
            } else {
                alert(data.error);
            }
        } catch (error) {
            console.error('Error adding itinerary:', error);
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
                        name="Name" 
                        placeholder="Itinerary Name" 
                        value={formData.Name}
                        onChange={handleChange} 
                        required 
                    />
                </div>

                <div className="input-group">
                    <FileText className="input-icon" />
                    <Textarea 
                        name="Description" 
                        placeholder="Itinerary Description" 
                        value={formData.Description}
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
                        name="timeLine" 
                        placeholder="Timeline" 
                        value={formData.timeLine}
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
                        type="date" 
                        name="Start_date" 
                        value={formData.Start_date}
                        onChange={handleChange} 
                        required 
                    />
                </div>

                <div className="input-group">
                    <Calendar className="input-icon" />
                    <Input 
                        type="date" 
                        name="End_date" 
                        value={formData.End_date}
                        onChange={handleChange} 
                        required 
                    />
                </div>

                <div className="input-group">
                    <Car className="input-icon" />
                    <Input 
                        type="text" 
                        name="pickUp" 
                        placeholder="Pick Up Location" 
                        value={formData.pickUp}
                        onChange={handleChange} 
                        required 
                    />
                </div>

                <div className="input-group">
                    <Car className="input-icon" />
                    <Input 
                        type="text" 
                        name="dropOff" 
                        placeholder="Drop Off Location" 
                        value={formData.dropOff}
                        onChange={handleChange} 
                        required 
                    />
                </div>

                <div className="input-group">
                    <Tags className="input-icon" />
                    <Input 
                        type="text" 
                        name="Tags" 
                        placeholder="Tags (comma separated)" 
                        value={formData.Tags.join(',')}
                        onChange={handleArrayInput} 
                    />
                </div>

                <div className="input-group file-upload-group">
                    <Image className="input-icon" />
                    <div className="file-upload-container">
                        <Input 
                            type="file" 
                            id="itinerary-image"
                            name="Image" 
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