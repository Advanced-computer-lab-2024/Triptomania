import React, { useState, useEffect } from 'react';
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
    TagIcon,
    Check
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

    const [preferenceTags, setPreferenceTags] = useState([]);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        const fetchPreferenceTags = async () => {
            try {
                const response = await axiosInstance.get('/api/tourGuide/tags/getPreferenceTags');
                setPreferenceTags(response.data);
            } catch (error) {
                console.error('Error fetching preference tags:', error);
            }
        };
        fetchPreferenceTags();
    }, []);

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

    const handleTagsChange = (tagId) => {
        setItinerary(prev => ({
            ...prev,
            preferenceTags: prev.preferenceTags.includes(tagId)
                ? prev.preferenceTags.filter(id => id !== tagId)
                : [...prev.preferenceTags, tagId]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formattedItinerary = {
                Name: itinerary.Name,
                activities: Array.isArray(itinerary.activities) ? itinerary.activities : [itinerary.activities],
                locationsToVisit: Array.isArray(itinerary.locationsToVisit) ? itinerary.locationsToVisit : [itinerary.locationsToVisit],
                timeLine: itinerary.timeLine,
                duration: itinerary.duration,
                language: itinerary.language,
                price: Number(itinerary.price),
                availableDates: Array.isArray(itinerary.availableDates) ? itinerary.availableDates : [itinerary.availableDates],
                availableTimes: Array.isArray(itinerary.availableTimes) ? itinerary.availableTimes : [itinerary.availableTimes],
                accesibility: itinerary.accessibility,
                pickUp: itinerary.pickUp,
                dropOff: itinerary.dropOff,
                Start_date: new Date(itinerary.Start_date).toISOString(),
                End_date: new Date(itinerary.End_date).toISOString(),
                preferenceTags: itinerary.preferenceTags,
                creatorId: JSON.parse(localStorage.getItem('user'))._id
            };

            const response = await axiosInstance.post('/api/tourGuide/itinerary/addItinerary', formattedItinerary);

            if (response.status === 201) {
                alert('Itinerary added successfully!');
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
            alert(`Error adding itinerary: ${error.response?.data?.error || error.message}`);
        }
    };

    return (
        <div>
            <Header />
            <div className="add-itinerary-page">
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
                            <div className="custom-dropdown">
                                <div
                                    className="dropdown-header"
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                >
                                    <span>
                                        {itinerary.preferenceTags.length
                                            ? `${itinerary.preferenceTags.length} tags selected`
                                            : "Select Preference Tags"}
                                    </span>
                                    <span className="dropdown-arrow">▼</span>
                                </div>
                                {isDropdownOpen && (
                                    <div className="dropdown-options">
                                        {preferenceTags.map((tag) => (
                                            <div
                                                key={tag._id}
                                                className={`dropdown-option ${itinerary.preferenceTags.includes(tag._id) ? 'selected' : ''
                                                    }`}
                                                onClick={() => handleTagsChange(tag._id)}
                                            >
                                                <div className="checkbox">
                                                    {itinerary.preferenceTags.includes(tag._id) && (
                                                        <Check size={16} />
                                                    )}
                                                </div>
                                                <span>{tag.PreferenceTagName}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
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
                            <Input
                                type="date"
                                name="Start_date"
                                value={itinerary.Start_date}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <Calendar id="input-icon" />
                            <Input
                                type="date"
                                name="End_date"
                                value={itinerary.End_date}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <Button type="submit">Add Itinerary</Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddItinerary;