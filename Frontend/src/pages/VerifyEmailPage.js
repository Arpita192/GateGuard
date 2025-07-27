import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const VerifyEmailPage = () => {
    const { token } = useParams(); // Get the token from the URL
    const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
    const [message, setMessage] = useState('Verifying your email, please wait...');

    useEffect(() => {
        const verifyUserEmail = async () => {
            if (!token) {
                setStatus('error');
                setMessage('No verification token found.');
                return;
            }

            try {
                // The API endpoint matches the one in our backend routes
                const response = await axios.get(`/api/auth/verify-email/${token}`);
                setStatus('success');
                setMessage(response.data.message);
            } catch (error) {
                setStatus('error');
                setMessage(error.response?.data?.message || 'An error occurred during verification.');
            }
        };

        verifyUserEmail();
    }, [token]); // Effect runs when the token changes

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', textAlign: 'center', marginTop: '100px' }}>
            <h1>Email Verification</h1>
            {status === 'verifying' && <p style={{ color: 'blue' }}>{message}</p>}
            {status === 'success' && (
                <div>
                    <p style={{ color: 'green' }}>{message}</p>
                    <Link to="/login" style={{ textDecoration: 'none', color: 'white', backgroundColor: '#007BFF', padding: '10px 20px', borderRadius: '5px', display: 'inline-block', marginTop: '20px' }}>
                        Proceed to Login
                    </Link>
                </div>
            )}
            {status === 'error' && (
                 <div>
                    <p style={{ color: 'red' }}>{message}</p>
                     <Link to="/register" style={{ textDecoration: 'none', color: 'white', backgroundColor: '#dc3545', padding: '10px 20px', borderRadius: '5px', display: 'inline-block', marginTop: '20px' }}>
                        Try Registering Again
                    </Link>
                </div>
            )}
        </div>
    );
};

export default VerifyEmailPage;
