import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import axiosInstance from '@/axiosInstance';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const VacationPreferences = () => {
    const [selectedPreferences, setSelectedPreferences] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const touristId = location.state?.touristId;

    const preferences = [
        'Beach Destination',
        'Mountain Retreat',
        'City Exploration',
        'Cultural Immersion',
        'Adventure Activities',
        'Relaxation and Wellness'
    ];

    const togglePreference = (preference) => {
        setSelectedPreferences(prev =>
            prev.includes(preference)
                ? prev.filter(p => p !== preference)
                : [...prev, preference]
        );
    };

    const submitPreferences = async () => {
        try {
            const response = await axiosInstance.put(`/api/tourist/selectTouristPreferences?touristId=${touristId}&preferences=${preferences.join(',')}`);
            if (response.status === 200) {
                alert('Preferences submitted successfully!');
                navigate('/login');
            }
        } catch (error) {
            console.error('Error submitting preferences:', error);
            alert('Failed to submit preferences');
        }
    };

    return (
        <div className="view-complaints-container">
            <div className="view-complaints-form">
                <h1>Select Your Vacation Preferences</h1>
                <ul className="complaints-list">
                    {preferences.map((preference) => (
                        <li
                            key={preference}
                            className={`complaint-item ${selectedPreferences.includes(preference) ? 'resolved' : 'pending'}`}
                            onClick={() => togglePreference(preference)}
                        >
                            <div className="complaint-info">
                                <h3>{preference}</h3>
                                <div className={`status ${selectedPreferences.includes(preference) ? 'resolved' : 'pending'}`}>
                                    {selectedPreferences.includes(preference) ? 'Selected' : 'Not Selected'}
                                </div>
                            </div>
                            {selectedPreferences.includes(preference) && (
                                <Check className="absolute top-4 right-4 text-green-600" />
                            )}
                        </li>
                    ))}
                </ul>
                <Button
                    onClick={submitPreferences}
                    className="w-full mt-4"
                    disabled={selectedPreferences.length === 0}
                >
                    Submit Preferences
                </Button>
            </div>
        </div>
    );
};

export default VacationPreferences;