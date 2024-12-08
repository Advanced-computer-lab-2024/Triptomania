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
import './ActivityCategories.css';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('add');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({
    categoryName: '',
    categoryDescription: ''
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get('/api/admin/activities/getCategories');
      setCategories(response.data);
    } catch (error) {
      setError('Failed to fetch categories');
    }
  };

  const handleOpenDialog = (mode, category = null) => {
    setDialogMode(mode);
    setSelectedCategory(category);
    if (category) {
      setFormData({
        categoryName: category.CategoryName,
        categoryDescription: category.CategoryDescription
      });
    } else {
      setFormData({
        categoryName: '',
        categoryDescription: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCategory(null);
    setFormData({
      categoryName: '',
      categoryDescription: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (dialogMode === 'add') {
        await axiosInstance.post('/api/admin/activities/addCategory', formData);
        setSuccess('Category added successfully');
      } else {
        await axiosInstance.put('/api/admin/activities/editCategory', {
          id: selectedCategory._id,
          ...formData
        });
        setSuccess('Category updated successfully');
      }
      fetchCategories();
      handleCloseDialog();
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred');
    }
  };

  const handleDelete = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await axiosInstance.delete('/api/admin/activities/deleteCategory', {
          data: { id: categoryId }
        });
        setSuccess('Category deleted successfully');
        fetchCategories();
      } catch (error) {
        setError(error.response?.data?.message || 'Error deleting category');
      }
    }
  };

  return (
    <>
      <Header />
      <div className="categories-container">
        <div className="categories-header">
          <Typography variant="h4" component="h1">
            Activity Categories
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={() => handleOpenDialog('add')}
          >
            Add Category
          </Button>
        </div>

        <Grid container spacing={3} className="categories-grid">
          {categories.map((category) => (
            <Grid item xs={12} sm={6} md={4} key={category._id}>
              <Card className="category-card">
                <CardContent>
                  <Typography variant="h6" component="h2">
                    {category.CategoryName}
                  </Typography>
                  <Typography color="textSecondary" className="category-description">
                    {category.CategoryDescription}
                  </Typography>
                  <div className="category-actions">
                    <IconButton
                      onClick={() => handleOpenDialog('edit', category)}
                      color="primary"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(category._id)}
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
          aria-labelledby="category-dialog-title"
          disableEnforceFocus
          keepMounted
        >
          <DialogTitle id="category-dialog-title">
            {dialogMode === 'add' ? 'Add New Category' : 'Edit Category'}
          </DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit} className="category-form">
              <TextField
                label="Category Name"
                value={formData.categoryName}
                onChange={(e) =>
                  setFormData({ ...formData, categoryName: e.target.value })
                }
                fullWidth
                required
                margin="normal"
                autoFocus
              />
              <TextField
                label="Category Description"
                value={formData.categoryDescription}
                onChange={(e) =>
                  setFormData({ ...formData, categoryDescription: e.target.value })
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

export default Categories;