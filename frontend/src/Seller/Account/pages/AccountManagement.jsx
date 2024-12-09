import React, { useState, useEffect } from 'react';
import { Header } from '@/components/SellerHeader';
import AccountInfo from '../components/AccountInfo';
import SecuritySettings from '../components/SecuritySettings';
import { Gift } from 'lucide-react';
import './index.css';
import { useUser } from '@/UserContext';
import Loading from '@/components/Loading';

const AccountManagement = () => {
  const [activeTab, setActiveTab] = useState('accountInfo');
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUser();

  

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const tabs = [
    { id: 'accountInfo', label: 'Account Info' },
    { id: 'securitySettings', label: 'Security & Settings' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'accountInfo':
        return <AccountInfo />;
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
