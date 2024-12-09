import React from 'react';
import { useNavigate } from 'react-router-dom';
import './TermsAndConditions.css'; // Optional: Add your styles here
import axiosInstance from '@/axiosInstance';
import { useUser } from '@/UserContext.jsx';

const TermsAndConditions = () => {
    const navigate = useNavigate();
    const { user, setUser } = useUser();

    const handleAccept = async () => {
        try {
            const type = user.type;
            const response = await axiosInstance.put(`/api/${type}/accept-terms`);
            if (response.status === 200) {
                navigate(`/${type}/home`);
            }
        } catch (error) {
            alert('Failed to accept terms and conditions');
        }
    };

    return (
        <div className="terms-container">
            <h1>Terms and Conditions</h1>
            <div className="terms-content">
                <ul>
                    <li>
                        <strong>Introduction:</strong>  
                        Welcome to Triptomania! These Terms and Conditions govern your use of our mobile application and services. By using Triptomania, you agree to comply with these terms. If you do not agree, you must not use the app.
                    </li>
                    <li>
                        <strong>User Accounts:</strong>  
                        <ul>
                            <li>To access certain features, you must create an account and provide accurate information.</li>
                            <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
                            <li>Triptomania reserves the right to terminate accounts that violate these terms.</li>
                        </ul>
                    </li>
                    <li>
                        <strong>Booking and Payments:</strong>  
                        <ul>
                            <li>All bookings are subject to availability and confirmation by the service provider.</li>
                            <li>Payments must be made as specified during the booking process.</li>
                            <li>Cancellations and refunds are subject to the service provider’s policies.</li>
                        </ul>
                    </li>
                    <li>
                        <strong>User Conduct:</strong>  
                        <ul>
                            <li>Do not use Triptomania for unlawful purposes or in violation of any laws.</li>
                            <li>Do not submit false or misleading information.</li>
                            <li>Do not interfere with the app’s operation or access it through unauthorized means.</li>
                        </ul>
                    </li>
                    <li>
                        <strong>Intellectual Property:</strong>  
                        <ul>
                            <li>Triptomania and its content are owned by [Your Company Name] and protected by copyright and trademark laws.</li>
                            <li>Do not reproduce, distribute, or modify any part of the app without written consent.</li>
                        </ul>
                    </li>
                    <li>
                        <strong>Limitation of Liability:</strong>  
                        <ul>
                            <li>Triptomania is provided "as is." We do not guarantee uninterrupted or error-free operation.</li>
                            <li>We are not responsible for losses or damages resulting from app usage.</li>
                        </ul>
                    </li>
                    <li>
                        <strong>Changes to Terms:</strong>  
                        <ul>
                            <li>We may modify these terms at any time. Changes are effective upon posting.</li>
                            <li>Continued use of the app signifies your acceptance of updated terms.</li>
                        </ul>
                    </li>
                    <li>
                        <strong>Contact Us:</strong>  
                        For questions or concerns, contact us at <strong>triptomania.app@gmail.com</strong>.
                    </li>
                </ul>
            </div>
            <button onClick={handleAccept} id="tab-button" className="bg-primary text-white px-4 py-2 rounded-md mt-2">
                Accept Terms and Conditions
            </button>
        </div>
    );
};

export default TermsAndConditions;
