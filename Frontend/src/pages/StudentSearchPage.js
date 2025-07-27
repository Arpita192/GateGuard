import React, { useState, useEffect } from 'react';
import api from '../api';
import './StudentSearchPage.css';

const StudentSearchPage = () => {
    const [branches, setBranches] =useState([]);
    const [batches, setBatches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState('All');
    const [selectedBatch, setSelectedBatch] = useState('All');
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [passHistory, setPassHistory] = useState([]);
    const [approvalHistory, setApprovalHistory] = useState([]); // <-- New state for photo history

    useEffect(() => {
        api.get('/users/branches').then(res => setBranches(['All', ...res.data]));
        api.get('/users/batches').then(res => setBatches(['All', ...res.data]));
    }, []);

    useEffect(() => {
        const params = { branch: selectedBranch, batch: selectedBatch };
        api.get('/users/students/search', { params }).then(res => {
            setStudents(res.data);
            setSelectedStudent(null);
            setPassHistory([]);
            setApprovalHistory([]); // <-- Reset photo history on filter change
        });
    }, [selectedBranch, selectedBatch]);

    // This function now fetches BOTH pass history and photo history
    const handleStudentClick = (student) => {
        setSelectedStudent(student);
        // Fetch pass history
        api.get(`/passes/student/${student._id}`).then(res => {
            setPassHistory(res.data);
        });
        // Fetch photo approval history
        api.get(`/clerk/history/${student._id}`).then(res => {
            setApprovalHistory(res.data);
        });
    };

    return (
        <div className="student-search-page">
            <h1>Student Search & History</h1>
            <div className="search-layout">
                <aside className="filter-panel">
                    <h2>Filters</h2>
                    <div className="filter-group">
                        <label>Branch</label>
                        <select value={selectedBranch} onChange={e => setSelectedBranch(e.target.value)}>
                            {branches.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                    </div>
                    <div className="filter-group">
                        <label>Batch</label>
                        <select value={selectedBatch} onChange={e => setSelectedBatch(e.target.value)}>
                            {batches.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                    </div>
                    <hr style={{borderColor: '#415a77', margin: '1.5rem 0'}}/>
                    <h3>Results ({students.length})</h3>
                    <ul className="student-list">
                        {students.map(s => (
                            <li key={s._id} className={selectedStudent?._id === s._id ? 'active' : ''} onClick={() => handleStudentClick(s)}>
                                {s.name}
                            </li>
                        ))}
                    </ul>
                </aside>
                <main className="results-panel">
                    <h2>{selectedStudent ? `${selectedStudent.name}'s History` : 'Select a Student'}</h2>
                    {selectedStudent && (
                        <div>
                            <div className="history-section">
                                <h4>Gate Pass History</h4>
                                {passHistory.length > 0 ? (
                                    <table className="history-table">
                                        <thead><tr><th>Reason</th><th>Departure</th><th>Status</th></tr></thead>
                                        <tbody>
                                            {passHistory.map(pass => (
                                                <tr key={pass._id}>
                                                    <td>{pass.reason}</td>
                                                    <td>{new Date(pass.departureDate).toLocaleDateString()}</td>
                                                    <td><span className={`status-badge ${pass.status}`}>{pass.status}</span></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : <p>No pass history found.</p>}
                            </div>

                            <div className="history-section">
                                <h4>Photo Approval History</h4>
                                {approvalHistory.length > 0 ? (
                                    <table className="history-table">
                                        <thead><tr><th>Date Submitted</th><th>Status</th><th>Reviewed By</th></tr></thead>
                                        <tbody>
                                            {approvalHistory.map(item => (
                                                <tr key={item._id}>
                                                    <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                                                    <td><span className={`status-badge ${item.status}`}>{item.status}</span></td>
                                                    <td>{item.reviewedBy?.name || 'N/A'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : <p>No photo approval history found.</p>}
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default StudentSearchPage;