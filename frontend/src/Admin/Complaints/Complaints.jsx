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
  const [sortOrder, setSortOrder] = useState(''); // Default to "latest first"
  const [filterStatus, setFilterStatus] = useState(''); // Filter by complaint status
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllComplaints(); // Fetch all complaints initially
  }, []);

  const fetchAllComplaints = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/api/admin/complaints/viewComplaints`);
      setComplaints(response.data);
    } catch (error) {
      console.error('Error fetching all complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSortedComplaints = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/api/admin/complaints/sortComplaints?sort=${sortOrder}`);
      setComplaints(response.data);
    } catch (error) {
      console.error('Error fetching sorted complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilteredComplaints = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/api/admin/complaints/filterComplaints?status=${filterStatus}`);
      setComplaints(response.data);
    } catch (error) {
      console.error('Error fetching filtered complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewComplaint = async (complaintId) => {
    try {
      const response = await axiosInstance.get(`/api/admin/complaints/viewComplaint?id=${complaintId}`);
      if (response.status === 200) {
        navigate('/admin/complaint', { state: { complaint: response.data.complaint } });
      }
    } catch (error) {
      console.error('Error fetching complaint:', error);
    }
  };

  const handleSortComplaints = (order) => {
    setSortOrder(order);
    fetchSortedComplaints(); // Trigger sorting once the order is set
  };

  const handleFilterComplaints = (status) => {
    setFilterStatus(status);
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
            <RadioGroup value={sortOrder} onValueChange={handleSortComplaints}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="asc" id="sort-latest" />
                <Label htmlFor="sort-latest">Latest First</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="desc" id="sort-oldest" />
                <Label htmlFor="sort-oldest">Oldest First</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Filter by status dropdown */}
          <div className="mb-4">
            <Label>Status</Label>
            <select
              value={filterStatus}
              onChange={(e) => handleFilterComplaints(e.target.value)}
              className="status-dropdown"
            >
              <option value="">Select Status</option>
              <option value="received">Received</option>
              <option value="pending">Pending</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          <Button onClick={fetchFilteredComplaints} id="filter">
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
                        <span>{complaint.status}</span>
                      </div>
                    </div>
                    <p className="complaint-description">{complaint.body}</p>
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
