import React, { useState } from 'react';
import { Header } from '../../components/AdminHeader';
import {
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  Snackbar,
  Alert,
  Container,
  Tabs,
  Tab,
  Box
} from '@mui/material';
import { PersonAdd, SupervisorAccount } from '@mui/icons-material';
import axiosInstance from '@/axiosInstance';
import './AccountCreation.css';

const CreateAccounts = () => {
  const [tabValue, setTabValue] = useState(0);
  const [adminForm, setAdminForm] = useState({
    adminName: '',
    adminUsername: '',
    adminPassword: '',
    email: ''
  });
  const [governorForm, setGovernorForm] = useState({
    tourismGovernorName: '',
    tourismGovernorUsername: '',
    tourismGovernorPassword: '',
    email: ''
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/api/admin/addAdmin', {
        name: adminForm.adminName,
        username: adminForm.adminUsername,
        password: adminForm.adminPassword,
        email: adminForm.email,
        type: 'admin'  // Adding the type field with default value
      });
      setSuccess('Admin account created successfully');
      setAdminForm({
        adminName: '',
        adminUsername: '',
        adminPassword: '',
        email: ''
      });
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create admin account');
    }
};
  const handleGovernorSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/api/admin/addTourismGovernor', {
        tourismGovernorName: governorForm.tourismGovernorName,
        tourismGovernorUsername: governorForm.tourismGovernorUsername,
        tourismGovernorPassword: governorForm.tourismGovernorPassword,
        email: governorForm.email
      });
      setSuccess('Tourism Governor account created successfully');
      setGovernorForm({
        tourismGovernorName: '',
        tourismGovernorUsername: '',
        tourismGovernorPassword: '',
        email: ''
      });
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create governor account');
    }
  };

  return (
    <>
      <Header />
      <Container maxWidth="sm" className="create-accounts-container">
        <Card className="accounts-form-card">
          <CardContent>
            <Typography variant="h4" component="h1" className="page-title">
              Create Accounts
            </Typography>

            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              centered
              className="account-tabs"
            >
              <Tab 
                icon={<PersonAdd />} 
                label="Admin" 
                className="tab-item"
              />
              <Tab 
                icon={<SupervisorAccount />} 
                label="Tourism Governor" 
                className="tab-item"
              />
            </Tabs>

            <Box className="tab-content">
              {tabValue === 0 && (
                <form onSubmit={handleAdminSubmit} className="account-form">
                  <TextField
                    label="Admin Name"
                    value={adminForm.adminName}
                    onChange={(e) =>
                      setAdminForm({ ...adminForm, adminName: e.target.value })
                    }
                    fullWidth
                    required
                    margin="normal"
                  />
                  <TextField
                    label="Username"
                    value={adminForm.adminUsername}
                    onChange={(e) =>
                      setAdminForm({ ...adminForm, adminUsername: e.target.value })
                    }
                    fullWidth
                    required
                    margin="normal"
                  />
                  <TextField
                    label="Email"
                    type="email"
                    value={adminForm.email}
                    onChange={(e) =>
                      setAdminForm({ ...adminForm, email: e.target.value })
                    }
                    fullWidth
                    required
                    margin="normal"
                  />
                  <TextField
                    label="Password"
                    type="password"
                    value={adminForm.adminPassword}
                    onChange={(e) =>
                      setAdminForm({ ...adminForm, adminPassword: e.target.value })
                    }
                    fullWidth
                    required
                    margin="normal"
                  />
                  <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary"
                    fullWidth
                    className="submit-button"
                    startIcon={<PersonAdd />}
                  >
                    Create Admin Account
                  </Button>
                </form>
              )}

              {tabValue === 1 && (
                <form onSubmit={handleGovernorSubmit} className="account-form">
                  <TextField
                    label="Governor Name"
                    value={governorForm.tourismGovernorName}
                    onChange={(e) =>
                      setGovernorForm({ ...governorForm, tourismGovernorName: e.target.value })
                    }
                    fullWidth
                    required
                    margin="normal"
                  />
                  <TextField
                    label="Username"
                    value={governorForm.tourismGovernorUsername}
                    onChange={(e) =>
                      setGovernorForm({ ...governorForm, tourismGovernorUsername: e.target.value })
                    }
                    fullWidth
                    required
                    margin="normal"
                  />
                  <TextField
                    label="Email"
                    type="email"
                    value={governorForm.email}
                    onChange={(e) =>
                      setGovernorForm({ ...governorForm, email: e.target.value })
                    }
                    fullWidth
                    required
                    margin="normal"
                  />
                  <TextField
                    label="Password"
                    type="password"
                    value={governorForm.tourismGovernorPassword}
                    onChange={(e) =>
                      setGovernorForm({ ...governorForm, tourismGovernorPassword: e.target.value })
                    }
                    fullWidth
                    required
                    margin="normal"
                  />
                  <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary"
                    fullWidth
                    className="submit-button"
                    startIcon={<SupervisorAccount />}
                  >
                    Create Governor Account
                  </Button>
                </form>
              )}
            </Box>
          </CardContent>
        </Card>

        <Snackbar
          open={!!error || !!success}
          autoHideDuration={6000}
          onClose={() => {
            setError(null);
            setSuccess(null);
          }}
        >
          <Alert
            severity={error ? 'error' : 'success'}
            onClose={() => {
              setError(null);
              setSuccess(null);
            }}
          >
            {error || success}
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
};

export default CreateAccounts;
