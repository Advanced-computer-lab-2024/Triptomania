import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ViewMyComplaints.css';


const ViewMyComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
  useEffect(() => {
    // Fetch complaints from the backend
    const fetchComplaints = async () => {
      try {
        const response = await axios.get('/complaint/viewMyComplaints');
        console.log(response.data); // Log the response to ensure the structure is correct
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
    <div className="view-complaints-container">
      <div className="view-complaints-form">
        <h2>Your Complaints</h2>
        {complaints.length === 0 ? (
          <p>No complaints found</p>
        ) : (
          <ul className="complaints-list">
            {complaints.map((complaint) => (
              <li key={complaint._id} className="complaint-item">
                <div className="complaint-info">
                  <h3>{complaint.title}</h3>
                  <p>{complaint.description}</p>
                  <p className={`status ${complaint.status}`}>
                    Status: {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ViewMyComplaints;
