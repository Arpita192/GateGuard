import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaUserCircle, FaSignOutAlt, FaTachometerAlt, FaAngleDown, FaUsersCog } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownRef]);

    const getDashboardLink = () => {
        switch (user?.role) {
            case 'student': return '/student/dashboard';
            case 'warden': return '/warden/dashboard';
            case 'security': return '/security/scanner';
            case 'clerk': return '/clerk/dashboard';
            case 'super-admin': return '/admin/users';
            default: return '/';
        }
    };

    return (
        <nav className="navbar">
            <NavLink to={isAuthenticated ? getDashboardLink() : "/"} className="navbar-brand">GateGuard</NavLink>
            <div className="nav-links">
                {isAuthenticated && user ? (
                    <div className="user-menu" ref={dropdownRef}>
                        <button className="user-menu-trigger" onClick={() => setDropdownOpen(!dropdownOpen)}>
                            {user.name} <FaAngleDown style={{ marginLeft: '5px' }} />
                        </button>
                        {dropdownOpen && (
                            <div className="dropdown-menu">
                                <NavLink to={getDashboardLink()} onClick={() => setDropdownOpen(false)}>
                                    <FaTachometerAlt /> Dashboard
                                </NavLink>
                                <NavLink to="/profile" onClick={() => setDropdownOpen(false)}>
                                    <FaUserCircle /> Profile
                                </NavLink>
                                {user.role === 'super-admin' && (
                                    <NavLink to="/admin/users" onClick={() => setDropdownOpen(false)}>
                                        <FaUsersCog /> User Management
                                    </NavLink>
                                )}
                                <button onClick={logout} className="logout-btn">
                                    <FaSignOutAlt /> Logout
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <NavLink to="/login">Login</NavLink>
                )}
            </div>
        </nav>
    );
};

export default Navbar;