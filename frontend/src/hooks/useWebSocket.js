import {useEffect} from "react";

const useWebSocket = (onWebSocketData, url) => {
    useEffect(() => {
        // Connect to WebSocket
        const socket = new WebSocket(url);

        // Event listener for when the connection is opened
        socket.addEventListener('open', (event) => {
        });

        // Event listener for when a message is received from the WebSocket
        socket.addEventListener('message', (event) => {
            const data = JSON.parse(event.data);
            onWebSocketData(data);
        });

        // Event listener for when the connection is closed
        socket.addEventListener('close', (event) => {
        });

        // Cleanup function to close the WebSocket connection on component unmount
        return () => {
            socket.close();
        };
    }, []); // Empty dependency array to run the effect only once on mount
}

export default useWebSocket;