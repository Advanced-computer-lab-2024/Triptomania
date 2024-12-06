import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography } from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import './DocumentsViewer.css';
import axiosInstance from '@/axiosInstance';

const DocumentsViewer = () => {
    const [documents, setDocuments] = useState({
        sellers: [],
        advertisers: [],
        tourGuides: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

   const fetchDocuments = async () => {
    try {
        const response = await axiosInstance.get('/api/admin/getAllDocuments');
        
        if (response.data && response.data.documents) {
            // Filter out users with no documents or 'none' documents
            const filteredDocuments = {
                sellers: response.data.documents.sellers.filter(seller => 
                    seller.status === 'pending'),
                advertisers: response.data.documents.advertisers.filter(advertiser => 
                    advertiser.status === 'pending'),
                tourGuides: response.data.documents.tourGuides.filter(guide => 
                    guide.status === 'pending')
            };
            
            setDocuments(filteredDocuments);
        } else {
            throw new Error('Invalid response structure');
        }
        setLoading(false);
    } catch (err) {
        console.error('Error details:', err);
        setError(`Failed to fetch documents: ${err.message}`);
        setLoading(false);
    }
};
    useEffect(() => {
        fetchDocuments();
    }, []);

    const UserDocumentCard = ({ user, userType }) => {
        const handleViewDocument = () => {
            if (!user.documentUrl || user.documentUrl === 'none' || user.documentUrl === '') {
                alert('No document uploaded by this user');
                return;
            }
            window.open(user.documentUrl, '_blank', 'noopener,noreferrer');
        };
        
        const handleAccept = async () => {
            try {
                await axiosInstance.put('/api/admin/acceptUser', {type: user.userType, id: user.userId});  // Add user ID to URL
                fetchDocuments();
            } catch (err) {
                console.error('Accept error:', err);
                alert('Failed to accept user');
            }
        };

        const handleReject = async () => {
            try {
                await axiosInstance.put('/api/admin/rejectUser', {type: user.userType, id: user.userId});  // Add user ID to URL
                fetchDocuments();
            } catch (err) {
                console.error('Reject error:', err);
                alert('Failed to reject user');
            }
        };
        return (
            <div className="document-card">
                <div className="document-card-content">
                    <h3 className="user-name">{user.name}</h3>
                    <p className="user-type">{userType}</p>
                    <span className={`status-chip status-${(user.status || '').toLowerCase()}`}>
                        {user.status || 'Pending'}
                    </span>
                    <div className="button-group">
                        <button 
                            className={`view-button ${(!user.documentUrl || user.documentUrl === 'none' || user.documentUrl === '') ? 'disabled' : ''}`}
                            onClick={handleViewDocument}
                            disabled={!user.documentUrl || user.documentUrl === 'none' || user.documentUrl === ''}
                        >
                            <PictureAsPdfIcon />
                            {(!user.documentUrl || user.documentUrl === 'none' || user.documentUrl === '') 
                                ? 'No Document' 
                                : 'View Document'}
                        </button>
                        <div className="action-buttons">
                            <button 
                                className="accept-button"
                                onClick={handleAccept}
                            >
                                Accept
                            </button>
                            <button 
                                className="reject-button"
                                onClick={handleReject}
                            >
                                Reject
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="documents-container">
                <div className="loading-spinner">
                    <Typography>Loading documents...</Typography>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="documents-container">
                <div className="error-message">
                    <Typography>{error}</Typography>
                </div>
            </div>
        );
    }

    return (
        <div className="documents-container">
            <h1 className="section-title">Pending Documents</h1>

            {/* Sellers Section */}
            <h2 className="section-title">Pending Seller Documents</h2>
            <div className="documents-grid">
                {documents.sellers && documents.sellers.length > 0 ? (
                    documents.sellers.map((seller) => (
                        <UserDocumentCard 
                            key={seller.userId} 
                            user={seller} 
                            userType="Seller" 
                        />
                    ))
                ) : (
                    <div className="empty-state">
                        <Typography>No pending seller documents</Typography>
                    </div>
                )}
            </div>

            {/* Advertisers Section */}
            <h2 className="section-title">Pending Advertiser Documents</h2>
            <div className="documents-grid">
                {documents.advertisers && documents.advertisers.length > 0 ? (
                    documents.advertisers.map((advertiser) => (
                        <UserDocumentCard 
                            key={advertiser.userId} 
                            user={advertiser} 
                            userType="Advertiser" 
                        />
                    ))
                ) : (
                    <div className="empty-state">
                        <Typography>No pending advertiser documents</Typography>
                    </div>
                )}
            </div>

            {/* Tour Guides Section */}
            <h2 className="section-title">Pending Tour Guide Documents</h2>
            <div className="documents-grid">
                {documents.tourGuides && documents.tourGuides.length > 0 ? (
                    documents.tourGuides.map((guide) => (
                        <UserDocumentCard 
                            key={guide.userId} 
                            user={guide} 
                            userType="Tour Guide" 
                        />
                    ))
                ) : (
                    <div className="empty-state">
                        <Typography>No pending tour guide documents</Typography>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DocumentsViewer;