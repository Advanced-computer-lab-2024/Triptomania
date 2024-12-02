import React, { useState, useEffect } from 'react';
import axiosInstance from '@/axiosInstance';
import { Header } from '../../components/Header2';
import { DollarSign, Star, Tag, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useNavigate } from 'react-router-dom';
import Loading from "@/components/Loading"; // Import the Loading component
import './ViewProducts.css';
import '../../index.css';

const ViewProducts = () => {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedRating, setSelectedRating] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortOrder, setSortOrder] = useState('high');
  const [loading, setLoading] = useState(true); // Track loading state
  const navigate = useNavigate();

  const handleAddToCartClick = (productId) => {
    // Implement add to cart functionality
    console.log(`Added product ${productId} to cart`);
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const fetchAllProducts = async () => {
    try {
      const response = await axiosInstance.get('/api/admin/product/viewProducts');
      setAllProducts(response.data);
      setProducts(response.data);
      setLoading(false);  // Set loading to false when data is fetched
    } catch (error) {
      console.error('Error fetching all products:', error);
      setLoading(false);  // Ensure loading is false even on error
    }
  };

  const fetchFilteredProducts = async () => {
    try {
      const params = {};

      if (priceRange[0] > 0 || priceRange[1] < 1000) {
        params.minPrice = priceRange[0];
        params.maxPrice = priceRange[1];
      }

      if (selectedRating) params.rating = selectedRating;
      if (selectedCategory) params.category = selectedCategory;

      const response = await axiosInstance.get('api/admin/product/filterProducts', { params });
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching filtered products:', error);
    }
  };

  const fetchSortedProducts = async (order) => {
    try {
      const response = await axiosInstance.get(`http://localhost:5000/api/admin/product/sortProducts`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching sorted products:', error);
    }
  };

  const handleSearch = async (name) => {
    if (!name) {
      // If the search term is empty, fetch all products again
      fetchAllProducts();
      return;
    }
  
    try {
      const response = await axiosInstance.get(`/api/admin/product/searchProducts`, {
        params: { Name: name },
      });
      setProducts(response.data);
    } catch (error) {
      console.error('Error searching products:', error);
    }
  };
  
  

  const handleFilterClick = () => {
    fetchFilteredProducts();
  };

  const handleSortChange = (value) => {
    setSortOrder(value);
    fetchSortedProducts(value);
  };

  const isBase64 = (str) => {
    try {
      return btoa(atob(str)) === str;
    } catch (err) {
      return false;
    }
  };

  return (
    <div className="view-products">
      <Header />
      <div className="content">
        <aside className="filters">
          <h3 className="text-lg font-semibold mb-4">Filter by:</h3>

          <div className="mb-4">
            <Label>Price Range</Label>
            <Slider
              min={0}
              max={1000}
              step={10}
              value={priceRange}
              onValueChange={setPriceRange}
            />
            <div className="flex justify-between text-sm mt-1">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>

          <div className="mb-4">
            <Label>Rating</Label>
            <RadioGroup value={selectedRating} onValueChange={setSelectedRating}>
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center space-x-2">
                  <RadioGroupItem value={rating.toString()} id={`rating-${rating}`} />
                  <Label htmlFor={`rating-${rating}`}>
                    {rating} {rating === 1 ? 'star' : 'stars'} & up
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="mb-4">
            <Label>Sort by</Label>
            <RadioGroup value={sortOrder} onValueChange={handleSortChange}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="high" id="sort-high" />
                <Label htmlFor="sort-high">Highest to Lowest Rating</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="low" id="sort-low" />
                <Label htmlFor="sort-low">Lowest to Highest Rating</Label>
              </div>
            </RadioGroup>
          </div>

          <Button onClick={handleFilterClick} className="mt-4">Apply Filters</Button>
        </aside>
        <main className="products">
          <div className="search-bar mb-4">
            <Input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              
              className="w-full"
            />
        <Button onClick={() => handleSearch(searchTerm)} className="ml-2">
    <Search className="w-4 h-4 mr-2" />
  Search
</Button>

          </div>

          {loading ? (
            <Loading />  // Show loading while fetching data
          ) : (
            products.length > 0 ? (
              products.map((product) => (
                <div className="product-card" key={product._id}>
                  <div className="product-image-container">
                    <img
                      src={
                        isBase64(product.Picture)
                          ? `data:image/jpeg;base64,${product.Picture}`
                          : product.image || 'https://via.placeholder.com/300x200'
                      }
                      alt={product.Name}
                      className="product-image"
                    />
                  </div>
                  <div className="product-details">
                    <div className="product-header">
                      <h2 className="product-title">{product.Name}</h2>
                      <div className="product-rating">
                        <Star className="icon" />
                        <span>{product.averageRating || 'N/A'}</span>
                      </div>
                    </div>
                    <p className="product-description">{product.Description}</p>
                    <div className="product-info">
                      <p>
                        <Tag className="icon" />
                        {product.category || 'N/A'}
                      </p>
                    </div>
                    <div className="product-footer">
                      <p className="product-price">
                        <DollarSign className="icon" />
                        {product.Price.toFixed(2)} USD
                      </p>
                      <Button className="add-to-cart-button" onClick={() => handleAddToCartClick(product._id)}>
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No products found.</p>
            )
          )}
        </main>
      </div>
    </div>
  );
};

export default ViewProducts;
