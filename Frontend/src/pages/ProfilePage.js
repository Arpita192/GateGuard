import React, { useState, useEffect, useRef } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/common/Spinner';
import Button from '../components/common/Button';
import { FaCamera } from 'react-icons/fa';
import './ProfilePage.css';

const ProfilePage = () => {
    const { user: authUser, login: updateAuthContext } = useAuth();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const [formData, setFormData] = useState({
        name: '', phone: '', employeeId: '', department: '',
        roomNo: '', branch: '', batch: ''
    });

    const fileInputRef = useRef(null);

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            try {
                const { data } = await api.get('/users/profile');
                setProfileData(data);
                setFormData({
                    name: data.name || '',
                    phone: data.phone || '',
                    employeeId: data.employeeId || '',
                    department: data.department || '',
                    roomNo: data.roomNo || '',
                    branch: data.branch || '',
                    batch: data.batch || ''
                });
            } catch (err) {
                setError('Failed to load profile data.');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data: updatedProfile } = await api.put('/users/profile', formData);
            const newUserInfoForContext = { ...updatedProfile, token: authUser.token };
            updateAuthContext(newUserInfoForContext);
            setProfileData(updatedProfile);
            alert('Profile updated successfully!');
        } catch (err) {
            alert('Failed to update profile.');
        }
    };

    const handleAvatarClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadFormData = new FormData();
        uploadFormData.append('avatar', file);

        try {
            // --- THIS IS THE CORRECTED LOGIC ---
            // We get the success message from the backend.
            const { data } = await api.post('/users/profile/picture', uploadFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Instead of an alert, we can use a more subtle confirmation.
            // For now, we will use a simple alert with the correct message.
            alert(data.message); // This will now say "Profile picture submitted for approval."

        } catch (err) {
            // If there's an error, we show the error message.
            alert(err.response?.data?.message || 'Failed to upload profile picture.');
        }
    };

    if (loading) return <div className="profile-page"><Spinner /></div>;
    if (error || !profileData) return <div className="profile-page"><p>{error || 'Could not load profile.'}</p></div>;

    return (
        <div className="profile-page">
            <div className="profile-container">
                <div className="profile-header">
                    <div className="avatar-upload">
                        <img 
                            src={`http://localhost:3001${profileData.avatarUrl}`} 
                            alt="Avatar" 
                            className="avatar" 
                            onClick={handleAvatarClick}
                        />
                        <button className="upload-btn" onClick={handleAvatarClick}>
                            <FaCamera />
                        </button>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleFileChange}
                            style={{ display: 'none' }} 
                            accept="image/*"
                        />
                    </div>
                    <div className="profile-info">
                        <h2>{profileData.name}</h2>
                        <p>{profileData.email}</p>
                    </div>
                </div>

                <form className="profile-form" onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <h3>Personal Information</h3>
                        <div className="input-group">
                            <label>Full Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} />
                        </div>
                        <div className="input-group">
                            <label>Email</label>
                            <input type="email" value={profileData.email} disabled />
                        </div>

                        {['warden', 'clerk', 'security'].includes(profileData.role) && (
                            <>
                                <h3>Staff Information</h3>
                                <div className="input-group">
                                    <label>Phone Number</label>
                                    <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
                                </div>
                                <div className="input-group">
                                    <label>Employee ID</label>
                                    <input type="text" name="employeeId" value={formData.employeeId} onChange={handleChange} />
                                </div>
                            </>
                        )}
                        {profileData.role === 'warden' && (
                            <div className="input-group">
                                <label>Department</label>
                                <input type="text" name="department" value={formData.department} onChange={handleChange} />
                            </div>
                        )}
                        {profileData.role === 'student' && (
                            <>
                                <h3>Hostel Information</h3>
                                <div className="input-group">
                                    <label>Room Number</label>
                                    <input type="text" name="roomNo" value={formData.roomNo} onChange={handleChange} />
                                </div>
                                <div className="input-group">
                                    <label>Branch</label>
                                    <input type="text" name="branch" value={formData.branch} onChange={handleChange} />
                                </div>
                                <div className="input-group">
                                    <label>Batch</label>
                                    <input type="text" name="batch" value={formData.batch} onChange={handleChange} />
                                </div>
                            </>
                        )}
                    </div>
                    <div className="form-actions">
                        <Button type="submit">Save Changes</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfilePage;