import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            // Connect to the socket server only when the user is logged in
            const newSocket = io(process.env.REACT_APP_API_URL || 'http://localhost:3001');
            
            // Register user with the socket server
            newSocket.emit('register_student', user.id); // Assuming user object has an 'id'

            setSocket(newSocket);

            // Disconnect when the component unmounts or user logs out
            return () => newSocket.close();
        }
    }, [user]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);