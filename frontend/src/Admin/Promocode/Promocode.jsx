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
  Container
} from '@mui/material';
import axiosInstance from '@/axiosInstance';
import './Promocode.css';

const CreatePromoCode = () => {
  const [formData, setFormData] = useState({
    code: '',
    discount: '',
    expiryDate: ''
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/api/admin/addPromoCode', formData);
      setSuccess('Promo code created successfully');
      // Clear form
      setFormData({
        code: '',
        discount: '',
        expiryDate: ''
      });
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <>
      <Header />
      <Container maxWidth="sm" className="create-promo-container">
        <Card className="promo-form-card">
          <CardContent>
            <Typography variant="h4" component="h1" className="page-title">
              Create Promo Code
            </Typography>
            
            <form onSubmit={handleSubmit} className="promo-form">
              <TextField
                label="Promo Code"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value.toUpperCase() })
                }
                fullWidth
                required
                margin="normal"
                placeholder="e.g., SUMMER2024"
              />
              
              <TextField
                label="Discount (%)"
                value={formData.discount}
                onChange={(e) =>
                  setFormData({ ...formData, discount: e.target.value })
                }
                fullWidth
                required
                margin="normal"
                type="number"
                inputProps={{ min: 0, max: 100 }}
                placeholder="Enter discount percentage"
              />
              
              <TextField
                label="Expiry Date"
                type="date"
                value={formData.expiryDate}
                onChange={(e) =>
                  setFormData({ ...formData, expiryDate: e.target.value })
                }
                fullWidth
                required
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  min: new Date().toISOString().split('T')[0]
                }}
              />
              
              <Button 
                type="submit" 
                variant="contained" 
                color="primary"
                fullWidth
                className="submit-button"
              >
                Create Promo Code
              </Button>
            </form>
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

export default CreatePromoCode;