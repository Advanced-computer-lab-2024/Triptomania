import React from 'react';

const ResetPassword = () => {
  return (
    <div className="reset-password-container">
      <h1>Reset Password</h1>
      <form>
        <div className="form-group">
          <label>Enter your email</label>
          <input type="email" placeholder="Enter your email" required />
        </div>
        <button type="submit" className="reset-button">Send Reset Link</button>
      </form>
    </div>
  );
};

export default ResetPassword;
