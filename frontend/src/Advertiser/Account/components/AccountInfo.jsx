import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import Loading from '@/components/Loading';
import axiosInstance from '@/axiosInstance';
import { useUser } from "@/UserContext.jsx";

const AccountInfo = () => {

  const [userInfo, setUserInfo] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const { user, setUser } = useUser();

  useEffect(() => {
    setIsLoading(true);
    const fetchUserData = async () => {
      try {
        setUserInfo(user);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prevInfo => ({ ...prevInfo, [name]: value }));
  };

  const handleSaveChanges = async () => {
    try {
      const response = await axiosInstance.put('/api/advertiser/updateAdvertiser', userInfo);
      if (response.status === 200) {
        alert('User information updated successfully!');
        const updatedUser = await axiosInstance.get('/api/auth/updateUser');
        await setUser(updatedUser.data.user);
        setUserInfo(updatedUser.data.user);
      } else {
        throw new Error('Failed to update user information');
      }
    } catch (error) {
      console.error('Error updating user information:', error);
      alert('Failed to update user information. Please try again.');
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
    
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">First Name</label>
          <input
            type="text"
            name="firstName"
            value={userInfo.firstName || ''}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={userInfo.lastName || ''}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Username</label>
          <input
            type="text"
            value={userInfo.username || ''}
            readOnly
            className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={userInfo.email || ''}
            readOnly
            className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm"
          />
        </div>
   
        <div>
          <label className="block text-sm font-medium text-gray-700">Hotline</label>
          <input
            type="text"
            name="hotline"
            value={userInfo.companyHotline || ''}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Website Link</label>
          <input
            type="text"
            name="websiteLink"
            value={userInfo.previousWork || ''}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
          />
        </div>
        
      </div>
      <Button className="mt-6 bg-primary text-white hover:bg-secondary" onClick={handleSaveChanges}>
        Save Changes
      </Button>
    </div>
  );
};

export default AccountInfo;

