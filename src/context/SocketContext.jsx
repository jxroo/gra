import React, { createContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => React.useContext(SocketContext);


export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        // Use environment variable for production, fallback to localhost for development
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
        const newSocket = io(backendUrl);

        newSocket.on('connect', () => {
            console.log('Connected to server');
            setConnected(true);
            setSocket(newSocket);
        });

        newSocket.on('disconnect', () => {
            console.log('Disconnected from server');
            setConnected(false);
        });

        return () => newSocket.close();
    }, []);

    const value = {
        socket,
        connected
    };

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
};

export { SocketContext };
