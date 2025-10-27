import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import './SignupPage.css';

const SignupPage = () => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        instituteName: '',
        phoneNumber: '',
        email: '',
        note: '',
        role: 'super-admin'
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(''); // Clear any previous errors
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            if (!formData.instituteName) {
                setError('Please enter your institute name');
                return;
            }
            if (!formData.phoneNumber) {
                setError('Please enter your phone number');
                return;
            }
            
            // Phone number validation
            if (!/^\d{10}$/.test(formData.phoneNumber)) {
                setError('Please enter a valid 10-digit phone number');
                return;
            }

            // Submit admin request instead of registration
            await api.post('/admin-requests/submit', {
                name: formData.name,
                instituteName: formData.instituteName,
                phoneNumber: formData.phoneNumber,
                email: formData.email,
                note: formData.note
            });
            
            setError('Request submitted successfully! Our team will contact you within 24-48 working hours.');
            setTimeout(() => navigate('/login'), 3000);
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Request submission failed.';
            setError(errorMessage);
        }
    };

    return (
        <div className="signup-page">
            {error && <div className="error-message">{error}</div>}
            <div className="login-form-container">
                <h1>Create Admin Account</h1>
                <form onSubmit={handleSignup}>
                    <div className="input-group">
                        <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required />
                    </div>
                    <div className="input-group">
                        <input 
                            type="text" 
                            name="instituteName" 
                            placeholder="Institute Name" 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <div className="input-group">
                        <input 
                            type="tel" 
                            name="phoneNumber" 
                            placeholder="Phone Number" 
                            onChange={handleChange} 
                            required 
                            pattern="[0-9]{10}"
                        />
                    </div>
                    <div className="input-group">
                        <input 
                            type="email" 
                            name="email" 
                            placeholder="Email (Optional)" 
                            onChange={handleChange} 
                        />
                    </div>
                    <div className="input-group">
                        <textarea 
                            name="note" 
                            placeholder="Any specific requirements or notes" 
                            onChange={handleChange}
                            rows="3"
                        ></textarea>
                    </div>
                    <input type="hidden" name="role" value="super-admin" />
                    
                    <button type="submit" className="login-button">
                        Request Admin Account
                        <div className="button-subtitle">Our team will contact you within 24-48 working hours</div>
                    </button>
                </form>
                <div className="back-link">
                    <Link to="/login">
                        <i className="fas fa-arrow-left"></i> Return to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;