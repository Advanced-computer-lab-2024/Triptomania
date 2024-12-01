import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Clock, MapPin, DollarSign, Tag, Percent, User, Check } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import axiosInstance from '@/axiosInstance'; // Import the axiosInstance
import './addActivity.css';

const AddActivity = () => {
    const [activity, setActivity] = useState({
        name: '',
        description: '',
        date: '',
        time: '',
        location: '',
        price: '',
        category: '',
        tags: [],
        specialDiscounts: '',
        isBookingOpen: true,
        creatorId: ''
    });

    const [mapKey, setMapKey] = useState('');
    const mapRef = useRef(null);

    useEffect(() => {
        const fetchMapKey = async () => {
            try {
                const response = await axiosInstance.get('/api/maps-key');
                setMapKey(response.data.apiKey);
            } catch (error) {
                console.error('Error fetching the Google Maps API key:', error);
            }
        };

        fetchMapKey();
    }, []);

    useEffect(() => {
        if (mapKey) {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${mapKey}&libraries=places`;
            script.async = true;
            script.defer = true;
            document.body.appendChild(script);

            script.onload = () => {
                initMap();
            };
        }
    }, [mapKey]);

    const initMap = () => {
        const map = new window.google.maps.Map(mapRef.current, {
            center: { lat: -34.397, lng: 150.644 },
            zoom: 8,
        });

        const input = document.getElementById('location');
        const autocomplete = new window.google.maps.places.Autocomplete(input);
        autocomplete.bindTo('bounds', map);

        const infowindow = new window.google.maps.InfoWindow();
        const marker = new window.google.maps.Marker({
            map,
            anchorPoint: new window.google.maps.Point(0, -29),
        });

        autocomplete.addListener('place_changed', function () {
            infowindow.close();
            marker.setVisible(false);
            const place = autocomplete.getPlace();

            if (!place.geometry || !place.geometry.location) {
                window.alert("No details available for input: '" + place.name + "'");
                return;
            }

            if (place.geometry.viewport) {
                map.fitBounds(place.geometry.viewport);
            } else {
                map.setCenter(place.geometry.location);
                map.setZoom(17);
            }

            marker.setPosition(place.geometry.location);
            marker.setVisible(true);
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setActivity({ ...activity, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post('/api/advertiser/activity/addActivity', activity);
            if (response.status === 201) {
                alert("Activity added successfully!");
                setActivity({ 
                    ...activity, 
                    name: '', description: '', date: '', time: '', 
                    location: '', price: '', category: '', tags: [], 
                    specialDiscounts: 0, isBookingOpen: true, creatorId: '' 
                });
            } else {
                alert(response.data.error || "Error adding activity");
            }
        } catch (error) {
            console.error('Error adding activity:', error);
        }
    };

    return (
        <div className="add-activity-container">
            <h2>Add New Activity</h2>
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <Input type="text" name="name" className="name" placeholder="Activity Name" value={activity.name} onChange={handleChange} required />
                </div>
                <div className="input-group">
                    <Textarea name="description" placeholder="Description" className="description" value={activity.description} onChange={handleChange} required />
                </div>
                <div className="input-group">
                    <Calendar className="input-icon" />
                    <Input type="date" name="date" value={activity.date} onChange={handleChange} required />
                </div>
                <div className="input-group">
                    <Clock className="input-icon" />
                    <Input type="time" name="time" value={activity.time} onChange={handleChange} required />
                </div>
                <div className="input-group">
                    <MapPin className="input-icon" />
                    <Input type="text" id="location" name="location" placeholder="Enter location" value={activity.location} onChange={handleChange} required />
                </div>
                <div ref={mapRef} className="map-container"></div>
                <div className="input-group">
                    <DollarSign className="input-icon" />
                    <Input type="number" name="price" placeholder="Price" value={activity.price} onChange={handleChange} required min="0" />
                </div>
                <div className="input-group">
                    <Tag className="input-icon" />
                    <Input type="text" name="category" placeholder="Category" value={activity.category} onChange={handleChange} required />
                </div>
                <div className="input-group">
                    <Tag className="input-icon" />
                    <Input type="text" name="tags" placeholder="Tags (comma separated)" value={activity.tags.join(',')} onChange={(e) => setActivity({ ...activity, tags: e.target.value.split(',').map(tag => tag.trim()) })} />
                </div>
                <div className="input-group">
                    <Percent className="input-icon" />
                    <Input type="number" name="specialDiscounts" placeholder="Special Discounts" value={activity.specialDiscounts} onChange={handleChange} min="0" />
                </div>
                <div className="input-group">
                    <User className="input-icon" />
                    <Input type="text" name="creatorId" placeholder="Creator ID" value={activity.creatorId} onChange={handleChange} required />
                </div>
                <div className="checkbox-group">
                    <Switch 
                        id="isBookingOpen"
                        checked={activity.isBookingOpen}
                        onCheckedChange={(checked) => setActivity({ ...activity, isBookingOpen: checked })}
                    />
                    <label htmlFor="isBookingOpen">Is Booking Open?</label>
                </div>
                <Button type="submit" className="buttonAdd">Add Activity</Button>
            </form>
            <div id="responseMessage"></div>
        </div>
    );
};

export default AddActivity;
