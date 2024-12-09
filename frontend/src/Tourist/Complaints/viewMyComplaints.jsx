import React, { useEffect, useState } from 'react';
import axiosInstance from '@/axiosInstance';
import './viewMyComplaints.css';
import { Header } from '@/components/HeaderTourist';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';


const ViewMyComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    // Fetch complaints from the backend
    const fetchComplaints = async () => {
      try {
        const response = await axiosInstance.get('/api/tourist/complaint/viewMyComplaints');
        if (response.data.complaints && response.data.complaints.length === 0) {
          setError('No complaints found for this user.');
        } else {
          setComplaints(response.data.complaints || []);
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch complaints');
        setLoading(false);
        console.error(err); // Log the error for debugging
      }
    };

    fetchComplaints();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <Header />
      <div className="view-complaints-container">
        <div className="view-complaints-form">
          <h1>Your Complaints</h1>
          {complaints.length === 0 ? (
            <p>No complaints found</p>
          ) : (
            <ul className="complaints-list">
              {complaints.map((complaint) => (
                <li key={complaint._id} className="complaint-item">
                  <div className="complaint-info">
                    <h3>{complaint.title}</h3>
                    <p>{complaint.body}</p>
                    <p className={`status ${complaint.status}`}>
                      Status: {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
                    </p>
                    <p>
                      Reply: {complaint.reply || 'No reply yet'}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <Button id='tab-button' onClick={() => navigate('/tourist/fileComplaint')}>
            File New Complaint
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ViewMyComplaints;
