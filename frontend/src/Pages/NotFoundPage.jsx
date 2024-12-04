import React from 'react';
import { Link } from 'react-router-dom';
import './NotFoundPage.css';

const NotFoundPage = () => {
  return (
    <div className="not-found">
      <img
        src="https://img.freepik.com/free-vector/funny-error-404-background-design_1167-219.jpg"
        alt="Funny 404"
        className="not-found-img"
      />
      <h1>Oops! Page not found.</h1>
      <p>We can't seem to find the page you're looking for.</p>
      <Link to="/" className="back-home">
        Go Back to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
