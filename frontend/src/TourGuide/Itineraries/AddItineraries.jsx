import React, { useState } from 'react';
import {
    BookText,
    Activity,
    MapPin,
    Timer,
    Clock,
    Languages,
    DollarSign,
    Calendar,
    Car,
    TagIcon
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import './AddItineraries.css';
import axiosInstance from '@/axiosInstance';
import { Header } from '../../components/TourguideHeader';

const AddItinerary = () => {
    const [itinerary, setItinerary] = useState({
        Name: '',
        activities: [],
        locationsToVisit: [],
        timeLine: '',
        duration: '',
        language: '',
        price: '',
        availableDates: [],
        availableTimes: [],
        accessibility: '',
        pickUp: '',
        dropOff: '',
        preferenceTags: [],
        Start_date: '',
        End_date: '',
    });

    const [previewUrl, setPreviewUrl] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setItinerary({ ...itinerary, [name]: value });
    };

    const handleArrayInput = (e) => {
        const { name, value } = e.target;
        setItinerary({
            ...itinerary,
            [name]: value.split(',').map(item => item.trim())
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axiosInstance.post('/api/tourGuide/itinerary/addItinerary', itinerary);

            if (response.status === 201) {
                alert('Itinerary added successfully!');
                // Reset form
                setItinerary({
                    Name: '',
                    activities: [],
                    locationsToVisit: [],
                    timeLine: '',
                    duration: '',
                    language: '',
                    price: '',
                    availableDates: [],
                    availableTimes: [],
                    accessibility: '',
                    pickUp: '',
                    dropOff: '',
                    preferenceTags: [],
                    Start_date: '',
                    End_date: '',
                });
                setPreviewUrl(null);
            }
        } catch (error) {
            console.error('Error adding itinerary:', error);
            alert('Error adding itinerary. Please try again.');
        }
    };

    return (
        <div className="add-itinerary-page">
            <Header /> {/* Render the Header */}
            <div className="add-product-container">
                <h2>Add New Itinerary</h2>
                <form className="add-product-form" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <BookText id="input-icon" />
                        <Input
                            type="text"
                            name="Name"
                            placeholder="Itinerary Title"
                            value={itinerary.Name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <Activity id="input-icon" />
                        <Input
                            type="text"
                            name="activities"
                            placeholder="Activities (comma separated)"
                            value={itinerary.activities.join(',')}
                            onChange={handleArrayInput}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <MapPin id="input-icon" />
                        <Input
                            type="text"
                            name="locationsToVisit"
                            placeholder="Locations (comma separated)"
                            value={itinerary.locationsToVisit.join(',')}
                            onChange={handleArrayInput}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <Timer id="input-icon" />
                        <Input
                            type="text"
                            name="timeLine"
                            placeholder="Timeline"
                            value={itinerary.timeLine}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <Clock id="input-icon" />
                        <Input
                            type="text"
                            name="duration"
                            placeholder="Duration"
                            value={itinerary.duration}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <Languages id="input-icon" />
                        <Input
                            type="text"
                            name="language"
                            placeholder="Language"
                            value={itinerary.language}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <DollarSign id="input-icon" />
                        <Input
                            type="number"
                            name="price"
                            placeholder="Price"
                            value={itinerary.price}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <Calendar id="input-icon" />
                        <Input
                            type="text"
                            name="availableDates"
                            placeholder="Available Dates (comma separated)"
                            value={itinerary.availableDates.join(',')}
                            onChange={handleArrayInput}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <Clock id="input-icon" />
                        <Input
                            type="text"
                            name="availableTimes"
                            placeholder="Available Times (comma separated)"
                            value={itinerary.availableTimes.join(',')}
                            onChange={handleArrayInput}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <Car id="input-icon" />
                        <Input
                            type="text"
                            name="pickUp"
                            placeholder="Pick Up Location"
                            value={itinerary.pickUp}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <Car id="input-icon" />
                        <Input
                            type="text"
                            name="dropOff"
                            placeholder="Drop Off Location"
                            value={itinerary.dropOff}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <TagIcon id="input-icon" />
                        <Input
                            type="text"
                            name="preferenceTags"
                            placeholder="Tags (comma separated)"
                            value={itinerary.preferenceTags.join(',')}
                            onChange={handleArrayInput}
                        />
                    </div>

                    <div className="input-group">
                        <BookText id="input-icon" />
                        <Input
                            type="text"
                            name="accessibility"
                            placeholder="Accessibility details"
                            value={itinerary.accessibility}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <Calendar id="input-icon" />
                        <Input type="date" name="Start_date" value={itinerary.Start_date} onChange={handleChange} required />
                    </div>

                    <div className="input-group">
                        <Calendar id="input-icon" />
                        <Input type="date" name="End_date" value={itinerary.End_date} onChange={handleChange} required />
                    </div>

                    <Button type="submit">Add Itinerary</Button>
                </form>
            </div>
        </div>
    );
};

export default AddItinerary;
