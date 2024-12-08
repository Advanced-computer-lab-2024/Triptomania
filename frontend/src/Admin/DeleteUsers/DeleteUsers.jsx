import React, { useState, useEffect } from 'react';
import { Header } from '../../components/AdminHeader';  // Changed to go up two levels

import { 
  Typography, 
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Paper,
  Snackbar,
  Alert
} from '@mui/material';
import axiosInstance from '@/axiosInstance';
import './DeleteUsers.css';

const DeleteUsers = () => {
  const [allUsers, setAllUsers] = useState({ 
    statistics: {
      totalUsers: 0,
      usersByType: {},
      usersByStatus: {},
      usersByMonth: {}
    },
    users: []
  });
  const [deletionRequests, setDeletionRequests] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [usersResponse, deleteRequestsResponse] = await Promise.all([
          axiosInstance.get('/api/admin/getAllUsers'),
          axiosInstance.get('/api/admin/getusersrequestdelete')
        ]);
        setAllUsers(usersResponse.data);
        setDeletionRequests(deleteRequestsResponse.data);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Failed to fetch users: ' + error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDeleteConfirm = async (userId, userType) => {
    try {
      setLoading(true);
      
      // Map the user type to match backend switch cases exactly
      let mappedType;
      switch (userType.toLowerCase()) {
        case 'tourist':
          mappedType = 'tourist';
          break;
        case 'tour guide':
          mappedType = 'tourGuide';
          break;
        case 'seller':
          mappedType = 'seller';
          break;
        case 'advertiser':
          mappedType = 'advertiser';
          break;
        case 'tourism governor':
          mappedType = 'tourismGovernor';
          break;
        case 'admin':
          mappedType = 'admin';
          break;
        default:
          throw new Error('Invalid user type');
      }
  
      console.log('Sending delete request with:', { // Debug log
        id: userId,
        type: mappedType
      });
  
      await axiosInstance.delete('/api/admin/deleteAccount', {
        data: {
          id: userId,
          type: mappedType
        }
      });
      
      // Refresh both lists
      const [usersResponse, deleteRequestsResponse] = await Promise.all([
        axiosInstance.get('/api/admin/getAllUsers'),
        axiosInstance.get('/api/admin/getusersrequestdelete')
      ]);
      
      setAllUsers(usersResponse.data);
      setDeletionRequests(deleteRequestsResponse.data);
      setOpenDialog(false);
      
      // Show success message
      setSuccessMessage(`User ${selectedUser?.username} has been successfully deleted`);
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Delete error:', error.response?.data || error);
      setError(error.response?.data?.message || 'Error deleting user');
    } finally {
      setLoading(false);
    }
  };

  const renderAdditionalInfo = (user) => {
    if (!user.additionalInfo) return null;

    return (
      <div className="additional-info">
        {Object.entries(user.additionalInfo).map(([key, value]) => (
          value && (
            <p key={key}>
              <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {value}
            </p>
          )
        ))}
      </div>
    );
  };

  const UserCard = ({ user }) => {
    return (
      <div className="document-card">
        <div className="document-card-content">
          <h3 className="user-name">{`${user.firstName || ''} ${user.lastName || ''}`}</h3>
          <p className="user-type">{user.userType}</p>
          <span className={`status-chip status-${user.status?.toLowerCase() || 'pending'}`}>
            {user.status || 'Pending'}
          </span>
          <div className="user-details">
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            {renderAdditionalInfo(user)}
          </div>
          <div className="button-group">
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                setSelectedUser({
                  _id: user._id,
                  type: user.userType,
                  username: user.username
                });
                setOpenDialog(true);
              }}
              className="reject-button"
              fullWidth
              sx={{
                bgcolor: '#dc3545',
                '&:hover': {
                  bgcolor: '#c82333'
                }
              }}
            >
              Delete User
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const DeletionRequestCard = ({ user }) => {
    return (
      <div className="document-card">
        <div className="document-card-content">
          <h3 className="user-name">{user.username}</h3>
          <p className="user-type">{user.type}</p>
          <span className={`status-chip ${user.canDelete ? 'status-accepted' : 'status-rejected'}`}>
            {user.canDelete ? 'Can Delete' : 'Cannot Delete'}
          </span>
          <div className="button-group">
            <Button
              variant="contained"
              color="error"
              disabled={!user.canDelete || loading}
              onClick={() => {
                setSelectedUser({
                  _id: user._id,
                  type: user.type,
                  username: user.username
                });
                setOpenDialog(true);
              }}
              className="reject-button"
              fullWidth
              sx={{
                bgcolor: '#dc3545',
                '&:hover': {
                  bgcolor: '#c82333'
                },
                '&:disabled': {
                  bgcolor: '#cccccc'
                }
              }}
            >
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Header />
      <div className="documents-container">
        <Typography variant="h4" component="h1" className="section-title">
          User Management
        </Typography>

        <Tabs 
          value={activeTab} 
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="All Users" />
          <Tab label="Deletion Requests" />
        </Tabs>

        {loading ? (
          <div className="loading-spinner">
            <Typography>Loading...</Typography>
          </div>
        ) : (
          <>
            {activeTab === 0 && (
              <>
                {/* Overall Statistics */}
                <div className="documents-grid">
                  <div className="document-card statistics-card">
                    <div className="document-card-content">
                      <h3 className="user-name">Total Users</h3>
                      <Typography variant="h3" className="statistics-number">
                        {allUsers?.statistics?.totalUsers || 0}
                      </Typography>
                    </div>
                  </div>
                  {Object.entries(allUsers?.statistics?.usersByType || {}).map(([type, count]) => (
                    <div className="document-card statistics-card" key={type}>
                      <div className="document-card-content">
                        <h3 className="user-name">{type.charAt(0).toUpperCase() + type.slice(1)}</h3>
                        <Typography variant="h3" className="statistics-number">
                          {count}
                        </Typography>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Monthly Statistics */}
                <Paper sx={{ padding: 2, marginY: 3, bgcolor: '#f5f5f5' }}>
                  <Typography variant="h6" gutterBottom className="section-title">
                    New Users by Month
                  </Typography>
                  <div className="monthly-stats-grid">
                    {Object.entries(allUsers?.statistics?.usersByMonth || {})
                      .sort((a, b) => b[0].localeCompare(a[0]))
                      .map(([month, count]) => (
                        <div className="document-card statistics-card" key={month}>
                          <div className="document-card-content">
                            <h3 className="month-title">
                              {new Date(month).toLocaleDateString('default', { 
                                month: 'long', 
                                year: 'numeric' 
                              })}
                            </h3>
                            <Typography variant="h3" className="statistics-number">
                              {count}
                            </Typography>
                            <Typography variant="body2" className="stats-label">
                              New Users
                            </Typography>
                          </div>
                        </div>
                    ))}
                  </div>
                </Paper>

                {/* Users List */}
                <h2 className="section-title">All Users</h2>
                <div className="documents-grid">
                  {allUsers?.users?.length > 0 ? (
                    allUsers.users.map((user) => (
                      <UserCard key={user._id} user={user} />
                    ))
                  ) : (
                    <div className="empty-state">
                      <Typography>No users found</Typography>
                    </div>
                  )}
                </div>
              </>
            )}

            {activeTab === 1 && (
              <>
                <h2 className="section-title">Deletion Requests</h2>
                <div className="documents-grid">
                  {deletionRequests.length > 0 ? (
                    deletionRequests.map((user) => (
                      <DeletionRequestCard key={user._id} user={user} />
                    ))
                  ) : (
                    <div className="empty-state">
                      <Typography>No deletion requests</Typography>
                    </div>
                  )}
                </div>
              </>
            )}
          </>
        )}

        <Dialog 
          open={openDialog} 
          onClose={() => setOpenDialog(false)}
        >
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete user <strong>{selectedUser?.username}</strong>? 
              This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => setOpenDialog(false)}
              sx={{ color: '#666' }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleDeleteConfirm(selectedUser?._id, selectedUser?.type)}
              color="error"
              variant="contained"
              disabled={loading}
              sx={{
                bgcolor: '#dc3545',
                '&:hover': {
                  bgcolor: '#c82333'
                }
              }}
            >
              {loading ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Success Snackbar */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity="success" 
            sx={{ 
              width: '100%',
              bgcolor: '#4caf50',
              color: 'white',
              '& .MuiAlert-icon': {
                color: 'white'
              }
            }}
          >
            {successMessage}
          </Alert>
        </Snackbar>

        {/* Error Snackbar */}
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError(null)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert 
            onClose={() => setError(null)} 
            severity="error"
            sx={{ 
              width: '100%',
              bgcolor: '#f44336',
              color: 'white',
              '& .MuiAlert-icon': {
                color: 'white'
              }
            }}
          >
            {error}
          </Alert>
        </Snackbar>
      </div>
    </>
  );
};

export default DeleteUsers;