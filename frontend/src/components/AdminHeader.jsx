import React, { useState } from 'react';
import { Bell, User } from 'lucide-react';
import './AdminHeader.css';

const menuItems = [
  { name: 'Home', href: '/admin/adminHomePage' },
  { name: 'Activities', href: '#' },
  { name: 'Complaints', href: '#' },
  { name: 'Itineraries', href: '#' },
  {
    name: 'User Accounts',
    href: '#',
    subitems: [
      { name: 'Account Deletion', href: '#' },
      { name: 'Document Reviews', href: '#' },
    ],
  },
  {
    name: 'Products',
    href: '/admin/products/viewproducts',
  },
  {
    name: 'System Administration',
    href: '#',
    subitems: [
      { name: 'Activity Categories', href: '#' },
      { name: 'Preference Tags', href: '#' },
      { name: 'Reports', href: '#' },
      { name: 'Promo Codes', href: '#' },
    ],
  },
];

export function Header() {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [timeoutId, setTimeoutId] = useState(null);

  const handleMouseEnter = (itemName) => {
    clearTimeout(timeoutId); // Clear any existing timeout
    setHoveredItem(itemName);
  };

  const handleMouseLeave = () => {
    const id = setTimeout(() => setHoveredItem(null), 200); // Add a short delay
    setTimeoutId(id);
  };

  return (
    <header className="header">
      <div className="container">
        <div className="flex justify-between items-center py-6 md:justify-start md:space-x-10">
          <div className="flex justify-start lg:w-0 lg:flex-1">
            <a href="/" className="brand">
              TripTomania
            </a>
          </div>
          <nav className="hidden md:flex space-x-10">
            {menuItems.map((item) => (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => handleMouseEnter(item.name)}
                onMouseLeave={handleMouseLeave}
              >
                <a 
                  href={item.href || '#'} 
                  className={`nav-link ${!item.href ? 'cursor-default' : ''}`}
                  onClick={(e) => !item.href && e.preventDefault()}
                >
                  {item.name}
                </a>
                {item.subitems && hoveredItem === item.name && (
                  <div
                    className="dropdown absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
                    onMouseEnter={() => handleMouseEnter(item.name)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                      {item.subitems.map((subitem) => (
                        <a
                          key={subitem.name}
                          href={subitem.href || '#'}
                          className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 ${!subitem.href ? 'cursor-default' : ''}`}
                          role="menuitem"
                          onClick={(e) => !subitem.href && e.preventDefault()}
                        >
                          {subitem.name}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>
          <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
            <a href="/notifications" className="icon-link">
              <Bell className="h-6 w-6 text-black hover:text-primary" />
            </a>
            <a href="/profile" className="icon-link ml-6">
              <User className="h-6 w-6 text-black hover:text-primary" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
