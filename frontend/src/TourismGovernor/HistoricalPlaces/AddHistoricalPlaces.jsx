import React, { useState, useEffect } from 'react';
import {
    BookText,
    Clock,
    MapPin,
    DollarSign,
    FileText,
    Image,
    Tag,
    Check
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Header } from '../../components/GovernerHeader';
import './AddHistoricalPlaces.css';
import axiosInstance from '@/axiosInstance';
import Loading from "@/components/Loading";
import Resizer from 'react-image-file-resizer';

const AddHistoricalPlace = () => {
    const [formData, setFormData] = useState({
        Name: '',
        Description: '',
        Picture: '',
        Location: '',
        Opening_hours: '',    // String in HH:MM format
        Closing_hours: '',    // String in HH:MM format
        Ticket_prices: '',
        Tags: []
    });
    const [Tags, setTags] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        const fetchTags = async () => {
            try {
                setIsLoading(true);
                const response = await axiosInstance.get('/api/tourismGovernor/getTags');
                setTags(response.data.tags);
            } catch (error) {
                console.error('Error fetching tags:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTags();
    }, []);

    const handleTagsChange = (tagId) => {
        setFormData(prev => ({
            ...prev,
            Tags: prev.Tags.includes(tagId)
                ? prev.Tags.filter(id => id !== tagId)
                : [...prev.Tags, tagId]
        }));
    };

    const [previewUrl, setPreviewUrl] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'Ticket_prices') {
            setFormData({ ...formData, [name]: Number(value) });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    if (isLoading) return <Loading />;

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            Resizer.imageFileResizer(
                file,
                300, // max width
                300, // max height
                'JPEG', // output format
                70, // quality
                0, // rotation
                (uri) => {
                    setFormData({ ...formData, Picture: uri });
                    setPreviewUrl(uri);
                },
                'base64'
            );
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axiosInstance.post(
                '/api/tourismGovernor/addHistoricalPlace',
                formData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.status === 201) {
                alert('Historical place added successfully!');
                setFormData({
                    Name: '',
                    Description: '',
                    Picture: '',
                    Location: '',
                    Opening_hours: '',
                    Closing_hours: '',
                    Ticket_prices: 0,
                    Tags: ''
                });
                setPreviewUrl(null);
            }
        } catch (error) {
            console.error('Error adding historical place:', error);
            if (error.response) {
                alert(`Error: ${error.response.data.message || 'Failed to add historical place'}`);
            } else {
                alert('Error connecting to the server');
            }
        }
    };
    return (
        <div>
            <Header />
            <div className="add-product-container">
                <h2>Add Historical Place</h2>
                <form className="add-product-form" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <BookText id="input-icon" />
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
                        <MapPin id="input-icon" />
                        <Input
                            type="text"
                            name="Location"
                            placeholder="Location"
                            value={formData.Location}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <Clock id="input-icon" />
                        <Input
                            type="text"
                            name="Opening_hours"
                            placeholder="Opening Hours (HH:MM)"
                            value={formData.Opening_hours}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <Clock id="input-icon" />
                        <Input
                            type="text"
                            name="Closing_hours"
                            placeholder="Closing Hours (HH:MM)"
                            value={formData.Closing_hours}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <DollarSign id="input-icon" />
                        <Input
                            type="number"
                            name="Ticket_prices"
                            placeholder="Ticket Price"
                            value={formData.Ticket_prices}
                            onChange={handleChange}
                            required
                            min="0"
                            step="any"
                        />
                    </div>

                    <div className="input-group">
                        <Tag id="input-icon" />
                        <div className="custom-dropdown">
                            <div
                                className="dropdown-header"
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            >
                                <span>
                                    {formData.Tags.length
                                        ? `${formData.Tags.length} Tags selected`
                                        : "Select Tags"}
                                </span>
                                <span className="dropdown-arrow">▼</span>
                            </div>
                            {isDropdownOpen && (
                                <div className="dropdown-options">
                                    {Tags.map((tag) => (
                                        <div
                                            key={tag._id}
                                            className={`dropdown-option ${formData.Tags.includes(tag._id) ? 'selected' : ''
                                                }`}
                                            onClick={() => handleTagsChange(tag._id)}
                                        >
                                            <div className="checkbox">
                                                {formData.Tags.includes(tag._id) && (
                                                    <Check size={16} />
                                                )}
                                            </div>
                                            <span>{tag.name}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="input-group file-upload-group">
                        <Image id="file-icon" />
                        <div className="file-upload-container">
                            <Input
                                type="file"
                                id="place-image"
                                name="Picture"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="file-input"
                                required
                            />
                            <div className="file-upload-label">
                                <span>Choose a file</span>
                                <small>Upload a clear image of the historical place</small>
                            </div>
                        </div>
                        {previewUrl && (
                            <div className="image-preview">
                                <img src={previewUrl} alt="Historical place preview" />
                            </div>
                        )}
                    </div>

                    <Button type="submit">Add Historical Place</Button>
                </form>
            </div>
        </div>
    );

};

export default AddHistoricalPlace;