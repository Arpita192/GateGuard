import React, { useState, useCallback } from 'react';
import Scanner from '../components/Scanner'; // We will use our corrected Scanner component
import Button from '../components/common/Button';
import api from '../api';
import { FaQrcode, FaUserCheck, FaSignInAlt, FaSignOutAlt, FaStopCircle } from 'react-icons/fa';
import './SecurityScannerPage.css';

// ScanResultCard component remains the same as it's not causing the issue.
const ScanResultCard = ({ passData, scanTime, onAction }) => {
    const BACKEND_URL = 'http://localhost:3001';
    if (!passData) return null;

    const { student, status, departureDate, departureTime, updatedAt } = passData;

    return (
        <div className="result-card">
            <img src={`${BACKEND_URL}${student.avatarUrl}`} alt="Student" />
            <h3>{student.name}</h3>
            <p>Room: {student.roomNo}</p>
            <div style={{ textAlign: 'left', margin: '1rem 0', borderTop: '1px solid #415a77', paddingTop: '1rem' }}>
                <p><strong>Departure:</strong> {new Date(departureDate).toLocaleDateString()} at {departureTime}</p>
                <p><strong>Approved On:</strong> {new Date(updatedAt).toLocaleDateString()}</p>
                <p><strong>Scan Time:</strong> {scanTime.toLocaleTimeString()}</p>
            </div>
            <div className="result-actions">
                {status === 'Approved' && <Button className="action-btn exit" onClick={() => onAction('exit', passData._id)}><FaSignOutAlt /> Approve Exit</Button>}
                {status === 'Active' && <Button className="action-btn entry" onClick={() => onAction('entry', passData._id)}><FaSignInAlt /> Approve Entry</Button>}
            </div>
        </div>
    );
};


const SecurityScannerPage = () => {
    const [scanResult, setScanResult] = useState(null);
    const [feedback, setFeedback] = useState('');
    const [showScanner, setShowScanner] = useState(false);
    const [scanTime, setScanTime] = useState(null);

    const handleScanSuccess = useCallback(async (passId) => {
        setShowScanner(false); // Hide the scanner component after a successful scan
        setScanTime(new Date());
        try {
            const { data } = await api.post('/scanner/verify', { passId });
            setScanResult(data.valid ? data.pass : null);
            setFeedback(data.valid ? '' : data.message);
        } catch (error) {
            setFeedback(error.response?.data?.message || "Verification failed.");
        }
    }, []);

    const handleAction = async (action, passId) => {
        setScanResult(null);
        try {
            const { data } = await api.post(`/scanner/${action}`, { passId });
            setFeedback(data.message);
        } catch (error) {
            setFeedback(error.response?.data?.message || 'Action failed.');
        } finally {
            setTimeout(() => setFeedback(''), 3000);
        }
    };

    return (
        <div className="scanner-page">
            <header className="scanner-page-header">
                <h1>Security Gate Scanner</h1>
                <p>Verify a student's gate pass by scanning their QR code.</p>
            </header>
            <div className="scanner-layout">
                <div className="scanner-container">
                    <div className="scanner-header">
                        <h2><FaQrcode /> Scanner Feed</h2>
                        {showScanner && <div className="live-indicator">LIVE</div>}
                    </div>

                    {/* This is the key change. We conditionally render the Scanner 
                        component itself. When showScanner is false, the Scanner component 
                        is completely removed from the page, ensuring its cleanup 
                        function is called correctly. */}
                    {showScanner ? (
                        <>
                            <Scanner onScanSuccess={handleScanSuccess} />
                            <Button 
                                className="action-btn" 
                                onClick={() => setShowScanner(false)} 
                                style={{ marginTop: '1rem', backgroundColor: '#f44336' }}
                            >
                                <FaStopCircle style={{ marginRight: '8px' }} /> Stop Scanner
                            </Button>
                        </>
                    ) : (
                        <div className="no-scan-data" style={{ marginTop: '1rem' }}>
                            <Button className="action-btn" onClick={() => setShowScanner(true)}>
                                Start Scanner
                            </Button>
                        </div>
                    )}
                </div>
                <div className="scan-results-container">
                    <h2><FaUserCheck /> Last Scan Result</h2>
                    {scanResult ? (
                        <ScanResultCard passData={scanResult} scanTime={scanTime} onAction={handleAction} />
                    ) : (
                        <div className="no-scan-data">
                            <p>{feedback || 'Click "Start Scanner" to begin.'}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SecurityScannerPage;