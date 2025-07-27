import React, { useState, useEffect, useCallback } from 'react';
import api from '../api';
import RequestPassForm from '../components/common/RequestPassForm';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';
import { FaHistory, FaTicketAlt, FaPlusCircle, FaUndo } from 'react-icons/fa';
import './StudentDashboardPage.css';

const StudentDashboardPage = () => {
    const [allPasses, setAllPasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [activeTab, setActiveTab] = useState('Upcoming');
    const [selectedPass, setSelectedPass] = useState(null); // <-- New state for selected pass

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get('/passes/student/all');
            setAllPasses(res.data || []);
        } catch (error) {
            console.error("Failed to fetch student data", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleRequestSubmit = async (requestData) => {
        try {
            await api.post('/passes/request', requestData);
            setShowForm(false);
            fetchData();
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message;
            alert(`Failed to submit request: ${errorMessage}`);
        }
    };

    // --- UPDATED LOGIC ---
    // 1. Automatically find the most important active pass
    let autoCurrentPass = allPasses.find(p => p.status === 'Approved' || p.status === 'Active');
    if (!autoCurrentPass) {
      autoCurrentPass = allPasses.find(p => p.status === 'Pending');
    }
    
    // 2. Decide which pass to display: the user's selection or the automatic one
    const displayPass = selectedPass || autoCurrentPass;

    const filteredHistory = allPasses.filter(p => {
        const status = p.status.toLowerCase();
        if (activeTab === 'Upcoming') return status === 'approved' || status === 'pending';
        if (activeTab === 'Completed') return status === 'completed' || status === 'rejected';
        return true;
    });

    const handleHistoryClick = (pass) => {
        setSelectedPass(pass); // Set the selected pass when a history item is clicked
    };
    
    if (loading) {
        return <div className="dashboard-page"><Spinner /></div>;
    }

    return (
        <div className="dashboard-page">
            <header className="dashboard-header">
                <div><h1>Welcome!</h1><p>Here's your gate pass status and history.</p></div>
                <Button className="request-btn" onClick={() => setShowForm(true)}>
                    <FaPlusCircle style={{ marginRight: '8px' }} /> Request New Pass
                </Button>
            </header>

            {showForm ? (
                <RequestPassForm onSubmit={handleRequestSubmit} onCancel={() => setShowForm(false)} />
            ) : (
                <div className="dashboard-content">
                    <main className="status-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2><FaTicketAlt style={{ marginRight: '10px' }} /> 
                                {selectedPass ? 'Viewing Pass Details' : 'Current Pass'}
                            </h2>
                            {/* Show a "Back" button only if a pass is manually selected */}
                            {selectedPass && (
                                <Button className="action-btn" onClick={() => setSelectedPass(null)} style={{fontSize: '0.8rem', padding: '0.4rem 0.8rem'}}>
                                    <FaUndo style={{ marginRight: '5px' }} /> Back to Current
                                </Button>
                            )}
                        </div>
                        {displayPass ? (
                            <div>
                                <div className="pass-details-grid">
                                    <div className="detail-item"><span>Status</span><span className={`status-badge ${displayPass.status}`}>{displayPass.status}</span></div>
                                    <div className="detail-item"><span>Reason</span><span>{displayPass.reason}</span></div>
                                    <div className="detail-item"><span>Departure</span><span>{displayPass.departureDate && `${new Date(displayPass.departureDate).toLocaleDateString()} at ${displayPass.departureTime}`}</span></div>
                                    <div className="detail-item"><span>Return</span><span>{displayPass.returnDate ? new Date(displayPass.returnDate).toLocaleDateString() : 'N/A'}</span></div>
                                </div>
                                {displayPass.status.toLowerCase() === 'approved' && (
                                    <div className="qr-code-container">
                                        <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${displayPass._id}`} alt="Gate Pass QR Code" />
                                        <p style={{color: '#333', marginTop: '1rem', fontWeight: '500'}}>Scan at the gate</p>
                                    </div>
                                )}
                            </div>
                        ) : ( <div className="no-pass-view"><p>You have no active gate pass requests.</p></div> )}
                    </main>
                    <aside className="pass-history">
                         <h2><FaHistory style={{ marginRight: '10px' }} /> Pass History</h2>
                        <div className="history-tabs">
                           <button className={`tab-btn ${activeTab === 'Upcoming' ? 'active' : ''}`} onClick={() => setActiveTab('Upcoming')}>Upcoming</button>
                           <button className={`tab-btn ${activeTab === 'Completed' ? 'active' : ''}`} onClick={() => setActiveTab('Completed')}>Completed</button>
                           <button className={`tab-btn ${activeTab === 'All' ? 'active' : ''}`} onClick={() => setActiveTab('All')}>All</button>
                        </div>
                        <ul>
                            {filteredHistory.length > 0 ? filteredHistory.map(p => (
                                // Add onClick handler to each list item
                                <li key={p._id} className="history-item" onClick={() => handleHistoryClick(p)}>
                                    <div>
                                        <p className="reason">{p.reason}</p>
                                        <p className="date">{p.departureDate && new Date(p.departureDate).toLocaleDateString()}</p>
                                    </div>
                                    <span className={`status-badge ${p.status}`}>{p.status}</span>
                                </li>
                            )) : <p style={{textAlign: 'center', color: '#778da9'}}>No passes in this category.</p>}
                        </ul>
                    </aside>
                </div>
            )}
        </div>
    );
};

export default StudentDashboardPage;