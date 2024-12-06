import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import Loading from '@/components/Loading';
import { useUser } from '@/UserContext';
import axiosInstance from '@/axiosInstance';

const Addresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({
    address: '',
    city: '',
    state: '',
    zip: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const { user, setUser } = useUser();

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setAddresses(user.deliveryAddresses);
      } catch (error) {
        console.error('Error fetching addresses:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAddresses();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAddress(prevAddress => ({ ...prevAddress, [name]: value }));
  };

  const handleAddAddress = async () => {
    try {
      const response = await axiosInstance.put('/api/tourist/addDeliveryAddress', newAddress);
      if (response.status === 201) {
        const updatedUser = await axiosInstance.get('/api/auth/updateUser');
        setUser(updatedUser.data.user);
        setAddresses(user.deliveryAddresses);
        setNewAddress({ address: '', city: '', state: '', zip: '' });
        window.location.reload();
      } else {
        throw new Error('Failed to add address');
      }
    } catch (error) {
      console.error('Error adding address:', error);
      alert('Failed to add address. Please try again.');
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Saved Addresses</h3>
        {addresses.map((address, index) => (
          <div key={address.id || index} className="bg-gray-100 p-4 rounded-md mb-2">
            <p>{address.address}</p>
            <p>{address.city}, {address.state} {address.zip}</p>
          </div>
        ))}
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2">Add New Address</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <input
              type="text"
              name="address"
              value={newAddress.address}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">City</label>
            <input
              type="text"
              name="city"
              value={newAddress.city}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">State</label>
            <input
              type="text"
              name="state"
              value={newAddress.state}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Zip Code</label>
            <input
              type="text"
              name="zip"
              value={newAddress.zip}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
            />
          </div>
        </div>
        <Button className="mt-4 bg-primary text-white hover:bg-secondary" onClick={handleAddAddress}>
          Add Address
        </Button>
      </div>
    </div>
  );
};

export default Addresses;
