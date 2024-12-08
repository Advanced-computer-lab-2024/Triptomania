import React, { useState, useEffect } from 'react';
import { Header } from '@/components/HeaderTourist';
import AccountInfo from '../components/AccountInfo';
import Addresses from '../components/Addresses';
import Bookings from '../components/Bookings';
import BookmarkedEvents from '../components/BookmarkedEvents';
import SecuritySettings from '../components/SecuritySettings';
import Orders from '../components/Orders';
import { Gift } from 'lucide-react';
import './index.css';
import { useUser } from '@/UserContext';
import Loading from '@/components/Loading';

const AccountManagement = () => {
  const [activeTab, setActiveTab] = useState('accountInfo');
  const [walletBalance, setWalletBalance] = useState(0);
  const [pointBalance, setPointBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    const fetchWalletBalance = async () => {
      try {
        setWalletBalance(user.wallet);
        setPointBalance(user.points);
      } catch (error) {
        console.error('Error fetching wallet balance:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWalletBalance();
  }, [user]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const tabs = [
    { id: 'accountInfo', label: 'Account Info' },
    { id: 'addresses', label: 'Addresses' },
    { id: 'orders', label: 'Orders' },
    { id: 'hotelBookings', label: 'Hotel Bookings' },
    { id: 'flightBookings', label: 'Flight Bookings' },
    { id: 'transportationBookings', label: 'Transportation Bookings' },
    { id: 'eventBookings', label: 'Event Bookings' },
    { id: 'bookmarkedEvents', label: 'Bookmarked Events' },
    { id: 'securitySettings', label: 'Security & Settings' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'accountInfo':
        return <AccountInfo />;
      case 'addresses':
        return <Addresses />;
      case 'orders':
        return <Orders />;
      case 'hotelBookings':
        return <Bookings type="hotel" />;
      case 'flightBookings':
        return <Bookings type="flight" />;
      case 'transportationBookings':
        return <Bookings type="transportation" />;
      case 'eventBookings':
        return <Bookings type="event" />;
      case 'bookmarkedEvents':
        return <BookmarkedEvents />;
      case 'securitySettings':
        return <SecuritySettings />;
      default:
        return <AccountInfo />;
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/4 mb-6 md:mb-0 md:pr-4">
            <div className="bg-white rounded-lg shadow p-4 mb-4">
              <h2 className="text-xl font-semibold text-primary mb-2">Wallet Balance</h2>
              {isLoading ? (
                <Loading />
              ) : (
                <p className="text-2xl font-bold">${walletBalance.toFixed(2)}</p>
              )}
              <br></br>
              <h2 className="text-xl font-semibold text-primary mb-2 inline-flex">Points Balance &nbsp; <Gift /></h2>
              {isLoading ? (
                <Loading />
              ) : (
                <p className="text-2xl font-bold">{pointBalance}</p>
              )}
            </div>
            <nav className="bg-white rounded-lg shadow overflow-hidden">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  id='tab-button'
                  className={`block w-full text-left px-4 py-2 hover:bg-secondary hover:text-white transition-colors ${
                    activeTab === tab.id ? 'bg-primary text-white' : 'text-gray-700'
                  }`}upcoming
                  onClick={() => handleTabChange(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
          <div className="w-full md:w-3/4 md:pl-4">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-semibold text-primary mb-4">{tabs.find(tab => tab.id === activeTab)?.label}</h2>
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountManagement;
