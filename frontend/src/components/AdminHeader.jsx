import React, { useState } from 'react';
import { Bell, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import './AdminHeader.css';

const menuItems = [
  { name: 'Home', href: '/admin/home' },
  { name: 'Activities', href: '/admin/viewActivitiesAdmin' },
  { name: 'Complaints', href: '/admin/complaints' },
  { name: 'Itineraries', href: '/Admin/ViewItinerariesAdmin' },
  {
   name: 'User Accounts',
    href: '#',
    subitems: [
      { name: 'Account Deletion', href: '/admin/deleteUsers' },
      { name: 'Document Reviews', href: '#' },
      { name: 'Accounts Creation', href: '/admin/accountCreation' }, 
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
      { name: 'Activity Categories', href: '/admin/activityCategories' },
      { name: 'Preference Tags', href: '/admin/preferenceTags' },
      { name: 'Reports', href: '#' },
      { name: 'Promo Codes', href: '/admin/promoCode' },
    ],
  },
];

export function Header() {
  const [hoveredItem, setHoveredItem] = useState(null);
  const navigate = useNavigate();

  const handleMouseEnter = (itemName) => {
    setHoveredItem(itemName);
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  const handleSubItemClick = (href) => {
    if (href && href !== '#') {
      navigate(href);
      setHoveredItem(null);
    }
  };

  return (
    <header className="header">
      <div className="container">
        <div className="flex justify-between items-center py-6 md:justify-start md:space-x-10">
          <div className="flex justify-start lg:w-0 lg:flex-1">
            <Link to="/admin/home" className="brand">
              TripTomania
            </Link>
          </div>
          <nav className="hidden md:flex space-x-10">
            {menuItems.map((item) => (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => handleMouseEnter(item.name)}
                onMouseLeave={handleMouseLeave}
              >
                <Link 
                  to={item.href || '#'} 
                  className={`header-link ${!item.href ? 'cursor-default' : ''}`}
                  onClick={(e) => !item.href && e.preventDefault()}
                >
                  {item.name}
                </Link>
                {item.subitems && hoveredItem === item.name && (
                  <div
                    className="dropdown"
                    onMouseEnter={() => handleMouseEnter(item.name)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                      {item.subitems.map((subitem) => (
                        <Link
                          key={subitem.name}
                          to={subitem.href || '#'}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                          onClick={(e) => {
                            e.preventDefault();
                            handleSubItemClick(subitem.href);
                          }}
                        >
                          {subitem.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>
          <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
            <Link to="/admin/notifications" className="icon-link">
              <Bell className="h-6 w-6 text-black hover:text-primary" />
            </Link>
            <Link to="/profile" className="icon-link ml-6">
              <User className="h-6 w-6 text-black hover:text-primary" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}