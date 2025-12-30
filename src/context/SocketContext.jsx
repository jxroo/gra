import React, { createContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => React.useContext(SocketContext);


export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        // Assuming server runs on localhost:3000 locally
        // For production, this should be an env variable
        const newSocket = io('http://192.168.0.26:3000');

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
