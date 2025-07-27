import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import './SignupPage.css';

const SignupPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            // The backend will automatically assign the 'student' role
            await api.post('/auth/register', formData);
            alert('Registration successful! Please log in.');
            navigate('/login');
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Registration failed.';
            alert(errorMessage);
        }
    };

    return (
        <div className="signup-page">
            <div className="login-form-container">
                <h1>Create Student Account</h1>
                <form onSubmit={handleSignup}>
                    <div className="input-group">
                        <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required />
                    </div>
                    <div className="input-group">
                        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                    </div>
                    <div className="input-group">
                        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
                    </div>
                    
                    {/* The role dropdown has been removed */}
                    
                    <button type="submit" className="login-button">Sign Up</button>
                    <p className="signup-link">
                        Already have an account? <Link to="/login">Login</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default SignupPage;