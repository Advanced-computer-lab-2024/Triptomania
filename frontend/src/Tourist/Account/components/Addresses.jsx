import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";

const Addresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await fetch('/api/user-addresses');
        const data = await response.json();
        setAddresses(data);
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
      const response = await fetch('/api/add-address', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAddress),
      });
      if (response.ok) {
        const addedAddress = await response.json();
        setAddresses(prevAddresses => [...prevAddresses, addedAddress]);
        setNewAddress({ address: '', city: '', state: '', zipCode: '' });
      } else {
        throw new Error('Failed to add address');
      }
    } catch (error) {
      console.error('Error adding address:', error);
      alert('Failed to add address. Please try again.');
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-primary mb-4">Addresses</h2>
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Saved Addresses</h3>
        {addresses.map(address => (
          <div key={address.id} className="bg-gray-100 p-4 rounded-md mb-2">
            <p>{address.address}</p>
            <p>{address.city}, {address.state} {address.zipCode}</p>
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
              name="zipCode"
              value={newAddress.zipCode}
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

