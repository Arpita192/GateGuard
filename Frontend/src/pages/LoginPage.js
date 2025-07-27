import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api'; // Import the api instance
import './LoginPage.css';

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { login } = useAuth(); // Get the login function from context
    const navigate = useNavigate();

    // This function handles the form submission
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            // Step 1: Call the backend API to log the user in
            const { data: loggedInUser } = await api.post('/auth/login', { email, password });

            // Step 2: If API call is successful, update the auth context
            login(loggedInUser);

            // Step 3: Redirect immediately based on the user's role
            switch (loggedInUser.role) {
                case 'student':
                    navigate('/student/dashboard');
                    break;
                case 'warden':
                    navigate('/warden/dashboard');
                    break;
                case 'security':
                    navigate('/security/scanner');
                    break;
                case 'clerk':
                    navigate('/clerk/dashboard');
                    break;
                case 'super-admin':
                    navigate('/admin/users'); // Corrected path to match component
                    break;
                default:
                    // Fallback to a generic profile page or the login page
                    navigate('/');
            }
        } catch (err) {
            // If there's an error, show it to the user
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
            setLoading(false);
        }
    };

    // This is the JSX for your beautiful animated background
    const bars = Array.from({ length: 40 });
    const radius = 250;
    return (
        <div className="login-page">
            <div className="circle-container">
                {bars.map((_, i) => {
                    const angle = (i * 9 * Math.PI) / 180;
                    const x = radius * Math.cos(angle);
                    const y = radius * Math.sin(angle);
                    return (
                        <div
                            key={i}
                            className="bar"
                            style={{
                                transform: `translate(${x}px, ${y}px) rotate(${i * 9 + 90}deg)`,
                                animationDelay: `${i * 0.15}s`
                            }}
                        ></div>
                    );
                })}
            </div>
            <div className="login-form-container">
                <h1>Login</h1>
                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p style={{ color: '#ef4444', marginBottom: '1rem' }}>{error}</p>}
                    <a href="#forgot" className="forgot-password">Forgot your password?</a>
                    <button type="submit" className="login-button" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                    <p className="signup-link">
                        Don't have an account? <Link to="/signup">Signup</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;