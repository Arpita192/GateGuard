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
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'warden' });

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
    }, [fetchData]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/users', formData);
            alert('Staff user created!');
            fetchData(); // Refresh the user list
            e.target.reset(); // Reset form fields
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to create user.');
        }
    };

    if (loading) return <div className="warden-dashboard"><Spinner /></div>;

    return (
        <div className="warden-dashboard">
            <h1>User Management</h1>
            <section className="requests-section" style={{marginBottom: '2rem'}}>
                <h2>Create Staff Account</h2>
                <form onSubmit={handleSubmit} className="profile-form">
                    <div className="form-grid">
                        <div className="input-group"><label>Name</label><input type="text" name="name" onChange={handleChange} required /></div>
                        <div className="input-group"><label>Email</label><input type="email" name="email" onChange={handleChange} required /></div>
                        <div className="input-group"><label>Password</label><input type="password" name="password" onChange={handleChange} required /></div>
                        <div className="input-group">
                            <label>Role</label>
                            <select name="role" value={formData.role} onChange={handleChange} style={{width: '100%', padding: '1rem', border: '1px solid #415a77', backgroundColor: '#0d1b2a', color: '#e0e1dd', borderRadius: '8px'}}>
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
                    <thead><tr><th>Name</th><th>Email</th><th>Role</th></tr></thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id}>
                                <td>{user.name}</td><td>{user.email}</td><td>{user.role}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </div>
    );
};

export default UserManagementPage;