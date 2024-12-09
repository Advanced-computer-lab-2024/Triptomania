import React, { useEffect, useState } from "react";
import axiosInstance from '@/axiosInstance';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Calendar, Search } from 'lucide-react';
import { Header } from '../components/SellerHeader';
import '../index.css';
import image1 from '../assets/Images/1.png';
import image2 from '../assets/Images/2.png';
import image3 from '../assets/Images/3.jpg';
import { Link } from 'react-router-dom';

function FeaturedProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get(
          "http://localhost:5000/api/seller/product/viewProducts"
        );

        if (Array.isArray(response.data.data)) {
          setProducts(response.data.data); // Update state with the array of products
        } else {
          console.error("Invalid data format: products is not an array", response.data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  function getImageForItinerary(index) {
    switch (index) {
      case 0:
        return image1;
      case 1:
        return image2;
      case 2:
        return image3;
      default:
        return image1;
    }
  }

  const featuredProducts = products.slice(0, 3);

  return (
    <section className="py-12 px-4">
      <h2 className="text-3xl font-bold mb-6 text-center"> Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {featuredProducts.map((product, index) => (
          <Card key={product._id}>
            <CardHeader>
              <CardTitle>{product.Name}</CardTitle>
              <CardDescription>{product.Description}</CardDescription>
            </CardHeader>
            <CardContent>
              <img src={getImageForItinerary(index)} alt="Itinerary Image" className="w-full h-[200px] object-cover rounded-md" />
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                <span>{product.Ratings}</span>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}

function MyProducts() {
  const [myProducts, setMyProducts] = useState([]);
  {/*const { id } = useParams();*/ }

  useEffect(() => {
    const fetchMyProducts = async () => {
      try {
        const response = await axiosInstance.get(
          `http://localhost:5000/api/seller/product/viewMyProducts`
        );

        if (Array.isArray(response.data.data)) {
          setMyProducts(response.data.data); // Update state with the user's products
        } else {
          console.error("Invalid data format: products is not an array", response.data);
        }
      } catch (error) {
        console.error("Error fetching user's products:", error);
      }
    };

    fetchMyProducts();
  }, []);

  function getImageForProduct(index) {
    switch (index) {
      case 0:
        return image1;
      case 1:
        return image2;
      case 2:
        return image3;
      default:
        return image1;
    }
  }

  const myProductsList = myProducts.slice(0, 3); // Display only 3 products for now

  return (
    <section className="py-12 px-4 bg-gray-50">
      <h2 className="text-3xl font-bold mb-6 text-center">My Products</h2>
      {myProducts.length === 0 ? (
        <div className="text-center text-lg font-medium text-gray-500">
          You don't have any products.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {myProductsList.map((product, index) => (
            <Card key={product._id}>
              <CardHeader>
                <CardTitle>{product.Name}</CardTitle>
                <CardDescription>{product.Description}</CardDescription>
              </CardHeader>
              <CardContent>
                <img src={getImageForProduct(index)} alt="Product Image" className="w-full h-[200px] object-cover rounded-md" />
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>{product.Ratings}</span>
                </div>
                <Link to={`/product/${product._id}`}>
                  <Button>View Details</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[500px]">
        <img
          src="..\src\assets\Images\back.jpg"
          alt="Hero Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <h1 className="text-4xl font-bold mb-4">Discover Your Next Adventure</h1>
          <p className="text-xl mb-8">Book hotels, flights, activities, and more</p>
          <div className="flex w-full max-w-md space-x-2">
            <Input placeholder="Where do you want to go?" className="flex-grow" />
            <Button><Search className="mr-2 h-4 w-4" /> Search</Button>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <FeaturedProducts />

      {/* My Products Section */}
      <MyProducts />
    </div>
  );
}
