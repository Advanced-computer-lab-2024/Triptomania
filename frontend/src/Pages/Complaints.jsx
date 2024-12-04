import React, { useState, useEffect } from 'react';
import axiosInstance from '@/axiosInstance';
import { Header } from '@/components/AdminHeader';
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useNavigate } from 'react-router-dom';
import Loading from "@/components/Loading";
import './Complaints.css';
import '@/index.css';

const ViewComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [sortOrder, setSortOrder] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllComplaints();
  }, []);

  const fetchAllComplaints = async () => {
    try {
      const response = await axiosInstance.get('/api/admin/complaints/viewComplaints');
      console.log(response.data);
      setComplaints(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching all complaints:', error);
      setLoading(false);
    }
  };

  const handleViewComplaint = async (complaintId) => {
    try {
      const response = await axiosInstance.get(`/api/admin/complaints/viewComplaint?id=${complaintId}`);
      if (response.status === 200) {
        // Redirect to the complaint details page and pass the complaint data
        navigate('/admin/complaint', { state: { complaint: response.data.complaint } });
      }
    } catch (error) {
      console.error('Error fetching complaint:', error);
    }
  };

  return (
    <div className="view-complaints">
      <Header />
      <div className="content">
        <aside className="filters">
          <h3 className="text-lg font-semibold mb-4">Filter by:</h3>

          {/* Sort by options */}
          <div className="mb-4">
            <Label>Sort by</Label>
            <RadioGroup value={sortOrder} onValueChange={(newOrder) => setSortOrder(newOrder)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="latest"
                  id="sort-latest"
                  onClick={() => fetchAllComplaints('latest')}
                />
                <Label htmlFor="sort-latest">Latest First</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="oldest"
                  id="sort-oldest"
                  onClick={() => fetchAllComplaints('oldest')}
                />
                <Label htmlFor="sort-oldest">Oldest First</Label>
              </div>
            </RadioGroup>
          </div>

          <Button onClick={() => fetchAllComplaints()} id="filter">
            Apply Filters
          </Button>
        </aside>

        <main className="complaints">
          {/* Loading state */}
          {loading ? (
            <Loading />
          ) : (
            complaints.length > 0 ? (
              complaints.map((complaint) => (
                <div className="complaint-card" key={complaint._id}>
                  <div className="complaint-details">
                    <div className="complaint-header">
                      <h2 className="complaint-title">
                        {complaint.title || 'No Title'}
                      </h2>
                      <div className="complaint-status">
                        <strong>Status: </strong>
                        <span>
                          {complaint.status}
                        </span>
                      </div>
                    </div>
                    <p className="complaint-description">
                      {complaint.body}
                    </p>
                    <div className="complaint-info">
                      <p>
                        <strong>Submitted by:</strong> {complaint.touristId?.username || 'Unknown'}
                      </p>
                      <p>
                        <strong>Date:</strong>{' '}
                        {new Date(complaint.date).toLocaleDateString() || 'Unknown'}
                      </p>
                    </div>
                    <div className="complaint-footer">
                      <Button
                        className="view-button"
                        onClick={() => handleViewComplaint(complaint._id)}
                      >
                        View
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No complaints found.</p>
            )
          )}
        </main>
      </div>
    </div>
  );
};

export default ViewComplaints;
