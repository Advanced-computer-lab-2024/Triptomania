import React, { useState, useEffect } from 'react';
import { Header } from '../../components/AdminHeader';
import {
  Typography,
  Button,
  Dialog,
  TextField,
  Card,
  CardContent,
  IconButton,
  Snackbar,
  Alert,
  Grid,
  DialogContent,
  DialogTitle
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import axiosInstance from '@/axiosInstance';
import './PreferenceTags.css';

const PreferenceTags = () => {
  const [preferenceTags, setPreferenceTags] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('add');
  const [selectedTag, setSelectedTag] = useState(null);
  const [formData, setFormData] = useState({
    preferenceTagName: '',
    preferenceTagDescription: ''
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchPreferenceTags();
  }, []);

  const fetchPreferenceTags = async () => {
    try {
      const response = await axiosInstance.get('/api/admin/tags/getPreferenceTags');
      setPreferenceTags(response.data);
    } catch (error) {
      setError('Failed to fetch preference tags');
    }
  };

  const handleOpenDialog = (mode, tag = null) => {
    setDialogMode(mode);
    setSelectedTag(tag);
    if (tag) {
      setFormData({
        preferenceTagName: tag.PreferenceTagName,
        preferenceTagDescription: tag.PreferenceTagDescription
      });
    } else {
      setFormData({
        preferenceTagName: '',
        preferenceTagDescription: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedTag(null);
    setFormData({
      preferenceTagName: '',
      preferenceTagDescription: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (dialogMode === 'add') {
        await axiosInstance.post('/api/admin/tags/addPreferenceTag', formData);
        setSuccess('Preference tag added successfully');
      } else {
        await axiosInstance.put('/api/admin/tags/editPreferenceTag', {
          id: selectedTag._id,
          ...formData
        });
        setSuccess('Preference tag updated successfully');
      }
      fetchPreferenceTags();
      handleCloseDialog();
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred');
    }
  };

  const handleDelete = async (tagId) => {
    if (window.confirm('Are you sure you want to delete this preference tag?')) {
      try {
        await axiosInstance.delete('/api/admin/tags/deletePreferenceTag', {
          data: { id: tagId }
        });
        setSuccess('Preference tag deleted successfully');
        fetchPreferenceTags();
      } catch (error) {
        setError(error.response?.data?.message || 'Error deleting preference tag');
      }
    }
  };

  return (
    <>
      <Header />
      <div className="preference-tags-container">
        <div className="preference-tags-header">
          <Typography variant="h4" component="h1">
            Preference Tags
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={() => handleOpenDialog('add')}
          >
            Add Preference Tag
          </Button>
        </div>

        <Grid container spacing={3} className="preference-tags-grid">
          {preferenceTags.map((tag) => (
            <Grid item xs={12} sm={6} md={4} key={tag._id}>
              <Card className="preference-tag-card">
                <CardContent>
                  <Typography variant="h6" component="h2">
                    {tag.PreferenceTagName}
                  </Typography>
                  <Typography color="textSecondary" className="preference-tag-description">
                    {tag.PreferenceTagDescription}
                  </Typography>
                  <div className="preference-tag-actions">
                    <IconButton
                      onClick={() => handleOpenDialog('edit', tag)}
                      color="primary"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(tag._id)}
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </div>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Dialog 
          open={openDialog} 
          onClose={handleCloseDialog}
          aria-labelledby="preference-tag-dialog-title"
          disableEnforceFocus
          keepMounted
        >
          <DialogTitle id="preference-tag-dialog-title">
            {dialogMode === 'add' ? 'Add New Preference Tag' : 'Edit Preference Tag'}
          </DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit} className="preference-tag-form">
              <TextField
                label="Preference Tag Name"
                value={formData.preferenceTagName}
                onChange={(e) =>
                  setFormData({ ...formData, preferenceTagName: e.target.value })
                }
                fullWidth
                required
                margin="normal"
                autoFocus
              />
              <TextField
                label="Preference Tag Description"
                value={formData.preferenceTagDescription}
                onChange={(e) =>
                  setFormData({ ...formData, preferenceTagDescription: e.target.value })
                }
                fullWidth
                required
                margin="normal"
                multiline
                rows={4}
              />
              <div className="dialog-actions">
                <Button 
                  onClick={handleCloseDialog}
                  type="button"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary"
                >
                  {dialogMode === 'add' ? 'Add' : 'Update'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

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
      </div>
    </>
  );
};

export default PreferenceTags;