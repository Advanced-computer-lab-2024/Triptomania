import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from '@/components/AdminHeader';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import axiosInstance from '@/axiosInstance';
import './Complaint.css';
import Loading from '@/components/Loading';

const ComplaintDetails = () => {
  const location = useLocation();
  const { id } = location.state || {};
  const [complaint, setComplaint] = useState({});
  const [reply, setReply] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [status, setStatus] = useState(''); // Initialize status
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaintDetails(); // Fetch all complaints initially
  }, []);

  const fetchComplaintDetails = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/api/admin/complaints/viewComplaint?id=${id}`);
      if (response.status === 200) {
        setComplaint(response.data.complaint)
      }
    } catch (error) {
      console.error('Error fetching complaint:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleSendReply = async () => {
    setIsReplying(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      // Send reply to the server
      const response = await axiosInstance.put('/api/admin/complaints/replyToComplaint', {
        id: complaint._id,
        reply,
      });

      if (response.status === 200) {
        setSuccessMessage('Reply sent successfully!');
        setReply('');
        fetchComplaintDetails();
      } else {
        setErrorMessage('Failed to send reply. Please try again.');
      }
    } catch (error) {
      console.error('Error sending reply:', error);
      setErrorMessage('An error occurred while sending the reply.');
    } finally {
      setIsReplying(false);
    }
  };

  const handleStatusChange = async (event) => {
    const newStatus = event.target.value;
    if (newStatus === '') {
      return;
    }
    setStatus(newStatus);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      setLoading(true);
      const response = await axiosInstance.put('/api/admin/complaints/updateStatus', {
        id: complaint._id,
        status: newStatus,
      });

      if (response.status === 200) {
        setSuccessMessage(`Complaint status updated to "${newStatus}".`);
        fetchComplaintDetails();
      } else {
        setErrorMessage('Failed to update status. Please try again.');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      setErrorMessage('An error occurred while updating the status.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />

  return (
    <div className="complaint-details-page">
      <Header />
      <div className="content">
        {/* Complaint Details Box */}
        <div className="complaint-box">
          <h2 className="text-lg font-bold">{complaint.title || 'No Title'}</h2>
          <p>
            <strong>Submitted by:</strong> {complaint.touristId?.username || 'Unknown'}
          </p>
          <p>
            <strong>Status:</strong> {complaint.status}
          </p>
          <p>
            <strong>Date:</strong> {new Date(complaint.date).toLocaleDateString() || 'Unknown'}
          </p>
          <p>
            <strong>Previous reply:</strong> {complaint.reply || 'No Reply'}
          </p>
          <p className="mt-4">{complaint.body}</p>

          {/* Status Dropdown */}
          <div className="status-dropdown-container mt-2">
            <select
              value={status}
              onChange={handleStatusChange}
              className="status-dropdown"
            >
              <option value="">Choose status</option>
              <option value="pending">Mark as Pending</option>
              <option value="resolved">Mark as Resolved</option>
              
            </select>
          </div>
        </div>

        {/* Reply Box */}
        <div className="reply-box">
          <h3 className="text-lg font-bold mb-2">Reply to Complaint</h3>
          <Textarea
            placeholder="Write your reply here..."
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            className="reply-textarea"
          />
          <Button
            onClick={handleSendReply}
            disabled={isReplying || !reply.trim()}
            className="send-reply-button mt-2"
          >
            {isReplying ? 'Sending...' : 'Send Reply'}
          </Button>

          {/* Success or Error Messages */}
          {successMessage && <p className="success-message">{successMessage}</p>}
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetails;
