import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from '@/components/HeaderAdmin';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import axiosInstance from '@/axiosInstance';
import './Complaint.css';

const ComplaintDetails = () => {
  const location = useLocation();
  const { complaint } = location.state || {};
  const [reply, setReply] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!complaint) {
    return (
      <div className="complaint-details-page">
        <Header />
        <div className="content">
          <p className="error-message">No complaint data found. Please go back and try again.</p>
        </div>
      </div>
    );
  }
  const handleSendReply = async () => {
    setIsReplying(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      // Send reply to the server
      const response = await axiosInstance.post('/api/admin/complaints/reply', {
        complaintId: complaint._id,
        reply,
      });

      if (response.status === 200) {
        setSuccessMessage('Reply sent successfully!');
        setReply('');
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
          <p className="mt-4">{complaint.body}</p>
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
