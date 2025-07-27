import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';
import { FaBell, FaCheck, FaTimes, FaHistory } from 'react-icons/fa';
import './WardenDashboardPage.css';

const WardenDashboardPage = () => {
    const [requests, setRequests] = useState([]);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState('Pending');
    const BACKEND_URL = 'http://localhost:3001';

    // This function is now more robust.
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            // Fetch pending requests and full history in separate calls
            // This prevents an error in one from blocking the other.
            const pendingResponse = await api.get('/passes/warden/pending-requests');
            setRequests(pendingResponse.data || []);

            const historyResponse = await api.get('/passes/all');
            setHistory(historyResponse.data || []);

        } catch (error) {
            console.error("Failed to fetch warden data", error);
            // You could add an error message to the user here if you wish
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handlePassAction = async (passId, action) => {
        try {
            await api.post(`/passes/warden/requests/${passId}/${action}`);
            fetchData(); // Re-fetch data after an action
        } catch (error) {
            alert(`Failed to ${action} request.`);
        }
    };

    const filteredHistory = history.filter(pass =>
        pass.student && pass.student.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div className="warden-dashboard"><Spinner /></div>;
    }

    return (
        <div className="warden-dashboard">
            <header className="clerk-header">
                <h1>Warden Dashboard</h1>
                <Link to="/warden/students" className="search-students-btn">Search Students</Link>
            </header>

            <div className="history-tabs">
                <button className={`tab-btn ${activeTab === 'Pending' ? 'active' : ''}`} onClick={() => setActiveTab('Pending')}>
                    <FaBell style={{ marginRight: '8px' }} /> Pending Requests ({requests.length})
                </button>
                <button className={`tab-btn ${activeTab === 'History' ? 'active' : ''}`} onClick={() => setActiveTab('History')}>
                    <FaHistory style={{ marginRight: '8px' }} /> Full Pass History
                </button>
            </div>

            {activeTab === 'Pending' && (
                <div className="request-list">
                    {requests.length > 0 ? requests.map(req => (
                        <div key={req._id} className="request-card">
                            <div className="student-avatar">
                                <img src={`${BACKEND_URL}${req.student?.avatarUrl}`} alt={req.student?.name} />
                            </div>
                            <div className="request-details">
                                <h3>{req.student?.name || 'Unknown Student'}</h3>
                                <p className="meta-info">Room: {req.student?.roomNo} | Departs: {new Date(req.departureDate).toLocaleDateString()}</p>
                                <p className="reason">"{req.reason}"</p>
                            </div>
                            <div className="request-actions">
                                <Button className="action-btn approve" onClick={() => handlePassAction(req._id, 'approve')}><FaCheck /> Approve</Button>
                                <Button className="action-btn reject" onClick={() => handlePassAction(req._id, 'reject')}><FaTimes /> Reject</Button>
                            </div>
                        </div>
                    )) : <p>No pending gate pass requests.</p>}
                </div>
            )}

            {activeTab === 'History' && (
                <section className="history-section">
                    <div className="history-controls">
                        <input
                            type="text"
                            placeholder="Search by student name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <table className="history-table">
                        <thead>
                            <tr>
                                <th>Student</th>
                                <th>Reason</th>
                                <th>Departure</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredHistory.map(pass => (
                                <tr key={pass._id}>
                                    <td>{pass.student?.name || 'N/A'}</td>
                                    <td>{pass.reason}</td>
                                    <td>{new Date(pass.departureDate).toLocaleDateString()}</td>
                                    <td>{pass.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            )}
        </div>
    );
};

export default WardenDashboardPage;