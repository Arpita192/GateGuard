import React, { useState, useEffect, useCallback } from 'react';
import api from '../api';
import Spinner from '../components/common/Spinner';
import Button from '../components/common/Button';

// Re-using some styles from other pages
import './WardenDashboardPage.css';
import './ProfilePage.css';

const UserManagementPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const initialFormState = { 
        name: '', 
        email: '', 
        password: '', 
        role: 'student',
        institute: 'GateGuard Institute' 
    };
    const [formData, setFormData] = useState(initialFormState);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/users');
            setUsers(res.data);
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
        // Clear form data when component mounts
        setFormData(initialFormState);
        setShowPassword(false);
    }, [fetchData]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Basic validation
            if (!formData.name.trim()) {
                alert('Name is required');
                return;
            }

            if (!formData.email.includes('@')) {
                alert('Please enter a valid email address');
                return;
            }

            if (formData.password.length < 6) {
                alert('Password must be at least 6 characters long');
                return;
            }

            // Send only the required fields
            const userData = {
                name: formData.name.trim(),
                email: formData.email.trim().toLowerCase(),
                password: formData.password,
                role: formData.role
            };

            console.log('Attempting to create user:', userData);
            const response = await api.post('/admin/users', userData);
            console.log('Response:', response); // Debug log
            
            if (response.status === 201) {
                alert(response.data.message || 'User created successfully!');
                await fetchData(); // Refresh the user list
                // Reset form data to initial state
                setFormData(initialFormState);
                setShowPassword(false); // Reset password visibility
            }
        } catch (error) {
            console.error('Create user error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to create user';
            console.error('Error details:', errorMessage); // Debug log
            alert(`Failed to create user: ${errorMessage}`);
        }
    };

    const handleDelete = async (userId, userName) => {
        if (!userId) {
            alert('Invalid user ID');
            return;
        }

        if (!window.confirm(`Are you sure you want to delete ${userName}?`)) {
            return;
        }
        
        try {
            setDeleteLoading(true);
            console.log('Deleting user:', userId); // Debug log
            const response = await api.delete(`/admin/users/${userId}`);
            console.log('Delete response:', response); // Debug log
            
            if (response.status === 200) {
                alert('User deleted successfully');
                await fetchData(); // Refresh the user list
            }
        } catch (error) {
            console.error('Delete error:', error);
            console.error('Error details:', error.response || error); // Debug log
            
            if (error.response?.status === 403) {
                alert('Cannot delete super admin users');
            } else if (error.response?.status === 404) {
                alert('User not found');
                await fetchData(); // Refresh the list in case user was already deleted
            } else {
                const errorMessage = error.response?.data?.message || error.message || 'Failed to delete user';
                alert(`Failed to delete user: ${errorMessage}`);
            }
        } finally {
            setDeleteLoading(false);
        }
    };

    if (loading) return <div className="warden-dashboard"><Spinner /></div>;

    return (
        <div className="warden-dashboard">
            <h1>User Management</h1>
            <section className="requests-section" style={{marginBottom: '2rem'}}>
                <h2>Create User Account</h2>
                <form 
                    onSubmit={handleSubmit} 
                    className="profile-form" 
                    autoComplete="off"
                >
                    <div className="form-grid">
                        <div className="input-group">
                            <label>Name</label>
                            <input 
                                type="text" 
                                name="name" 
                                value={formData.name} 
                                onChange={handleChange} 
                                required 
                                placeholder="Enter name"
                                autoComplete="off"
                            />
                        </div>
                        <div className="input-group">
                            <label>Email</label>
                            <input 
                                type="email" 
                                name="email" 
                                value={formData.email} 
                                onChange={handleChange} 
                                required 
                                placeholder="Enter email"
                                autoComplete="off"
                                autoFill="off"
                            />
                        </div>
                        <div className="input-group">
                            <label>Password</label>
                            <div className="password-input-container">
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    name="password" 
                                    value={formData.password}
                                    onChange={handleChange} 
                                    required 
                                    placeholder="Enter password"
                                    autoComplete="new-password"
                                />
                                <button 
                                    type="button" 
                                    className="password-toggle-btn"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? "👁️" : "👁️‍🗨️"}
                                </button>
                            </div>
                        </div>
                        <div className="input-group">
                            <label>Role</label>
                            <select name="role" value={formData.role} onChange={handleChange} style={{width: '100%', padding: '1rem', border: '1px solid #415a77', backgroundColor: '#0d1b2a', color: '#e0e1dd', borderRadius: '8px'}}>
                                <option value="student">Student</option>
                                <option value="warden">Warden</option>
                                <option value="clerk">Clerk</option>
                                <option value="security">Security</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-actions"><Button type="submit">Create User</Button></div>
                </form>
            </section>
            <section className="history-section">
                <h2>All Users ({users.length})</h2>
                <table className="history-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>
                                    {user.role !== 'super-admin' && (
                                        <button
                                            onClick={() => handleDelete(user._id, user.name)}
                                            disabled={deleteLoading}
                                            style={{
                                                padding: '0.5rem 1rem',
                                                background: '#ff4444',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Delete
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </div>
    );
};

export default UserManagementPage;