import React, { useState } from 'react';
import { Button } from "@/components/ui/button";  // Assuming Button is a reusable component
import { Input } from "@/components/ui/input";    // Reusable input component
import { Textarea } from "@/components/ui/textarea";  // Reusable textarea component
import { Label } from "@/components/ui/label";    // Reusable label component
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"; // For Date Picker
import { Calendar } from "@/components/ui/calendar"; // Assuming Calendar component exists
import { Badge } from "@/components/ui/badge"; // Assuming Badge component exists
import { useNavigate } from 'react-router-dom';
import './fileComplaint.css'; // Include your custom CSS styles

const SubmitComplaint = () => {
  const [touristId, setTouristId] = useState('');
  const [complaintTitle, setComplaintTitle] = useState('');
  const [complaintBody, setComplaintBody] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate(); // Assuming you'll handle navigation

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Validation
    if (!touristId || !complaintTitle || !complaintBody) {
      setErrorMessage('All fields are required.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/tourist/complaint/addComplaint/${touristId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: complaintTitle,
          body: complaintBody,
          date: new Date().toISOString(),
        }),
      });

      const result = await response.json();
      if (response.ok) {
        alert('Complaint submitted successfully.');
        // Reset form after successful submission
        setTouristId('');
        setComplaintTitle('');
        setComplaintBody('');
        setSelectedDate(null);
      } else {
        setErrorMessage(`Error: ${result.error}`);
      }
    } catch (error) {
      setErrorMessage('An error occurred while submitting your complaint. Please try again later.');
    }
  };

  return (
    <div className="submit-complaint-container">
      <h2 className="text-center">Submit a Complaint</h2>
      <form onSubmit={handleSubmit} className="submit-complaint-form">
        {errorMessage && <Badge variant="destructive" className="error-message">{errorMessage}</Badge>}

        <div className="input-group">
          <Label htmlFor="touristId">Tourist ID</Label>
          <Input
            id="touristId"
            value={touristId}
            onChange={(e) => setTouristId(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <Label htmlFor="complaintTitle">Complaint Title</Label>
          <Input
            id="complaintTitle"
            value={complaintTitle}
            onChange={(e) => setComplaintTitle(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <Label htmlFor="complaintBody">Complaint Description</Label>
          <Textarea
            id="complaintBody"
            value={complaintBody}
            onChange={(e) => setComplaintBody(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <Label htmlFor="complaintDate">Complaint Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left">
                {selectedDate ? selectedDate.toDateString() : 'Select Date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <Button type="submit" className="submit-btn">Submit Complaint</Button>
      </form>
    </div>
  );
};

export default SubmitComplaint;
