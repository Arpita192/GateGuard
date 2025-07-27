import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';
import { FaCheck, FaTimes, FaRegFolderOpen } from 'react-icons/fa';
import './ClerkDashboardPage.css';

const ClerkDashboardPage = () => {
    const [pendingApprovals, setPendingApprovals] = useState([]);
    const [loading, setLoading] = useState(true);
    const BACKEND_URL = 'http://localhost:3001';

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get('/clerk/pending');
            setPendingApprovals(response.data);
        } catch (error) {
            console.error("Failed to fetch photo approvals", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleApproval = async (approvalId, status) => {
        try {
            // Correct API call to POST /api/clerk/:id
            await api.post(`/clerk/${approvalId}`, { status });
            fetchData();
        } catch (error) {
            alert(`Failed to ${status} request.`);
        }
    };
    
    if (loading) return <div className="clerk-dashboard"><Spinner /></div>;

    return (
        <div className="clerk-dashboard">
            <header className="clerk-header">
                <h1>Photo Approval Requests</h1>
                <Link to="/clerk/students" className="search-students-btn">Search Student History</Link>
            </header>

            <div className="approval-list" style={{marginTop: '2rem'}}>
                {pendingApprovals.length > 0 ? pendingApprovals.map(req => (
                    <div key={req._id} className="approval-card">
                        <div className="photo-comparison">
                            <div className="photo-box">
                                <img src={`${BACKEND_URL}${req.student.avatarUrl}`} alt="Current" />
                                <p>Current Photo</p>
                            </div>
                            <div className="photo-box">
                                <img src={`${BACKEND_URL}${req.newAvatarUrl}`} alt="New" />
                                <p>New Photo</p>
                            </div>
                        </div>
                        <div className="approval-details">
                            <h3>{req.student.name}</h3>
                            <p>Room: {req.student.roomNo} | Branch: {req.student.branch}</p>
                            <div className="approval-actions">
                                <Button className="action-btn approve" onClick={() => handleApproval(req._id, 'approved')}><FaCheck /> Approve</Button>
                                <Button className="action-btn reject" onClick={() => handleApproval(req._id, 'rejected')}><FaTimes /> Reject</Button>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="empty-state">
                        <div className="empty-state-icon"><FaRegFolderOpen /></div>
                        <h2>No Pending Approvals</h2>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClerkDashboardPage;