import React, { useState } from 'react';
import Button from './Button';
import './RequestPassForm.css'; // We will create this CSS file

const RequestPassForm = ({ onSubmit, onCancel }) => {
    const [passType, setPassType] = useState('same-day'); // 'same-day' or 'overnight'
    const [reason, setReason] = useState('');
    const [departureDate, setDepartureDate] = useState('');
    const [departureTime, setDepartureTime] = useState('');
    const [returnTime, setReturnTime] = useState('');
    const [returnDate, setReturnDate] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const requestData = {
            passType,
            reason,
            departureDate,
            departureTime,
            // Conditionally add return date for overnight passes
            ...(passType === 'same-day' && { returnTime }),
            ...(passType === 'overnight' && { returnDate }),
        };
        onSubmit(requestData); // Pass data to the parent component
    };

    return (
        <div className="form-container">
            <h3>New Gate Pass Request</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Reason for Leave</label>
                    <textarea value={reason} onChange={(e) => setReason(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Pass Type</label>
                    <select value={passType} onChange={(e) => setPassType(e.target.value)}>
                        <option value="same-day">Same-Day Return</option>
                        <option value="overnight">Overnight/Multi-Day</option>
                    </select>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label>Departure Date</label>
                        <input type="date" value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Departure Time</label>
                        <input type="time" value={departureTime} onChange={(e) => setDepartureTime(e.target.value)} required />
                    </div>
                </div>

                {/* Conditional fields based on pass type */}
                {passType === 'same-day' ? (
                    <div className="form-group">
                        <label>Return Time</label>
                        <input type="time" value={returnTime} onChange={(e) => setReturnTime(e.target.value)} required />
                    </div>
                ) : (
                    <div className="form-group">
                        <label>Return Date</label>
                        <input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} required />
                    </div>
                )}
                
                <div className="form-actions">
                    <Button type="button" onClick={onCancel} className="btn-secondary">Cancel</Button>
                    <Button type="submit">Submit Request</Button>
                </div>
            </form>
        </div>
    );
};

export default RequestPassForm;